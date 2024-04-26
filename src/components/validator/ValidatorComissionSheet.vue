<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container>
            <div class="text-h6 text-center">Commission</div>
                <validator-staking-commission-chart 
                    :valoperAddress="props.validator?.operatorAddress || ''"
                    :chainId="cosmosChainId || ''" />
                <v-container class="d-flex justify-center"  style="margin-top:-25px;">
                    <div class="">
                        Rate: {{ (Number(props.validator?.commission.commissionRates.rate || 0n) / Math.pow(10, 18) * 100).toFixed(0) }}%
                    </div>
                    <div class="pl-3 pr-3">
                        24h ±: {{ (Number(props.validator?.commission.commissionRates.maxChangeRate || 0n) / Math.pow(10, 18) * 100).toFixed(0) }}%
                    </div>
                    <div class="">
                        Max: {{ (Number(props.validator?.commission.commissionRates.maxRate || 0n) / Math.pow(10, 18) * 100).toFixed(0) }}%
                    </div>
                </v-container>

                <div class="text-center">
                    Updated: {{ moment(Number(props.validator?.commission.updateTime.seconds || 0n) * 1000).format('DD.MM.yyyy')  }}
                </div>
            </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import moment from 'moment';
import { ExtendedValidator } from '@/store/validators';
import ValidatorStakingCommissionChart from '../charts/ValidatorStakingCommissionChart.vue';
import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

</script>
<style>
</style>
  