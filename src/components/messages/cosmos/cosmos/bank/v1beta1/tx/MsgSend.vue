<template>
    <v-row no-gutters>
        <v-col cols="12" class="pb-2">
            <b>{{ props.message?.typeUrl }}</b>
        </v-col>
        <v-col cols="4" style="overflow-wrap: break-word;" class="pr-2">
            <b>{{ t('message.from') }} </b>
        </v-col>
        <v-col cols="5" style="overflow-wrap: break-word;" class="pr-2">
            <b>{{ t('message.to') }} </b>
        </v-col>
        <v-col cols="3" style="overflow-wrap: break-word;" class="pr-2 text-right">
            <b>{{ t('message.amount') }} </b>
        </v-col>
        <v-col cols="4" style="overflow-wrap: break-word;" class="pr-2">
            {{ decodedMessage?.fromAddress }}
        </v-col>
        <v-col cols="5" style="overflow-wrap: break-word;" class="pr-2">
            {{ decodedMessage?.toAddress }}
        </v-col>
        <v-col cols="3" style="overflow-wrap: break-word;" class="pr-2 text-right">
            {{ sendAmount }} {{ decodedMessage?.amount[0].denom.toUpperCase() }}
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { protoRegistry } from '@/lib/protoRegistry';
import type { DecodeObject } from '@cosmjs/proto-signing'
import { computed, type PropType } from 'vue';
import { MsgSend } from '@/lib/proto/cosmos/bank/v1beta1/tx';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        regquired: true,
    },
})
const { t } = useI18n()

const decodedMessage = computed(() => {
    try {
        if(props.message && props.message.typeUrl === MsgSend.typeUrl) {
            return protoRegistry.decode(props.message) as MsgSend
        }
    } catch(err) {
        console.warn('wrong message type for' + props.message?.typeUrl)
    }
    return undefined
})

const sendAmount = computed(() => {
    const amount = (((Number(decodedMessage.value?.amount[0].amount || 0n))/ Math.pow(10,18)))
    return amount > 1 ? amount.toFixed(2) : amount
})


type ValueType = string | RecursiveObject;

interface RecursiveObject {
    [key: string]: ValueType;
}

</script>
<style>
</style>