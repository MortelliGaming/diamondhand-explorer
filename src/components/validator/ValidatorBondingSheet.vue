<template>
    <base-sheet :title="t('validator.bonding')" >
        <div class="d-flex flex-direction-row align-center mt-5">
            <v-icon icon="mdi-bitcoin" />
            <div class="pr-1 pl-3">{{ t('validator.bondedTokens') }}</div>
            <div class="d-flex flex-grow-1"> {{ BigInt(props.validator?.tokens || 0) / BigInt(Math.pow(10,currentChainStakingCurrency?.coinDecimals || 0)) }} {{ currentChainStakingCurrency?.coinDenom }}</div>
        </div>
        <div class="d-flex flex-direction-row" v-if="validatorDelegations[chainIdFromRoute || '']">
            <v-icon icon="mdi-account" />
            <div class="pr-1 pl-3"> {{ t('validator.delegators') }}</div>
            <div class="d-flex flex-grow-1"> {{ validatorDelegations[chainIdFromRoute || ''][validator?.operatorAddress || '']?.length }}</div>
        </div>
        <div class="d-flex flex-direction-row align-center">
            <div><v-icon icon="mdi-eye-minus-outline" /></div>
            <div class="pr-1 pl-3">{{ t('validator.minSelfDelegation') }}</div>
            <div class="d-flex flex-grow-1"> {{ props.validator?.minSelfDelegation }}</div>
        </div>
        <div class="d-flex flex-direction-row align-center"  v-if="props.validator?.unbondingHeight">
            <v-icon icon="mdi-water-opacity" />
            <div class="pr-1 pl-3">{{ t('validator.unbondingHeight') }}</div>
            <div class="d-flex flex-grow-1"> {{ props.validator?.unbondingHeight }}</div>
        </div>
        <div class="d-flex flex-direction-row align-center" v-if="props.validator?.unbondingHeight">
            <v-icon icon="mdi-lan-disconnect" />
            <div class="pr-1 pl-3">{{ t('validator.unbondingTime') }}</div>
            <div class="d-flex flex-grow-1"> {{ moment(Number(BigInt(props.validator?.unbondingTime.seconds || 0n) * BigInt(1000))).format('DD.MM.YYYY HH:mm:ss') }}</div>
        </div>
    </base-sheet>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import moment from 'moment';

import BaseSheet from '../BaseSheet.vue';
import { useValidatorsStore, type ExtendedValidator } from '@/store/validators';
import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';


const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})
const { t } = useI18n()

const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const { validatorDelegations } = useValidatorsStore();

const currentChainStakingCurrency = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.stakeCurrency
})

</script>
<style>
</style>
  