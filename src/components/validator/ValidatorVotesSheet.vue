<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <div class="text-h6 text-center">Votes</div>
            <v-container style="height: 300px;overflow-y: scroll;">
                <v-row v-for="proposal in votingAndEndedProposals" :key="proposal?.proposalId.toString()">
                    <v-col cols="12" class="d-flex  d-flex justify-center align-center" v-if="proposal">
                        <v-chip>{{ proposal?.proposalId }}</v-chip>
                        <div class="pl-2 pr-2" style="max-width: 70%;">
                            <div class="text-caption">
                                <b>{{ proposal?.content?.typeUrl?.split('.')[proposal?.content?.typeUrl?.split('.').length -1] }}</b>
                            </div>
                            <div class="text-caption" style="word-break: break-word;">
                                {{ JSON.stringify(decodePropsalContent(proposal)) }}
                            </div>
                        </div>
                        <div class="text-caption flex-grow-1 d-flex justify-center align-center">
                            {{  validatorVotes[proposal.proposalId.toString()] ? validatorVotes[proposal.proposalId.toString()] : 'did not vote' }}
                        </div>
                    </v-col>
                    <v-divider />
                </v-row>
            </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { Ref, computed, ref, type PropType } from 'vue';
import { ExtendedValidator } from '@/store/validators';
import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

import { protoRegistry } from '@/lib/http';
import { Proposal, ProposalStatus, Vote } from '@/lib/proto/cosmos/gov/v1beta1/gov';

const { availableChains, cosmosHelper } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const { loadCosmosProposals, getProposalInfo } = useProposalsStore()
const { proposals } = storeToRefs(useProposalsStore())

const validatorVotes: Ref<Record<string, Vote|undefined>> = ref({})

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})
const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

const votingAndEndedProposals = computed(() => {
    return proposals.value[cosmosChainId.value || '']?.filter(p => [ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD, ProposalStatus.PROPOSAL_STATUS_PASSED].includes(p.status))
        .map(p => getProposalInfo(cosmosChainId.value || '', p.proposalId))
        .filter(a => a)
        .toSorted((a,b) => Number(b!.proposalId - a!.proposalId))
})

function decodePropsalContent(proposal: Proposal): any {
    try {
        if(proposal.content) {
            return protoRegistry.decode(proposal.content)
        }
    } catch {/** */}
    return proposal
}


setTimeout(() => {
    loadCosmosProposals(cosmosChainId.value || '').then(async () => {
        for(const proposal of proposals.value[cosmosChainId.value || '']) {
            try {
                validatorVotes.value[proposal.proposalId.toString()] = (await cosmosHelper.value.GetProposalVotes(cosmosChainId.value || '', proposal.proposalId, props.validator?.operatorWallet || ''))?.vote
            } catch {
                validatorVotes.value[proposal.proposalId.toString()] = undefined;
            }
        }
    })
}, 500);

</script>
<style>
</style>