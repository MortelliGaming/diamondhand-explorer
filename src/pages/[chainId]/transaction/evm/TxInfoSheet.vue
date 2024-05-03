<template>
    <base-sheet :title="props.isSmartcontractInteraction == false ? $t('transaction.ethTx') : $t('transaction.smartContractInteraction')" >
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

                <v-row no-gutters>
                    <v-col class="flex-column">
                        <copy-box 
                            :short="$vuetify.display.xs"
                            :text="tx?.from?.toString()" />
                        <div v-if="chainConfig?.keplr && tx.value > 0" class="d-flex flex-row">
                            (<copy-box
                            :short="$vuetify.display.xs"
                            :text="toBech32(chainConfig?.keplr?.bech32Config.bech32PrefixAccAddr || '', fromHex(tx?.from.replace('0x', '')))" />)
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" class="break-word">
                <b>{{ props.isSmartcontractInteraction == false ? $t('transaction.to') : $t('transaction.interactedWith') }}</b>
            </v-col>
            <v-col cols="12" class="break-word" v-if="tx.to">
                <v-row no-gutters>
                    <v-col class="flex-column">
                        <copy-box 
                            :short="$vuetify.display.xs"
                            :text="tx.to?.toString()" />
                        <div v-if="chainConfig?.keplr && tx.value > 0" class="d-flex flex-row">
                            (<copy-box
                            :short="$vuetify.display.xs"
                            :text="toBech32(chainConfig?.keplr?.bech32Config.bech32PrefixAccAddr || '', fromHex(tx?.to.replace('0x', '')))" />)
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" class="break-word" v-if="tx.value > 0">
                <b>{{ $t('transaction.value') }}</b>
            </v-col>
            <v-col cols="12" class="break-word" v-if="tx.value > 0">
                {{ Number(tx.value) / Math.pow(10, nativeCurrency?.decimals || 0) }} {{ nativeCurrency?.symbol }}
            </v-col>
            <v-col cols="12">
                <b>{{  $t('transaction.hash') }}</b>
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                <copy-box :text="tx.hash" />
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

import CopyBox from '@/components/CopyBox.vue';

const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const props = defineProps({
    tx: {
        type: Object as PropType<GetTransactionReturnType>,
        required: true
    },
    isSmartcontractInteraction: {
        type: Boolean,
        default: false
    }
})

const chainConfig = computed(() => {
    return availableChains.value?.find(c => c.name == chainIdFromRoute.value)
})

const nativeCurrency = computed(() => {
    return chainConfig.value?.evm?.nativeCurrency
})

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  