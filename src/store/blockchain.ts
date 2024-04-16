import { defineStore } from 'pinia';
import { type Ref, computed, ref } from 'vue';

import * as evmChains from '@/lib/chains/evm'
import { Chain, PublicClient, createPublicClient, http } from 'viem';

export const useEVMBlockchainStore = defineStore('evm-blockchain', () => {

    const selectedChainName = ref('')
    // viem public client without signer
    const publicClient: Ref<null|PublicClient> = ref(null);

    const availableChains = computed(() => {
        return Object.keys(evmChains)
    })

    const selectedChain: Ref<null|Chain> = computed(() => {
        return Object.keys(evmChains).includes(selectedChainName.value)
            ? (evmChains as any)[selectedChainName.value] as Chain
            : null
    })

    function selectChain(chainName: string) {
        selectedChainName.value = chainName
        if(selectedChainName.value != '') {
            connectClient()
        }
    }

    function connectClient() {
        if(selectedChain.value != null) {
            publicClient.value = createPublicClient({
                chain: selectedChain.value,
                transport: http()
            })
        }
    }

    return { 
        availableChains,
        selectedChain,
        selectChain
    }
})