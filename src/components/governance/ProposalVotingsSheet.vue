<template>
    <base-sheet :title="t('proposal.voting')">
        <v-row>
            <v-col cols="12">
                <proposal-voting-chart :proposal="props.proposal" />
            </v-col>
            <v-col cols="12" sm="3">
                <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                    <div class="pr-1">{{ t('proposal.voteOption.VOTE_OPTION_YES') }}:</div>
                    <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult?.yesCount || '') }}</div>
                </v-sheet>
            </v-col>
            <v-col cols="12" sm="3">
                <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                    <div class="pr-1">{{ t('proposal.voteOption.VOTE_OPTION_NO') }}:</div>
                    <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult?.noCount || '') }}</div>
                </v-sheet>
            </v-col>
            <v-col cols="12" sm="3">
                <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                    <div class="pr-1">{{ t('proposal.voteOption.VOTE_OPTION_NO_WITH_VETO') }}:</div>
                    <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult?.noWithVetoCount || '') }}</div>
                </v-sheet>
            </v-col>
            <v-col cols="12" sm="3">
                <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                    <div class="pr-1">{{ t('proposal.voteOption.VOTE_OPTION_ABSTAIN') }}:</div>
                    <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult?.abstainCount || '') }}</div>
                </v-sheet>
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { Proposal } from '@/lib/proto/cosmos/gov/v1/gov';

import BaseSheet from '../BaseSheet.vue';
import ProposalVotingChart from '../charts/ProposalVotingChart.vue';

const { t } = useI18n()
const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        required: true,
    },
})

function getNormalizedAmount(amount: bigint|string|number) {
    return Number(amount) / Number(Math.pow(10,18))
}

</script>
<style>
</style>
  