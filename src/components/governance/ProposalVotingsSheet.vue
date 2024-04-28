<template>
    <v-sheet elevation="12" color="" class="text-caption pa-3 fill-heigh2">
        <v-container class="pt-0">
            <v-row>
                <v-col cols="6">
                    <div class="text-h6 text-left">{{t('proposal.voting')}}</div>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="12">
                    <proposal-voting-chart :proposal="props.proposal" />
                </v-col>
                <v-col cols="12" sm="3">
                    <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                        <div class="pr-1">{{ t('proposal.yes') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.yes) }}</div>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                        <div class="pr-1">{{ t('proposal.no') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.no) }}</div>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                        <div class="pr-1">{{ t('proposal.noWithVeto') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.noWithVeto) }}</div>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="3">
                    <v-sheet elevation="12" color="grey-darken-3" class="d-flex pa-2">
                        <div class="pr-1">{{ t('proposal.abstain') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.abstain) }}</div>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import ProposalVotingChart from '../charts/ProposalVotingChart.vue';

const { t } = useI18n()
const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        required: true,
    },
})

function getNormalizedAmount(amount: bigint|string|number) {
    return Number((BigInt(amount) / BigInt(Math.pow(10,18))))
}

</script>
<style>
</style>
  