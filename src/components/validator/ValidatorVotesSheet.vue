<template>
    <base-sheet :title="t('validator.votes')">
        <v-container style="height: 300px;overflow-y: scroll; overflow-x:hidden;" class="pa-0 mt-5">
            <proposal-header-row 
                v-for="proposal in votingAndEndedProposals" :key="proposal?.proposalId.toString()"
                :proposal="proposal" 
                @click="() => $router.push('../proposal/' + proposal?.proposalId.toString())"
                >
                <template v-slot:append>
                    <div class="text-caption flex-grow-1 d-flex justify-end align-center">
                        {{  validatorVote(proposal?.proposalId.toString() || '0') }}
                    </div>
                </template>
            </proposal-header-row>
        </v-container>
    </base-sheet>
</template>

<script lang="ts" setup>
import { Ref, computed, ref, watch, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { ExtendedValidator } from '@/store/validators';
import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';

import { ProposalStatus, Vote, VoteOption } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import ProposalHeaderRow from '../governance/ProposalHeaderRow.vue';
import BaseSheet from '../BaseSheet.vue';

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})
const { t } = useI18n()
const { chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const { loadCosmosProposals, getProposalInfo } = useProposalsStore()
const { proposals, isLoadingProposals } = storeToRefs(useProposalsStore())

const validatorVotes: Ref<Record<string, Vote|undefined>> = ref({})

const votingAndEndedProposals = computed(() => {
    return proposals.value[chainIdFromRoute.value || '']?.filter(p => [ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD, ProposalStatus.PROPOSAL_STATUS_PASSED].includes(p.status))
        .map(p => getProposalInfo(chainIdFromRoute.value || '', p.proposalId))
        .filter(a => a)
        .toSorted((a,b) => Number(b!.proposalId - a!.proposalId))
})

function validatorVote(proposalId: string) {
    return validatorVotes.value[proposalId] ? t('proposal.voteOption.'+ VoteOption[validatorVotes.value[proposalId]?.options[0].option || 0]) : t('validator.didNotVote')
}

function loadValidatorVotes() {
    for(const proposal of proposals.value[chainIdFromRoute.value || ''] || []) {
        chainClients.value[chainIdFromRoute.value || '']?.cosmosClients?.queryClient.extensions.gov.gov.vote(proposal.proposalId.toString(), props.validator?.operatorWallet || '')
        .then((vote) => {
            validatorVotes.value[proposal.proposalId.toString()] = vote.vote
        }).catch(() => {
            validatorVotes.value[proposal.proposalId.toString()] = undefined;
        })
    }
}

const isLoading = computed(() => {
    return isLoadingProposals.value.includes(chainIdFromRoute.value || '')
})

if(!votingAndEndedProposals.value?.length) {
    loadCosmosProposals(chainIdFromRoute.value || '')
} else {
    loadValidatorVotes()
}

watch(isLoading, () => loadValidatorVotes() )

</script>
<style>
</style>