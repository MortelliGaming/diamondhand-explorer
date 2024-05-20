import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref, ComputedRef } from 'vue';
import { blockchainConfigs } from '@/lib/chains'

import { ExplorerChainInfo } from '@/types';
import { useAppStore } from './app';
import { useCoinsStore } from './coins';
import { AppCurrency } from '@keplr-wallet/types'
import { Comet38Client, CometClient, NewBlockEvent } from '@cosmjs/tendermint-rpc';
import { 
    AuthExtension,
    BankExtension,
    DistributionExtension,
    GovExtension,
    IbcExtension,
    MintExtension,
    QueryClient,
    StakingExtension,
    StargateClient,
    TxExtension } from '@cosmjs/stargate';

import { FeegrantExtension, SlashingExtension, setupAuthExtension, setupBankExtension, setupDistributionExtension, setupFeegrantExtension, setupGovExtension, setupIbcExtension, setupMintExtension, setupSlashingExtension, setupStakingExtension, setupTxExtension } from '@cosmjs/stargate/build/modules';
import { AuthzExtension, setupAuthzExtension } from '@cosmjs/stargate/build/modules/authz/queries';
import { PublicClient, createPublicClient, http } from 'viem';

import { useValidatorsStore } from './validators';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export type CosmosClients = {
    queryClient: {
        client: QueryClient,
        extensions: {
            staking: StakingExtension,
            auth: AuthExtension,
            authZ: AuthzExtension,
            bank: BankExtension,
            distribution: DistributionExtension
            feeGrant: FeegrantExtension,
            gov: GovExtension,
            ibc: IbcExtension,
            mint: MintExtension,
            slashing: SlashingExtension,
            tx: TxExtension
        }
    },
    tendermintClient: CometClient,
    stargateClient: StargateClient,
    blockHeaderSubscription:  NodeJS.Timeout
}

export type ExplorerAsset = {
    display: {
        amount: number, 
        denom: string,
    }
    base: {
        amount: number, 
        denom: string,
        decimals: number
    }
}

export const useBlockchainStore = defineStore('blockchain', () => {
    const { init } = useCoinsStore()
    const isConnecting = ref(false)

    const latestBlocks: Ref<Record<string, NewBlockEvent[]>> = ref({})

    const chainClients: Ref<Record<string, {
        cosmosClients: CosmosClients|undefined,
        viemClient: PublicClient|undefined
    }>> = ref({})

    const availableChainNames = computed(() => {
        return availableChains.value.map(c => c.name)
    })
    
    const availableChains: ComputedRef<ExplorerChainInfo[]> = computed(() => {
        const { isTestnet } = storeToRefs(useAppStore())
        return Object.values(blockchainConfigs.networks)
            .filter(chainConfig => isTestnet.value 
                ? chainConfig.isTestnet === true 
                : chainConfig.isTestnet === false)
    })

    const availableCosmosChainIds = computed(() => {
        return availableChains.value.map(chain => chain.keplr?.chainId).filter(v => v != undefined) as string[]
    })
    const chainCurrencies = ref({} as Record<string, AppCurrency[]>)
    const chainSupplyCurrencies = ref({} as Record<string, AppCurrency[]>)

    const uniqueArray = <T>(array: T[], uniqueBy: (keyof T)[]) => {
        const map = new Map<string, boolean>();
        
        return array.filter((item) => {
            const key = uniqueBy.map((prop) => String(item[prop])).join('-');
            if (map.has(key)) {
            return false;
            }
            map.set(key, true);
            return true;
        });
    };
    const allCurrencies = computed(() => {
        return uniqueArray(availableChains.value?.flatMap(c  => {
            if(c.keplr?.chainId) {
                return c.keplr?.currencies.concat(chainCurrencies.value[c.name]).concat(chainSupplyCurrencies.value[c.name]).filter(c => c);
            } else {
                return chainSupplyCurrencies.value[c.name].concat(chainCurrencies.value[c.name]).filter(c => c);
            }
        }) as AppCurrency[], ['coinDenom']);
    })

    function getChainCurrencies(chainName: string) {
        const chain = availableChains.value.find(c => c.name == chainName);
        let result: AppCurrency[];
        if(chain?.keplr?.chainId) {
            result = chain.keplr.currencies.concat(chainCurrencies.value[chainName]).concat(chainSupplyCurrencies.value[chainName]).filter(c => c);
        } else {
            result = (chainSupplyCurrencies.value[chainName] || []).concat(chainCurrencies.value[chainName]).filter(c => c);
        }
        return uniqueArray(result,  ['coinMinimalDenom']);
    }

    function setupExtenstions(queryClient: QueryClient) {
        return {
            staking: setupStakingExtension(queryClient),
            auth: setupAuthExtension(queryClient),
            authZ: setupAuthzExtension(queryClient),
            bank: setupBankExtension(queryClient),
            distribution: setupDistributionExtension(queryClient),
            feeGrant: setupFeegrantExtension(queryClient),
            gov: setupGovExtension(queryClient),
            ibc: setupIbcExtension(queryClient),
            mint: setupMintExtension(queryClient),
            slashing: setupSlashingExtension(queryClient),
            tx: setupTxExtension(queryClient),
        }
    }

    async function connectClients() {
        isConnecting.value = true
        const allChains = availableChains.value
        for(const chainInfo of allChains){
            const clients = {
                cosmosClients: undefined,
                viemClient: undefined
            } as {
                cosmosClients: CosmosClients|undefined,
                viemClient: PublicClient|undefined
            }
            if(chainInfo.keplr) {
                disconnectCosmosClients(chainInfo.name)
                const stargateClient = await StargateClient.connect(chainInfo.keplr.rpc)
                const tendermintClient = await Comet38Client.connect(chainInfo.keplr.rpc)
                const queryClient = QueryClient.withExtensions(tendermintClient);
                console.log('rpc connected, subscribe block stream')
                const blockHeaderFetchInterval = setInterval(async () => {
                    const latestBlock = await tendermintClient.block();

                    if(latestBlocks.value[chainInfo.name]?.map(b => b.header.height).includes(latestBlock.block.header.height)) {
                        return;
                    }
                    if(!latestBlocks.value[chainInfo.name]) {
                        latestBlocks.value[chainInfo.name] = []
                    }
                    // keep 100 blocks
                    if (latestBlocks.value[chainInfo.name].length >= 100) {
                        latestBlocks.value[chainInfo.name].pop();
                    }
                    // Add the new item at position 0 (beginning of the array)
                    // console.log(Buffer.from(block.header.proposerAddress).toString('hex'))
                    latestBlocks.value[chainInfo.name].unshift(latestBlock.block);
                }, 1500)

                clients.cosmosClients = {
                    stargateClient,
                    tendermintClient,
                    queryClient: {
                        client: queryClient, 
                        extensions: setupExtenstions(queryClient)
                    },
                    blockHeaderSubscription: blockHeaderFetchInterval,
                }
            }
            if(chainInfo.evm) {
                if(chainInfo.evm.rpcUrls['default'].http.length > 0 && chainInfo.evm.rpcUrls['default'].http[0]) {
                    const viemClient =  createPublicClient({
                        transport: http(chainInfo.evm.rpcUrls['default'].http[0]),
                    })
                    clients.viemClient = viemClient
                }
            }
            chainClients.value[chainInfo.name] = clients

            const { loadCosmosValidators } = useValidatorsStore()
            loadCosmosValidators(chainInfo.name)
        }
        isConnecting.value = false;
        init();
        return Promise.resolve(true)
    }

    function disconnectCosmosClients(chainName: string) {
        if(chainClients.value[chainName]?.cosmosClients) {
            try {
                if(chainClients.value[chainName]?.cosmosClients?.blockHeaderSubscription) {
                    clearInterval(chainClients.value[chainName]?.cosmosClients?.blockHeaderSubscription)
                }
            } catch(error) { 
                console.log('cannot unsubscribe blockheader subscription')
                console.log(error)
            }
            try {
                console.log('cannot disconnect stargate client')
                chainClients.value[chainName].cosmosClients!.stargateClient?.disconnect()
            } catch(error) { 
                console.log(error)
            }
        }
    }

    function getCosmosAsset(amount: BigInt, denom: string) {
        const asset = allCurrencies.value
            .find(currency => currency?.coinMinimalDenom == denom)
        if(asset) {
            return {
                display: {
                    amount: Number(amount) / Number(Math.pow(10, asset.coinDecimals)),
                    denom: asset.coinDenom,
                },
                base: {
                    amount: Number(amount),
                    denom: denom,
                    decimals: asset.coinDecimals
                }
            } as ExplorerAsset
        }
        return {
            display: {
                amount: Number(amount),
                denom: denom,
            },
            base: {
                amount: Number(amount),
                denom: denom,
                decimals: 0
            }
        } as ExplorerAsset
    }

    return { 
        isConnecting,
        chainClients,
        latestBlocks,
        availableCosmosChainIds,
        availableChains,
        availableChainNames,
        chainCurrencies,
        getChainCurrencies,
        connectClients,
        getCosmosAsset
    }
})