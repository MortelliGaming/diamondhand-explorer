<template>
    <v-row>
        <v-col cols="1"  class="d-flex justify-center align-center">
            <v-chip>{{ props.proposal?.proposalId }}</v-chip>
        </v-col>
        <v-col cols="9" class="d-flex  d-flex justify-center align-center" v-if="props.proposal">
            <div class="pl-2 pr-2 text-caption" style="width: 100%;">
                <div>
                    <b>{{ props.proposal?.content?.typeUrl?.split('.')[props.proposal?.content?.typeUrl?.split('.').length -1] }}</b>
                </div>
                <div v-if="props.proposal?.status != ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">
                    <div class="d-flex flex-row">
                        <div class="pr-2">
                            {{ t('proposal.votingStartTime') }}:
                        </div>
                        <div class="d-flex flex-row">
                            <div class="pr-2">
                                {{ moment(getTimeFromTimestamp(props.proposal.votingStartTime)).format('DD.mm.YY HH:mm:ss') }}
                            </div>
                            (<human-readable-time :time="props.proposal.votingStartTime" />)
                        </div>
                    </div>
                    <div class="d-flex flex-row">
                        <div class="pr-2">
                            {{ t('proposal.votingEndTime') }}:
                        </div>
                        <div class="d-flex flex-row">
                            <div class="pr-2">
                                {{ moment(getTimeFromTimestamp(props.proposal.votingEndTime)).format('DD.mm.YY HH:mm:ss') }}
                            </div>
                            (<human-readable-time :time="props.proposal.votingEndTime" />)
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="d-flex flex-row">
                        <div class="pr-2">
                            {{ t('proposal.depositEndTime') }}:
                        </div>
                        <div class="d-flex flex-row">
                            <div class="pr-2">
                                {{ moment(getTimeFromTimestamp(props.proposal.depositEndTime)).format('DD.mm.YY HH:mm:ss') }}
                            </div>
                            (<human-readable-time :time="props.proposal.depositEndTime" />)
                        </div>
                    </div>
                </div>
            </div>
        </v-col>
        <v-col cols="2" class="d-flex align-center" v-if="(proposal?.votingEndTime.seconds || 0) <= Date.now()">
            <v-chip color="success" class="justify-center" v-if="(proposal?.status || ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED) == ProposalStatus.PROPOSAL_STATUS_PASSED">
                <v-icon icon="mdi-check" />
            </v-chip>
            <v-chip color="success" class="justify-center" v-else>
                <v-icon icon="mdi-cancel" />
            </v-chip>
        </v-col>
        <v-col col="2" v-else-if="proposal?.status === ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">
            {{ proposal.totalDeposit }}
        </v-col>
        <v-col col="2" v-else>
            {{ 'current turnout' }}
        </v-col>
        <v-divider />
    </v-row>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import HumanReadableTime from '../HumanReadableTime.vue';

import type { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';
import moment from 'moment';
import { Timestamp } from '@/lib/proto/google/protobuf/timestamp';

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
})
const { t } = useI18n()

function getTimeFromTimestamp(timestamp: Timestamp) {
    return parseInt((timestamp.seconds * 1000n).toString())
}

</script>
<style>
</style>