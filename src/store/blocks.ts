import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import { useBlockchainStore } from '@/store/blockchain';
import { BlockResponse } from '@cosmjs/tendermint-rpc';

export const useBlocksStore = defineStore('blocks', () => {

    const { chainClients } = storeToRefs(useBlockchainStore())
    const { getTendermintClient } = useBlockchainStore()
    const blocks: Ref<Record<string, BlockResponse[]>> = ref({})
    
    const isLoadingBlocks: Ref<string[]> = ref([])

    async function loadCosmosBlock(chainName: string, block: number) {
        if(!chainClients.value[chainName]?.cosmosClients?.queryClient) {
            return Promise.resolve(false)
        }
        if(isLoadingBlocks.value.includes(chainName)) {
            return Promise.resolve(true)
        }
        if(blocks.value[chainName]?.find(b => b.block.header.height == block)) {
            return Promise.resolve(true)
        }
        isLoadingBlocks.value.push(chainName)
        // const { cosmosHelper } = storeToRefs(useBlockchainStore())
        try {
            const tendermintClient = await getTendermintClient(chainName);
            const blockResult = await (await getTendermintClient(chainName))?.block(block)
            tendermintClient?.disconnect();
            if(blockResult) {
                if(!blocks.value[chainName]) {
                    blocks.value[chainName] = []
                }
                blocks.value[chainName].push(blockResult)
            }
        } catch(err) { 
            console.error('error fetching validator infos: ', err)
        }
        // dont wait for the avatars
        const isLoadingIndex = isLoadingBlocks.value.indexOf(chainName)
        isLoadingBlocks.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    return {
        isLoadingBlocks,
        blocks,
        loadCosmosBlock,
    }
})