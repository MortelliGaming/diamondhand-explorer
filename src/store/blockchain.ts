import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref, ComputedRef } from 'vue';

import { blockchainConfigs, type Mainnets, type Testnets } from '@/lib/chains'

import { PublicClient, createPublicClient, http } from 'viem';
import { ExplorerChainInfo } from '@/types';
import { useAppStore } from './app';
import { CosmosHelper, CosmosNewBlockheaderEvent, EVMHelper, EVMHelperHelperPublic, type CosmosHelperPublic } from '@/lib/http';
import { type BlockchainResponse} from '@cosmjs/tendermint-rpc';

import { QueryParamsResponse as QueryStakingParamsResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query';
import { QueryParamsResponse as QuerySlashingParamsResponse } from 'cosmjs-types/cosmos/slashing/v1beta1/query';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

export const useBlockchainStore = defineStore('blockchain', () => {
    const isLoading: Ref<string[]> = ref([])
    const selectedChainName: Ref<Mainnets|Testnets|null> = ref(null)
    // viem public client without signer
    const publicEVMClient: Ref<null|PublicClient> = ref(null);

    const cosmosHelper: Ref<CosmosHelperPublic> = ref(new CosmosHelper([]))
    const evmHelper: Ref<EVMHelperHelperPublic> = ref(new EVMHelper([]))

    const cosmosChaindata: Ref<Record<string, { 
        blockchain?: BlockchainResponse|undefined,
        stakingParams?: QueryStakingParamsResponse|undefined,
        slashingParams?: QuerySlashingParamsResponse|undefined
    }>> = ref({} as Record<string, { 
        blockchain?: BlockchainResponse|undefined,
        stakingParams?: QueryStakingParamsResponse|undefined,
        slashingParams?: QuerySlashingParamsResponse|undefined
    }>);
    
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

    const selectedChain: Ref<null|ExplorerChainInfo> = computed(() => {
        return Object.values(availableChains.value).find(x => x.name == selectedChainName.value) || null
    })

    const latestEVMTransactionHashes = computed(() => {
        return availableCosmosChainIds.value.reduce((acc: {[id: string]: Ref<string[]>}, item) => {
            acc[item] = computed(() => cosmosHelper.value.GetlatestEthTxHashes(item));
            return acc;
        }, {});
    })

    function connectCosmosClients() {
        const allCosmosChains = []
        for(const chain of availableChains.value) {
            if(chain.keplr) {
                allCosmosChains.push(chain.keplr)
            }
        }
        cosmosHelper.value = new CosmosHelper(allCosmosChains)

        // update latest blockheight
        cosmosHelper.value.addEventListener('cosmosNewBlock', (event) => {
            const newBlockEvent = event as CosmosNewBlockheaderEvent
            if(!cosmosChaindata.value[newBlockEvent.chainId]) {
                cosmosChaindata.value[newBlockEvent.chainId] = {}
            }
            if(!cosmosChaindata.value[newBlockEvent.chainId]?.blockchain) {
                cosmosChaindata.value[newBlockEvent.chainId].blockchain = {
                    lastHeight: newBlockEvent.blockHeight,
                    blockMetas: []
                }
            }
            (cosmosChaindata.value[newBlockEvent.chainId]!.blockchain! as any).lastHeight = newBlockEvent.blockHeight
        })
        setTimeout(loadBlockchaindata, 2000)
    }

    function connectEVMClients() {
        const allEVMChains = []
        for(const chain of availableChains.value) {
            if(chain.evm) {
                allEVMChains.push(chain.evm)
            }
        }
        evmHelper.value = new EVMHelper(allEVMChains)
    }

    function connectClients() {
        connectCosmosClients()
        connectEVMClients();
    }

    function selectChain(chainName: Mainnets|Testnets) {
        if(availableChains.value.map(c => c.name).includes(chainName)) {
            selectedChainName.value = chainName as typeof chainName
            if(selectedChainName.value) {
                connectClient()
            }
        }
    }

    function connectClient() {
        if(selectedChain.value?.evm) {
            if(publicEVMClient.value !== null) {
                publicEVMClient.value = null;
            }
            publicEVMClient.value = createPublicClient({
                chain: selectedChain.value.evm,
                transport: http()
            })
        } else {
            publicEVMClient.value = null
        }
    }

    async function loadBlockchaindata() {
        for(const chain of availableChains.value) {
            if(chain.keplr) {
                isLoading.value.push(chain.name)
                if(!cosmosChaindata.value[chain.keplr.chainId]) {
                    cosmosChaindata.value[chain.keplr.chainId] = {}
                }
                cosmosChaindata.value[chain.keplr.chainId].blockchain = await cosmosHelper.value.GetChainInfo(chain.keplr.chainId)
                cosmosChaindata.value[chain.keplr.chainId].stakingParams = await cosmosHelper.value.GetStakingParams(chain.keplr.chainId)
                cosmosChaindata.value[chain.keplr.chainId].slashingParams = await cosmosHelper.value.GetSlashingParams(chain.keplr.chainId)
                const index = isLoading.value.indexOf(chain.name)
                isLoading.value.splice(index, 1)
            }
        }
    }

    return { 
        isLoading,
        cosmosHelper,
        availableCosmosChainIds,
        availableChains,
        availableChainNames,
        selectedChain,
        selectedChainName,
        latestEVMTransactionHashes,
        cosmosChaindata,
        connectClients,
        selectChain,
    }
})