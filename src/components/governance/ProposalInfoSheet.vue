<template>
    <base-sheet :title="title">
        <template v-slot:appendTitle>
            <proposal-status-chip :proposal="props.proposal" />
        </template>
        <v-row class="d-flex align-center">
            <v-col cols="3" class="pb-0" style="overflow-wrap: break-word;">
                {{ t('proposal.votingEndTime') }}:
            </v-col>
            <v-col cols="9" class="d-flex flex-column flex-sm-row pb-0">
                <div class="mr-sm-2">
                    {{ moment(Number(proposal?.votingEndTime?.seconds) * 1000).format('DD.MM.YY HH:mm:ss') }}
                </div>
                <human-readable-time :time="proposal?.votingEndTime" />
            </v-col>
        </v-row>
        <component 
            v-for="(msg, i) in proposal?.messages"
            :key="'prop_' + i"
            :is="messageComponent(msg)" 
            :message="message(msg)" :chain-name="props.chainName" />
    </base-sheet>
</template>

<script lang="ts" setup>
import { type Component, Ref, ref, type PropType, markRaw, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import { Proposal } from '@/lib/proto/cosmos/gov/v1/gov';

import BaseSheet from '../BaseSheet.vue';
import HumanReadableTime from '../HumanReadableTime.vue';
import ProposalStatusChip from './ProposalStatusChip.vue';
import MsgSoftwareUpgrade from '@/components/messages/cosmos/MsgSoftwareUpgrade.vue';
import MsgUpdateParams from '@/components/messages/cosmos/MsgUpdateParams.vue';
import UnkownMessage from '@/components/messages/cosmos/UnkownMessage.vue';
import { MsgExecLegacyContent } from '@/lib/proto/cosmos/gov/v1/tx';
import { protoRegistry } from '@/lib/protoRegistry';

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
    chainName: {
        type: String,
        default: ''
    },
})

const { t } = useI18n()

const messageMapping: Ref<Record<string, Component>> = ref({
    '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade':  markRaw(MsgSoftwareUpgrade),
    '/ethermint.feemarket.v1.MsgUpdateParams': markRaw(MsgUpdateParams),
    // '/cosmos.params.v1beta1.ParameterChangeProposal': 
})

const title = computed(() => {
    // it its a legacy proposal, show type of first message as title (legacy proposals only have 1 message)
    return props.proposal?.messages.length == 1 && props.proposal.messages[0].typeUrl === MsgExecLegacyContent.typeUrl
        ? protoRegistry.decode(props.proposal.messages[0])?.content.typeUrl 
        : props.proposal?.messages.map(msg => msg.typeUrl.replace('/','')).join(', ')
})

function message(msg: {typeUrl: string, value: Uint8Array}) {
    // it its a legacy proposal, decode the content as message. (legacy proposals only have 1 message)
    return msg.typeUrl === MsgExecLegacyContent.typeUrl
        ? protoRegistry.decode(msg)?.content || msg
        : msg
}

function messageComponent(msg: {typeUrl: string, value: Uint8Array}) {
    // it its a legacy proposal, get component from nested legacy proposal
    return msg.typeUrl === MsgExecLegacyContent.typeUrl
        ? messageMapping.value[protoRegistry.decode(msg)?.content.typeUrl] || UnkownMessage
        : messageMapping.value[msg.typeUrl] || UnkownMessage
}

</script>
<style>
</style>
  