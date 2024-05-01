import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import { protoRegistry } from '@/lib/protoRegistry';
import { ProposalStatus, type Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import { useBlockchainStore } from '@/store/blockchain';
import { QueryProposalsResponse } from '@/lib/proto/cosmos/gov/v1beta1/query';

export const useProposalsStore = defineStore('proposals', () => {

    const { cosmosClients } = storeToRefs(useBlockchainStore())
    const proposals: Ref<Record<string, Proposal[]>> = ref({})
    
    const isLoadingProposals: Ref<string[]> = ref([])

    async function loadCosmosProposals(chainId: string) {
        if(!cosmosClients.value[chainId]?.queryClient) {
            return Promise.resolve(false)
        }
        if(isLoadingProposals.value.includes(chainId)) {
            return Promise.resolve(true)
        }
        isLoadingProposals.value.push(chainId)
        // const { cosmosHelper } = storeToRefs(useBlockchainStore())
        const allProposals = {
            proposals: []
        } as QueryProposalsResponse

        for(const proposalStatus of [ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD, ProposalStatus.PROPOSAL_STATUS_FAILED, ProposalStatus.PROPOSAL_STATUS_PASSED, ProposalStatus.PROPOSAL_STATUS_REJECTED, ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD]) {
            try {
                const proposals = await cosmosClients.value[chainId].queryClient?.extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '')
                while (proposals.pagination && proposals.pagination.nextKey.length  > 0) {
                    try {
                        const nextResult = await cosmosClients.value[chainId].queryClient?.extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '', proposals.pagination.nextKey)
                        proposals.proposals.push(...nextResult.proposals)
                        proposals.pagination = nextResult.pagination
                    } catch {
                        proposals.pagination = undefined
                        proposals.proposals = []
                    }
                }
                allProposals.proposals.push(...proposals.proposals)
            } catch(err) { 
                console.error('error fetching validator infos: ', err)
            }
        }
        proposals.value[chainId] = allProposals.proposals
        // dont wait for the avatars
        const isLoadingIndex = isLoadingProposals.value.indexOf(chainId)
        isLoadingProposals.value.splice(isLoadingIndex, 1)
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
        isLoadingProposals,
        proposals,
        loadCosmosProposals,
        getProposalInfo
    }
})