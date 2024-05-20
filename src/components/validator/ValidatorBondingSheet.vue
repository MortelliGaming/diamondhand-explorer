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
        <div class="d-flex flex-column" v-if="commissionAssets.length > 0">
            <v-row no-gutters>
                <v-col cols="1">
                    <v-icon icon="mdi-percent-outline" />
                </v-col>
                <v-col cols="11">
                    <div>{{ t('validator.commission') }}</div>
                </v-col>
            </v-row>
            <v-row no-gutters class="d-flex flex-grow-1" v-for="coin in commissionAssets" :key="coin.displayDenom">
                <v-col offset="1">
                    {{ coin.displayAmount }}
                    <b class="pl-1 break-word">{{ coin.displayDenom.includes('/') ? coin.displayDenom.split('/')[coin.displayDenom.split('/').length -1] : coin.displayDenom }}</b>
                </v-col>
            </v-row>
        </div>
        <div class="d-flex flex-column" v-if="rewardAssets.length > 0">
            <v-row no-gutters>
                <v-col cols="1">
                    <v-icon icon="mdi-trophy" />
                </v-col>
                <v-col cols="11">
                    <div>{{ t('validator.rewards') }}</div>
                </v-col>
            </v-row>
            <v-row no-gutters class="d-flex flex-grow-1" v-for="coin in rewardAssets" :key="coin.displayDenom">
                <v-col offset="1">
                    {{ coin.displayAmount }}
                    <b class="pl-1 break-word">{{ coin.displayDenom.includes('/') ? coin.displayDenom.split('/')[coin.displayDenom.split('/').length -1] : coin.displayDenom }}</b>
                </v-col>
            </v-row>
        </div>
    </base-sheet>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import moment from 'moment';

import BaseSheet from '../BaseSheet.vue';
import { useValidatorsStore, type ExtendedValidator } from '@/store/validators';
import { useBlockchainStore } from '@/store/blockchain';
import { ExplorerAsset, useCoinsStore } from '@/store/coins';
import { useAppStore } from '@/store/app';


const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})
const { t } = useI18n()

const { availableChains, chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const { validatorDelegations } = useValidatorsStore();
const { findAsset } = useCoinsStore();
const currentChainStakingCurrency = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.stakeCurrency
})

const commissionAssets = ref<ExplorerAsset[]>([])
const rewardAssets = ref<ExplorerAsset[]>([])

function addPeriodBeforeEnd(str: string): string {
  const lastEighteenChars = str.slice(-18); // Get the last 18 characters
  const restOfString = str.slice(0, -18); // Get the rest of the string

  return `${restOfString}.${lastEighteenChars}`;
}

chainClients.value[chainIdFromRoute.value].cosmosClients?.queryClient.extensions.distribution.distribution.validatorCommission(props.validator?.operatorAddress || '')
    .then((comissionResponse) => {
        commissionAssets.value = []
        for(const commission of comissionResponse.commission.commission) {
            commission.amount = addPeriodBeforeEnd(commission.amount)
            findAsset(commission, chainIdFromRoute.value).then((asset) => {
                commissionAssets.value.push(asset)
            })
        }
    })
chainClients.value[chainIdFromRoute.value].cosmosClients?.queryClient.extensions.distribution.distribution.validatorOutstandingRewards(props.validator?.operatorAddress || '')
    .then((rewardsResponse) => {
        rewardAssets.value = []
        for(const reward of rewardsResponse.rewards.rewards) {
            reward.amount = addPeriodBeforeEnd(reward.amount)
            findAsset(reward, chainIdFromRoute.value).then((asset) => {
                rewardAssets.value.push(asset)
            })
        }
    })
</script>
<style>
</style>
  