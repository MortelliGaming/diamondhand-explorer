import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import { protoRegistry } from '@/lib/protoRegistry';
import { ProposalStatus, type Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import { useBlockchainStore } from '@/store/blockchain';
import { QueryProposalsResponse } from '@/lib/proto/cosmos/gov/v1beta1/query';

export const useProposalsStore = defineStore('proposals', () => {

    const { chainClients } = storeToRefs(useBlockchainStore())
    const proposals: Ref<Record<string, Proposal[]>> = ref({})
    
    const isLoadingProposals: Ref<string[]> = ref([])

    async function loadCosmosProposals(chainName: string) {
        if(!chainClients.value[chainName]?.cosmosClients?.queryClient) {
            return Promise.resolve(false)
        }
        if(isLoadingProposals.value.includes(chainName)) {
            return Promise.resolve(true)
        }
        isLoadingProposals.value.push(chainName)
        // const { cosmosHelper } = storeToRefs(useBlockchainStore())
        const allProposals = {
            proposals: []
        } as QueryProposalsResponse

        for(const proposalStatus of [ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD, ProposalStatus.PROPOSAL_STATUS_FAILED, ProposalStatus.PROPOSAL_STATUS_PASSED, ProposalStatus.PROPOSAL_STATUS_REJECTED, ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD]) {
            try {
                if(chainClients.value[chainName]?.cosmosClients?.queryClient) {
                    const proposals = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '')
                    while (proposals.pagination && proposals.pagination.nextKey.length  > 0) {
                        try {
                            const nextResult = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '', proposals.pagination.nextKey)
                            proposals.proposals.push(...nextResult.proposals)
                            proposals.pagination = nextResult.pagination
                        } catch {
                            proposals.pagination = undefined
                            proposals.proposals = []
                        }
                    }
                    allProposals.proposals.push(...proposals.proposals)
                }
            } catch(err) { 
                console.error('error fetching validator infos: ', err)
            }
        }
        proposals.value[chainName] = allProposals.proposals
        // dont wait for the avatars
        const isLoadingIndex = isLoadingProposals.value.indexOf(chainName)
        isLoadingProposals.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    function getProposalInfo(chainName: string, proposalId: BigInt) {
        const proposal = proposals.value[chainName]?.find(p => p.proposalId == proposalId)
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