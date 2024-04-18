import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref } from 'vue';

import { blockchainConfigs, type Mainnets, type Testnets } from '@/lib/chains'

import { PublicClient, createPublicClient, http } from 'viem';
import { ExplorerChainInfo } from '@/types';
import { useAppStore } from './app';

export const useBlockchainStore = defineStore('blockchain', () => {

    const selectedChainName: Ref<Mainnets|Testnets|null> = ref(null)
    // viem public client without signer
    const publicEVMClient: Ref<null|PublicClient> = ref(null);

    const availableChainNames = computed(() => {
        return availableChains.value.map(c => c.name)
    })
    const availableChains = computed(() => {
        const { isTestnet } = storeToRefs(useAppStore())
        return Object.values(blockchainConfigs.networks)
            .filter(chainConfig => isTestnet.value 
                ? chainConfig.isTestnet === true 
                : chainConfig.isTestnet === false)
    })

    const selectedChain: Ref<null|ExplorerChainInfo> = computed(() => {
        return Object.values(availableChains.value).find(x => x.name == selectedChainName.value) || null
    })

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

    return { 
        availableChains,
        availableChainNames,
        selectedChain,
        selectedChainName,
        selectChain
    }
})