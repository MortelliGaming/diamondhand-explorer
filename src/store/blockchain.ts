import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref } from 'vue';

import { useAppStore } from './app';

import { blockchainConfigs } from '@/lib/chains'

import { PublicClient, createPublicClient, http } from 'viem';
import { ExplorerChainInfo } from '@/types';

export const useBlockchainStore = defineStore('blockchain', () => {

    const selectedChainName = ref('')
    // viem public client without signer
    const publicEVMClient: Ref<null|PublicClient> = ref(null);

    const availableChains = computed(() => {
        const { isTestnet } = storeToRefs(useAppStore());
        return ( isTestnet ? blockchainConfigs.testnet : blockchainConfigs.mainnet)
    })

    const selectedChain: Ref<null|ExplorerChainInfo> = computed(() => {
        return Object.keys(availableChains.value).includes(selectedChainName.value)
            ? availableChains.value[selectedChainName.value]
            : null
    })

    function selectChain(chainName: string) {
        selectedChainName.value = chainName
        if(selectedChainName.value != '') {
            connectClient()
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
        selectedChain,
        selectedChainName,
        selectChain
    }
})