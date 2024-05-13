import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';

import { protoRegistry } from '@/lib/protoRegistry';

import { useBlockchainStore } from '@/store/blockchain';
import { QueryProposalsRequest, QueryProposalsResponse } from '@/lib/proto/cosmos/gov/v1/query';
import { type Proposal } from '@/lib/proto/cosmos/gov/v1/gov';
import { PageRequest } from '@/lib/proto/cosmos/base/query/v1beta1/pagination';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1/gov';

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
        
        try {

            if(chainClients.value[chainName]?.cosmosClients?.queryClient) {
                const query: QueryProposalsRequest = {
                    proposalStatus: ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED,
                    voter: '',
                    depositor: '',
                    pagination: undefined
                }
                const proposalsRaw = await chainClients.value[chainName].cosmosClients!.tendermintClient.abciQuery({
                    path: "/cosmos.gov.v1.Query/Proposals",
                    data: QueryProposalsRequest.encode(query).finish(),
                })
                const proposals = QueryProposalsResponse.decode(proposalsRaw.value)
                
                while (proposals.pagination && proposals.pagination.nextKey.length  > 0) {
                    try {
                        // Encode the PageRequest to Uint8Array
                        const pageRequest = PageRequest.fromPartial({
                            key: proposals.pagination.nextKey,
                        });
                        query.pagination = pageRequest
                        const nextResultRaw = await chainClients.value[chainName].cosmosClients!.tendermintClient.abciQuery({
                            path: "/cosmos.gov.v1.Query/Proposals",
                            data: QueryProposalsRequest.encode(query).finish(),
                        })
                        const nextResult = QueryProposalsResponse.decode(nextResultRaw.value)
                        //const nextResult = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.gov.gov.proposals(proposalStatus as ProposalStatus, '', '', proposals.pagination.nextKey)
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
            console.error('error fetching proposal infos: ', err)
        }
        proposals.value[chainName] = allProposals.proposals
        // dont wait for the avatars
        const isLoadingIndex = isLoadingProposals.value.indexOf(chainName)
        isLoadingProposals.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    function getProposalInfo(chainName: string, proposalId: BigInt) {
        const proposal = proposals.value[chainName]?.find(p => p.id == proposalId)
        if(proposal && proposal.metadata) {
            try {
                return Object.assign(proposal, { decodedMessages: proposal.messages.map(msg => protoRegistry.decode(msg)) } )
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