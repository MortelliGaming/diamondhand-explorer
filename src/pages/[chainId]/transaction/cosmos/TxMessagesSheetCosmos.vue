<template>
    <base-sheet :title="$t('transaction.messages')">
        <v-row>
            <v-col cols="12" v-for="msg in props.tx.tx?.body?.messages" :key="msg.toString" style="overflow-wrap: break-word;">
                <component :is="getMessageComponent(msg.typeUrl)" :message="msg" />
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import BaseSheet from '@/components/BaseSheet.vue';
import { GetTxResponse } from '@/lib/proto/cosmos/tx/v1beta1/service';

import UnkownMessage from '@/components/messages/cosmos/UnkownMessage.vue';

import { MsgSend } from '@/lib/proto/cosmos/bank/v1beta1/tx';
import MsgSendTx from '@/components/messages/cosmos/cosmos/bank/v1beta1/tx/MsgSend.vue'

const props = defineProps({
    tx: {
        type: Object as PropType<GetTxResponse>,
        required: true
    }
})

const messageMapper = {
    [MsgSend.typeUrl]: MsgSendTx
} as Record<string,any>

function getMessageComponent(typeUrl: string) {
    if(messageMapper[typeUrl]) {
        return messageMapper[typeUrl]
    } else {
        return UnkownMessage
    }
}

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  