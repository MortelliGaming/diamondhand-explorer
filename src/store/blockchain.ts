import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref, ComputedRef } from 'vue';
import { blockchainConfigs } from '@/lib/chains'

import { ExplorerChainInfo } from '@/types';
import { useAppStore } from './app';
import { NewBlockEvent, Tendermint37Client } from '@cosmjs/tendermint-rpc';
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
import { Subscription } from 'xstream';
import { PublicClient, createPublicClient, http } from 'viem';

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
    tendermintClient: Tendermint37Client,
    stargateClient: StargateClient,
    blockHeaderSubscription: Subscription
}

export const useBlockchainStore = defineStore('blockchain', () => {
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

    function webSocketClosed(chainName: string) {
        console.log('websocket closed ' + chainName)
    }

    function webSocketError(chainName: string, err: any) {
        console.log('websocket error ' + chainName + ': ' + err)
    }

    async function NewBlockHeaderEventHandler(chainName: string, block: NewBlockEvent) {
        if(!latestBlocks.value[chainName]) {
            latestBlocks.value[chainName] = []
        }
        // keep 100 blocks
        if (latestBlocks.value[chainName].length >= 100) {
            latestBlocks.value[chainName].pop();
        }
        // Add the new item at position 0 (beginning of the array)
        // console.log(Buffer.from(block.header.proposerAddress).toString('hex'))
        latestBlocks.value[chainName].unshift(block);
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
                const tendermintClient = await Tendermint37Client.connect(chainInfo.keplr.rpc.replace('https', 'wss'))
                const queryClient = QueryClient.withExtensions(tendermintClient)
                console.log('rpc connected, subscribe block stream')
                const newBlockHeaderStream = tendermintClient.subscribeNewBlock()
                // subscribe new block header
                const blockHeaderSubscription = newBlockHeaderStream.subscribe({
                    next: (event: NewBlockEvent) => NewBlockHeaderEventHandler(chainInfo.name, event),
                    error: (error) => webSocketError(chainInfo.name, error),
                    complete: () => webSocketClosed(chainInfo.name)
                });
                clients.cosmosClients = {
                    stargateClient,
                    tendermintClient,
                    queryClient: {
                        client: queryClient, 
                        extensions: setupExtenstions(queryClient)
                    },
                    blockHeaderSubscription,
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
        }   
        isConnecting.value = false;
        return Promise.resolve(true)
    }

    function disconnectCosmosClients(chainName: string) {
        if(chainClients.value[chainName]?.cosmosClients) {
            try {
                chainClients.value[chainName].cosmosClients!.blockHeaderSubscription.unsubscribe()
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

    async function getTendermintClient(chainName: string) {
        const chainInfo = availableChains.value.find(c => c.name == chainName)
        if(chainInfo?.keplr) {
            return Tendermint37Client.connect(chainInfo.keplr!.rpc.replace('https', 'wss'))
        } else {
            return Promise.resolve(undefined)
        }
    }

    return { 
        isConnecting,
        chainClients,
        latestBlocks,
        availableCosmosChainIds,
        availableChains,
        availableChainNames,
        getTendermintClient,
        connectClients,
    }
})