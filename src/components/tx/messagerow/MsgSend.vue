<template>
<v-row no-gutters>
    <v-col
        cols="12"
        class="d-flex">
        <v-row no-gutters  v-for="amount in amounts" :key="amount.display.denom">
            <v-col cols="12" class="text-right d-flex flex-row">
                <div class="pl-0 pr-1">{{ $t('transaction.send') }}</div>
                <b>{{ toHumanString(amount.display.amount) }} {{ amount.display.denom }}</b>
                <div class="pl-1">{{ $t('transaction.to') }}</div>
                <copy-box class="pl-1" :text="decodedMessage.toAddress" :short="8" />
            </v-col>
        </v-row>
    </v-col>
</v-row>
</template>
<script lang="ts" setup>

import { PropType, computed } from 'vue';
import { DecodeObject } from '@cosmjs/proto-signing';
import { protoRegistry } from '@/lib/protoRegistry';
import { MsgSend } from '@/lib/proto/cosmos/bank/v1beta1/tx';
import CopyBox from '@/components/CopyBox.vue';
import { useBlockchainStore } from '@/store/blockchain';
// @ts-ignore
import { toHumanString } from 'human-readable-numbers'

const { getCosmosAsset } = useBlockchainStore()

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        required: true,
    }
})

const decodedMessage = computed(() => {
    return protoRegistry.decode(props.message) as MsgSend
})

const amounts = computed(() => {
    return decodedMessage.value?.amount.map((amount) => {
        return getCosmosAsset(BigInt(amount.amount), amount.denom)
    })
})
</script>