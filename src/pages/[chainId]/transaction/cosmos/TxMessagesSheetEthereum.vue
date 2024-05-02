<template>
    <base-sheet :title="$t('transaction.evmTx')" style="max-height:130px; overflow-y: scroll;overflow-x: hidden;">
        <v-row no-gutters  v-for="msg in ethTxsDetail" :key="msg.toString" >
            <v-col cols="12" class ="pb-1 break-string">
                <b>{{ msg.type }}</b>
            </v-col>
            <v-col cols="12" class="break-string">
                <router-link color="orange-darken-4" :to="'../evm/'+txEthHash">{{ $t('transaction.inspectEvmTx') }}</router-link>
            </v-col>
            <v-col cols="12" class="break-string">
                <b>{{ $t('transaction.nonce') }}</b>
            </v-col>
            <v-col cols="12" class="break-string">
                <b>{{ msg.tx.nonce }}</b>
            </v-col>
            <v-col cols="12" class="break-string">
                <b>{{ $t('transaction.to') }}</b>
            </v-col>
            <v-col cols="12" class="break-string">
                <b>{{ msg.tx.to }}</b>
            </v-col>
            <v-col cols="12" class="break-string">
                <b>{{ $t('transaction.value') }}</b>
            </v-col>
            <v-col cols="12" class="break-string">
                <b>{{ msg.tx.value }}</b>
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import BaseSheet from '@/components/BaseSheet.vue';
import { GetTxResponse } from '@/lib/proto/cosmos/tx/v1beta1/service';
import { DynamicFeeTx, LegacyTx, AccessListTx, MsgEthereumTx } from '@/lib/proto/ethermint/evm/v1/tx';
import { protoRegistry } from '@/lib/protoRegistry';

const props = defineProps({
    tx: {
        type: Object as PropType<GetTxResponse>,
        required: true
    }
})
const txEthHash = computed(() => {
    return props.tx?.txResponse?.logs?.map(l => l.events.map(e => e.attributes.find(a => a.key === 'ethereumTxHash'))?.filter(e => e))[0][0]?.value
})
const ethTxsMain = computed(() => {
    return props.tx?.tx?.body?.messages.filter(msg => msg.typeUrl == MsgEthereumTx.typeUrl).map((msg) => protoRegistry.decode(msg) as MsgEthereumTx)
})
const ethTxsDetail = computed(() => {
    return ethTxsMain.value?.filter(msg => msg.data && [DynamicFeeTx.typeUrl, LegacyTx.typeUrl, AccessListTx.typeUrl].includes(msg.data?.typeUrl || ''))
        .map((msg) => {
            return {
                tx: (protoRegistry.decode(msg.data!) as (DynamicFeeTx|LegacyTx|AccessListTx)),
                type: msg.data!.typeUrl
            }
        })
})



</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  