<template>
    <v-container>
        <v-row class="pa-2" role="button" @click="emit('click')">
            <v-col cols="1"  class="d-flex justify-center align-center">
                <v-chip class="justify-center">{{ props.proposal?.proposalId }}</v-chip>
            </v-col>
            <v-col cols="6" class="d-flex flex-grow-1 justify-center align-center" v-if="props.proposal">
                <v-row class="pl-2 pr-2 text-caption" style="width: 100%;" no-gutters>
                    <v-col cols="12" class="text-subtitle-2">
                        <b>{{ props.proposal?.content?.typeUrl?.split('.')[props.proposal?.content?.typeUrl?.split('.').length -1] }}</b>
                    </v-col>
                    <div v-if="props.proposal?.status != ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">
                        <v-col cols="12" class="pa-0 flex-row d-flex">
                            <div class="pr-2">
                                <b>{{ t('proposal.votingEndTime') }}:</b>
                            </div>
                            <div class="d-flex flex-row">
                                <div class="pr-2">
                                    {{ moment(getTimeFromTimestamp(props.proposal.votingEndTime)).format('DD.MM.YY HH:mm:ss') }}
                                </div>
                                <div v-if="$vuetify.display.smAndUp" class="d-flex flex-row">
                                    <human-readable-time :time="props.proposal.votingEndTime" />
                                </div>
                            </div>
                        </v-col>
                    </div>
                    <div v-else>
                        <v-col class="d-flex  flex-column flex-sm-row">
                            <div class="pr-2">
                                <b>{{ t('proposal.depositEndTime') }}:</b>
                            </div>
                            <div class="d-flex flex-row">
                                <div class="pr-2">
                                    {{ moment(getTimeFromTimestamp(props.proposal.depositEndTime)).format('DD.MM.YY HH:mm:ss') }}
                                </div>
                                <div v-if="$vuetify.display.smAndUp" class="d-flex flex-row">
                                    <human-readable-time :time="props.proposal.depositEndTime" />
                                </div>
                            </div>
                        </v-col>
                    </div>
                </v-row>
            </v-col>
            <v-col cols="5" class="justify-end d-flex align-center">
                <slot name="append"></slot>
            </v-col>
        </v-row>
        <v-divider />
    </v-container>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import HumanReadableTime from '@/components/HumanReadableTime.vue';

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
const emit = defineEmits(['click'])

function getTimeFromTimestamp(timestamp: Timestamp) {
    return parseInt((timestamp.seconds * 1000n).toString())
}

</script>
<style>
</style>