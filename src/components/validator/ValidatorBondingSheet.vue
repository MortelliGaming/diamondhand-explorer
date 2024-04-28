<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container>
            <div class="text-h6 text-center pb-3">{{ t('validator.bonding') }}</div>
            <div class="d-flex flex-direction-row align-center">
                <v-icon icon="mdi-bitcoin" />
                <div class="pr-1 pl-3">{{ t('validator.bondedTokens') }}</div>
                <div class="d-flex flex-grow-1"> {{ BigInt(props.validator?.tokens || 0) / BigInt(Math.pow(10,18)) }}</div>
            </div>
            <div class="d-flex flex-direction-row" v-if="validatorDelegations[cosmosChainId || '']">
                <v-icon icon="mdi-account" />
                <div class="pr-1 pl-3"> {{ t('validator.delegators') }}</div>
                <div class="d-flex flex-grow-1"> {{ validatorDelegations[cosmosChainId || ''][validator?.operatorAddress || '']?.length }}</div>
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
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import moment from 'moment';

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

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})
const { validatorDelegations } = useValidatorsStore();

</script>
<style>
</style>
  