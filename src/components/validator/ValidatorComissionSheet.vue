<template>
    <base-sheet :title="t('validator.commission')" >
        <div class="mt-5">
            <validator-staking-commission-chart 
                :valoper-address="props.validator?.operatorAddress || ''"
                :chain-name="chainIdFromRoute || ''" />
        </div>
        <v-container class="d-flex justify-center"  style="margin-top:-25px;">
            <div class="">
                {{ t('validator.rate') }}: {{ (Number(props.validator?.commission.commissionRates.rate || 0n) / Math.pow(10, currentChainStakingCurrency?.coinDecimals || 0) * 100).toFixed(0) }}%
            </div>
            <div class="pl-3 pr-3">
                24h ±: {{ (Number(props.validator?.commission.commissionRates.maxChangeRate || 0n) / Math.pow(10, currentChainStakingCurrency?.coinDecimals || 0) * 100).toFixed(0) }}%
            </div>
            <div class="">
                {{ t('validator.max') }}: {{ (Number(props.validator?.commission.commissionRates.maxRate || 0n) / Math.pow(10, currentChainStakingCurrency?.coinDecimals || 0) * 100).toFixed(0) }}%
            </div>
        </v-container>
        <div class="text-center">
            {{ t('validator.updated') }}: {{ moment(Number(props.validator?.commission.updateTime.seconds || 0n) * 1000).format('DD.MM.yyyy')  }}
        </div>
    </base-sheet>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import moment from 'moment';
import { computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { ExtendedValidator } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { useBlockchainStore } from '@/store/blockchain';

import BaseSheet from '../BaseSheet.vue';
import ValidatorStakingCommissionChart from '../charts/ValidatorStakingCommissionChart.vue';

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

const { t } = useI18n()
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains } = storeToRefs(useBlockchainStore())

const currentChainStakingCurrency = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.stakeCurrency
})
</script>
<style>
</style>
  