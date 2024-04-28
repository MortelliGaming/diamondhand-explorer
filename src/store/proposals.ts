import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import { protoRegistry } from '@/lib/http';
import type { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import { useBlockchainStore } from '@/store/blockchain';

export const useProposalsStore = defineStore('proposals', () => {

    const proposals: Ref<Record<string, Proposal[]>> = ref({})
    
    const isLoading: Ref<string[]> = ref([])

    async function loadCosmosProposals(chainId: string) {
        if(isLoading.value.includes(chainId)) {
            return Promise.resolve(true)
        }
        isLoading.value.push(chainId)
        const { cosmosHelper } = storeToRefs(useBlockchainStore())
        proposals.value[chainId] =  ((await cosmosHelper.value.GetAllProposals(chainId))?.proposals || [])
        // dont wait for the avatars
        const isLoadingIndex = isLoading.value.indexOf(chainId)
        isLoading.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    function getProposalInfo(chainId: string, proposalId: BigInt) {
        const proposal = proposals.value[chainId]?.find(p => p.proposalId == proposalId)
        if(proposal && proposal.content) {
            try {
                return Object.assign(proposal, { decodedMessage: protoRegistry.decode(proposal.content)} )
            } catch { /** */ }
        } else {
            return proposal
        }
    }

    return {
        isLoading,
        proposals,
        loadCosmosProposals,
        getProposalInfo
    }
})