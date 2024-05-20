<template>
    <v-sheet
        role="button"
        elevation="12"
        class="pa-2">
        <v-row no-gutters>
            <v-col>
                <b><copy-box :short="12" :text="txHash" /></b>
            </v-col>
        </v-row>
        <div v-for="(message,i) in decodedTx.body.messages"
        :key="message.typeUrl + '-' + i">
            <component
                :is="componentMapping[message.typeUrl] || markRaw(Default)" :message="message"/>
        </div>
    </v-sheet>
</template>
<script lang="ts" setup>
import { type Component, PropType, computed, markRaw } from 'vue';
import { decodeTxRaw } from '@cosmjs/proto-signing';

import MsgSend from './messagerow/MsgSend.vue';
import Default from './messagerow/Default.vue';
import { sha256 } from '@cosmjs/crypto';
import CopyBox from '@/components/CopyBox.vue';

const props = defineProps({
    tx: {
        type: Object as PropType<Uint8Array>,
        required: true,
    },
})

const componentMapping: Record<string, Component> = {
    '/cosmos.bank.v1beta1.MsgSend': markRaw(MsgSend),
}
const decodedTx = computed(() => {
    return decodeTxRaw(props.tx)
})
const txHash = computed(() => {
    return Buffer.from(sha256(props.tx)).toString('hex').toUpperCase()
})
</script>