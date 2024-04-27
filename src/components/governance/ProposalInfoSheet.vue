<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <div class="text-h6 text-center">Info</div>
            <v-row class="text-caption">
                <v-col cols="4">
                    <b>type:</b>
                </v-col>
                <v-col cols="8" style="overflow-wrap: break-word;">
                    <b>{{ proposal?.content?.typeUrl }}</b>
                </v-col>
            </v-row>
            <div class="text-caption"></div>
            <v-divider />
            <component :is="messageComponent" :message="proposal?.content"/>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type Component, Ref, computed, ref, type PropType } from 'vue';
import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';
// import MsgSoftwareUpgrade from '../messages/cosmos/MsgSoftwareUpgrade.vue';
// import MsgUpdateParams from '../messages/cosmos/MsgUpdateParams.vue';
import UnkownMessage from '../messages/cosmos/UnkownMessage.vue';

const messageMapping: Ref<Record<string, Component>> = ref({
    // '/cosmos.upgrade.v1beta1.MsgSoftwareUpgrade':  markRaw(MsgSoftwareUpgrade),
    // '/ethermint.feemarket.v1.MsgUpdateParams': markRaw(MsgUpdateParams),
    // '/cosmos.params.v1beta1.ParameterChangeProposal': 
})


const messageComponent = computed(() => {
    return props.proposal?.content ? messageMapping.value[props.proposal?.content.typeUrl] || UnkownMessage : UnkownMessage
})

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
})

</script>
<style>
</style>
  