<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <v-row>
                <v-col cols="6">
                    <div class="text-h6 text-left">{{t('proposal.voting')}}</div>
                </v-col>
                <v-col cols="6" class="text-caption text-right pr-0">
                    <proposal-status-chip :proposal="props.proposal" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3">
                    <div class="d-flex">
                        <div class="pr-1">{{ t('proposal.yes') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.yes) }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="pr-1">{{ t('proposal.no') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.no) }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="pr-1">{{ t('proposal.noWithVeto') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.noWithVeto) }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="pr-1">{{ t('proposal.abstain') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(props.proposal.finalTallyResult.abstain) }}</div>
                    </div>
                    <div class="d-flex">
                        <div class="pr-1">{{ t('proposal.notVoted') }}:</div>
                        <div class="flex-grow-1 text-right">{{ getNormalizedAmount(0) }}</div>
                    </div>
                </v-col>
                <v-col cols="12" sm="9">
                    <proposal-voting-chart :proposal="props.proposal" />
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
import ProposalStatusChip from './ProposalStatusChip.vue';

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
  