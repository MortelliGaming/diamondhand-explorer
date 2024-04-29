import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref, ComputedRef } from 'vue';

import { blockchainConfigs } from '@/lib/chains'

import { ExplorerChainInfo } from '@/types';
import { useAppStore } from './app';
import { NewBlockHeaderEvent, Tendermint37Client } from '@cosmjs/tendermint-rpc';
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
import { Block } from '@cosmjs/stargate';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export type ComosClients = {
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

    const latestBlocks: Ref<Record<string, Block[]>> = ref({})

    const cosmosClients: Ref<Record<string, ComosClients>> = ref({})

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

    function webSocketClosed(chainId: string) {
        console.log('websocket closed ' + chainId)
    }

    function webSocketError(chainId: string, err: any) {
        console.log('websocket error ' + chainId + ': ' + err)
    }

    function NewBlockHeaderEventHandler(chainId: string, blockInfo: NewBlockHeaderEvent) {
        cosmosClients.value[chainId]?.stargateClient.getBlock(blockInfo.height)
            .then((newBlockInfo) => {
                if(!latestBlocks.value[chainId]) {
                    latestBlocks.value[chainId] = []
                }
                // keep 100 blocks
                if (latestBlocks.value[chainId].length >= 100) {
                    latestBlocks.value[chainId].pop();
                }
                // Add the new item at position 0 (beginning of the array)
                latestBlocks.value[chainId].unshift(newBlockInfo);
            })
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

    async function connectCosmosClients() {
        isConnecting.value = true
        const allCosmosChains = availableChains.value.filter(c => c.keplr != null).map(c => c.keplr!)
        for(const chainInfo of allCosmosChains){
            if(cosmosClients.value[chainInfo.chainId]) {
                try {
                    cosmosClients.value[chainInfo.chainId].blockHeaderSubscription.unsubscribe()
                    cosmosClients.value[chainInfo.chainId].stargateClient?.disconnect()
                    cosmosClients.value[chainInfo.chainId].tendermintClient?.disconnect()
                } catch { /** */}
            }
            
            const stargateClient = await StargateClient.connect(chainInfo.rpc)
            const tendermintClient = await Tendermint37Client.connect(chainInfo.rpc.replace('https', 'wss'))
            const queryClient = QueryClient.withExtensions(tendermintClient)
            const newBlockHeaderStream = tendermintClient.subscribeNewBlockHeader()
            // subscribe new block header
            const subscription = newBlockHeaderStream.subscribe({
                next: (event: NewBlockHeaderEvent) => NewBlockHeaderEventHandler(chainInfo.chainId, event),
                error: (error) => webSocketError(chainInfo.chainId, error),
                complete: () => webSocketClosed(chainInfo.chainId)
            });

            cosmosClients.value[chainInfo.chainId] = {
                tendermintClient,
                queryClient: {
                    client: queryClient,
                    extensions: setupExtenstions(queryClient)
                },
                stargateClient,
                blockHeaderSubscription: subscription
            }
        }
        isConnecting.value = false
        return Promise.resolve(true)
    }

    function connectClients() {
        return connectCosmosClients()
    }

    return { 
        isConnecting,
        cosmosClients,
        latestBlocks,
        availableCosmosChainIds,
        availableChains,
        availableChainNames,
        connectClients,
    }
})