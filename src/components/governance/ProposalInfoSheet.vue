<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <v-row>
                <v-col cols="6">
                    <div class="text-h6 text-left">{{t('proposal.info')}}</div>
                </v-col>
                <v-col cols="6"  class="text-caption text-right">
                    <v-chip :color="statusChipColor">
                        <div  class="text-caption" >{{ statusText }}</div>
                    </v-chip>
                </v-col>
            </v-row>

            <v-row class="text-caption">
                <v-col cols="3">
                    <b>{{t('proposal.type')}}:</b>
                </v-col>
                <v-col cols="9" style="overflow-wrap: break-word;">
                    <b>{{ proposal?.content?.typeUrl }}</b>
                </v-col>
            </v-row>
            <div class="text-caption"></div>
            <v-divider />
            <component :is="messageComponent" :message="proposal?.content" :chain-id="props.chainId"/>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type Component, Ref, computed, ref, type PropType, markRaw } from 'vue';
import { useI18n } from 'vue-i18n';

import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';
import MsgSoftwareUpgrade from '@/components/messages/cosmos/MsgSoftwareUpgrade.vue';
import MsgUpdateParams from '@/components/messages/cosmos/MsgUpdateParams.vue';
import UnkownMessage from '@/components/messages/cosmos/UnkownMessage.vue';

const { t } = useI18n()

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

const messageMapping: Ref<Record<string, Component>> = ref({
    '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade':  markRaw(MsgSoftwareUpgrade),
    '/ethermint.feemarket.v1.MsgUpdateParams': markRaw(MsgUpdateParams),
    // '/cosmos.params.v1beta1.ParameterChangeProposal': 
})

const messageComponent = computed(() => {
    return props.proposal?.content ? messageMapping.value[props.proposal?.content.typeUrl] || UnkownMessage : UnkownMessage
})

const statusChipColor = computed(() => {
    switch(props.proposal?.status) {
        case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
            return 'orange-lighten-1'
        case ProposalStatus.PROPOSAL_STATUS_PASSED: 
            return 'green-darken-3'
        case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
            return 'green-lighten-1'
        default: 
            return 'red-darken-3'
    }
})

const statusText = computed(() => {
    switch(props.proposal?.status) {
        case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
            return 'Depositing'
        case ProposalStatus.PROPOSAL_STATUS_PASSED: 
            return 'Passed'
        case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
            return 'Voting'
        case ProposalStatus.PROPOSAL_STATUS_FAILED:
            return 'Failed'
        case ProposalStatus.PROPOSAL_STATUS_REJECTED:
            return 'Rejected'
        case ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED:
            return 'Unspecified'
        case ProposalStatus.UNRECOGNIZED:
            return 'Unrecognized'
        default: 
            return 'Unrecognized'
    }
})

</script>
<style>
</style>
  