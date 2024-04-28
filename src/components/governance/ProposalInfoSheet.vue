<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <v-row>
                <v-col cols="12">
                    <div class="text-h6 text-left" style="overflow-wrap: break-word;">{{proposal?.content?.typeUrl?.replace('/','')}}</div>
                </v-col>
            </v-row>
            <v-row class="d-flex align-center">
                <v-col cols="3" class="pt-0 pb-0" style="overflow-wrap: break-word;">
                    {{ t('proposal.votingEndTime') }}:
                </v-col>
                <v-col cols="9" class="d-flex flex-sm-row pt-0 pb-0">
                    <div class="mr-sm-2">
                        {{ moment(Number(proposal?.votingEndTime.seconds) * 1000).format('DD.MM.YY HH:mm:ss') }}
                    </div>
                    <human-readable-time :time="proposal?.votingEndTime" />
                </v-col>
            </v-row>
            <component :is="messageComponent" :message="proposal?.content" :chain-id="props.chainId"/>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type Component, Ref, computed, ref, type PropType, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';
import moment from 'moment';
import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import HumanReadableTime from '../HumanReadableTime.vue';
import MsgSoftwareUpgrade from '@/components/messages/cosmos/MsgSoftwareUpgrade.vue';
import MsgUpdateParams from '@/components/messages/cosmos/MsgUpdateParams.vue';
import UnkownMessage from '@/components/messages/cosmos/UnkownMessage.vue';

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
    chainId: {
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

const messageComponent = computed(() => {
    return props.proposal?.content ? messageMapping.value[props.proposal?.content.typeUrl] || UnkownMessage : UnkownMessage
})

</script>
<style>
</style>
  