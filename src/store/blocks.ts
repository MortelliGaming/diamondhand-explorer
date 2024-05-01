import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import { useBlockchainStore } from '@/store/blockchain';
import { BlockResponse } from '@cosmjs/tendermint-rpc';

export const useBlocksStore = defineStore('blocks', () => {

    const { cosmosClients } = storeToRefs(useBlockchainStore())
    const { getTendermintClient } = useBlockchainStore()
    const blocks: Ref<Record<string, BlockResponse[]>> = ref({})
    
    const isLoadingBlocks: Ref<string[]> = ref([])

    async function loadCosmosBlock(chainId: string, block: number) {
        if(!cosmosClients.value[chainId]?.queryClient) {
            return Promise.resolve(false)
        }
        if(isLoadingBlocks.value.includes(chainId)) {
            return Promise.resolve(true)
        }
        if(blocks.value[chainId]?.find(b => b.block.header.height == block)) {
            return Promise.resolve(true)
        }
        isLoadingBlocks.value.push(chainId)
        // const { cosmosHelper } = storeToRefs(useBlockchainStore())
        try {
            const tendermintClient = await getTendermintClient(chainId);
            const blockResult = await (await getTendermintClient(chainId))?.block(block)
            tendermintClient?.disconnect();
            if(blockResult) {
                if(!blocks.value[chainId]) {
                    blocks.value[chainId] = []
                }
                blocks.value[chainId].push(blockResult)
            }
        } catch(err) { 
            console.error('error fetching validator infos: ', err)
        }
        // dont wait for the avatars
        const isLoadingIndex = isLoadingBlocks.value.indexOf(chainId)
        isLoadingBlocks.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    return {
        isLoadingBlocks,
        blocks,
        loadCosmosBlock,
    }
})