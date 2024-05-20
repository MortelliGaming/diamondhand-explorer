<template>
    <v-container class="pa-0" @click="emit('click')">
        <v-row no-gutters cols="12">
                <v-col cols="12" class="text-subtitle-2" v-for="(msg,i) in props.proposal?.messages" :key="'msg_'+i">
                    <b>{{ msg.typeUrl?.split('.')[msg.typeUrl?.split('.').length -1] }}</b>
                </v-col>
                <v-col cols="12" v-if="proposal?.messages?.length == 0" class="text-subtitle-2">
                    <b>{{ proposal?.title }}</b>
                </v-col>
            </v-row>
            <v-row no-gutters class="pt-2 pb-2">
                <v-col cols="1" class="d-flex align-center">
                    <v-chip class="justify-center">{{ props.proposal?.id }}</v-chip>
                </v-col>
                <v-col cols="6" class="pl-2 d-flex flex-grow-1 justify-center align-center" v-if="props.proposal">
                    <v-row class="text-caption" no-gutters>
                        <div v-if="props.proposal?.status != ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">
                            <v-col cols="12" class="pa-0 flex-row d-flex">
                                <div class="pr-2 d-flex align-center">
                                    <b>{{ t('proposal.votingEndTime') }}:</b>
                                </div>
                                <div class="d-flex flex-row">
                                    <div class="pr-2" v-if="props.proposal.votingEndTime">
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
                                    <div class="pr-2" v-if="props.proposal.depositEndTime">
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

import { type Proposal, ProposalStatus } from '@/lib/proto/cosmos/gov/v1/gov';
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