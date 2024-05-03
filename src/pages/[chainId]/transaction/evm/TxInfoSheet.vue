<template>
    <base-sheet :title="shortenString(tx.hash, 6,6)" >
        <v-row no-gutters>
            <v-col cols="12">
                <b>{{  $t('transaction.height') }}</b>
            </v-col>
            <v-col cols="12" role="button" @click="$router.push('../../block/'+props.tx.blockNumber)">
                {{  props.tx.blockNumber }}
            </v-col>
            <v-col cols="12">
                <b>{{  $t('transaction.gas') }}</b>
            </v-col>
            <v-col cols="12">
                {{  tx?.gas }} ( {{ tx?.gasPrice }} / {{ tx?.maxFeePerGas }} / {{ tx?.maxPriorityFeePerGas }} )
            </v-col>
            <v-col cols="12">
                <b>{{  $t('transaction.from') }}</b>
            </v-col>
            <v-col cols="12" role="button">
                <div>
                    {{ tx?.from }} 
                </div>
                <div v-if="chainConfig?.keplr">
                    {{ toBech32(chainConfig?.keplr?.bech32Config.bech32PrefixAccAddr || '', fromHex(tx?.from.replace('0x', ''))) }} 
                </div>
            </v-col>
            <v-col cols="12">
                <b>{{  $t('transaction.hash') }}</b>
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                {{  shortenString(tx.hash,16,8) }}
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import BaseSheet from '@/components/BaseSheet.vue';
import { GetTransactionReturnType } from 'viem';
import { toBech32, fromHex } from '@cosmjs/encoding';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { shortenString } from '@/lib/stringHelper';

const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const props = defineProps({
    tx: {
        type: Object as PropType<GetTransactionReturnType>,
        required: true
    }
})

const chainConfig = computed(() => {
    return availableChains.value?.find(c => c.name == chainIdFromRoute.value)
})

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  