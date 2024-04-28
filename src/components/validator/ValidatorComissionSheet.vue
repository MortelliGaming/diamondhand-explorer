<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container>
            <div class="text-h6 text-center">{{ t('validator.commission') }}</div>
                <validator-staking-commission-chart 
                    :valoperAddress="props.validator?.operatorAddress || ''"
                    :chainId="cosmosChainId || ''" />
                <v-container class="d-flex justify-center"  style="margin-top:-25px;">
                    <div class="">
                        {{ t('validator.rate') }}: {{ (Number(props.validator?.commission.commissionRates.rate || 0n) / Math.pow(10, 18) * 100).toFixed(0) }}%
                    </div>
                    <div class="pl-3 pr-3">
                        24h ±: {{ (Number(props.validator?.commission.commissionRates.maxChangeRate || 0n) / Math.pow(10, 18) * 100).toFixed(0) }}%
                    </div>
                    <div class="">
                        {{ t('validator.max') }}: {{ (Number(props.validator?.commission.commissionRates.maxRate || 0n) / Math.pow(10, 18) * 100).toFixed(0) }}%
                    </div>
                </v-container>

                <div class="text-center">
                    {{ t('validator.updated') }}: {{ moment(Number(props.validator?.commission.updateTime.seconds || 0n) * 1000).format('DD.MM.yyyy')  }}
                </div>
            </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import moment from 'moment';
import { computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { ExtendedValidator } from '@/store/validators';
import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';

import ValidatorStakingCommissionChart from '../charts/ValidatorStakingCommissionChart.vue';

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

const { t } = useI18n()
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

</script>
<style>
</style>
  