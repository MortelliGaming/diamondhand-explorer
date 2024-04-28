<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <div class="text-h6 text-center">{{t('validator.delegations')}} ({{ (validatorDelegations[cosmosChainId || ''] ? (validatorDelegations[cosmosChainId || ''][validator?.operatorAddress || ''])?.length : '')}})</div>
            <v-container style="height: 300px;overflow-y: scroll;" v-if="validatorDelegations[cosmosChainId || '']">
                <v-row v-for="(delegation, i) in delegationsToShow" :key="delegation.delegation.delegatorAddress">
                    <v-col cols="12" class="d-flex  d-flex align-center" v-if="delegation">
                        <v-chip class="justify-center">{{ ((page-1) * numDelegationPerPage) + 1 + i }}</v-chip>
                        <div class="pl-2 pr-2" style="max-width: 65%; overflow-wrap: break-word;">
                            <div class="text-caption">
                                <copy-box :text="delegation.delegation.delegatorAddress" />
                            </div>
                        </div>
                        <div class="text-caption text-right d-flex align-end justify-end flex-grow-1" style="word-break: break-word;">
                            {{ Number(BigInt(delegation.balance.amount) / BigInt(Math.pow(10,18))).toFixed(2) }} {{ delegation.balance.denom }}
                        </div>
                    </v-col>
                    <v-divider />
                </v-row>
            </v-container>
            <v-container class="pt-0 pb-0">
                <v-row>
                    <v-col>
                        <v-pagination
                            v-model="page"
                            :length="numPages"
                            rounded="circle"
                        ></v-pagination>
                    </v-col>
                </v-row>
            </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { ExtendedValidator, useValidatorsStore } from '@/store/validators';
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

const { loadValidatorDelegations } = useValidatorsStore()
const { validatorDelegations } = storeToRefs(useValidatorsStore())

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

const page=ref(1)
const numDelegationPerPage = ref(50)

const numPages = computed(() => {
    // when max < numpages dont add extra page
    // wehen max % numperpage == 0, dont add extra page
    const allDelegationsCount = (allDelegations.value?.length || 0) 
    const isModulo0 = allDelegationsCount % numDelegationPerPage.value == 0
    const isLessLongThan1Page = allDelegations.value?.length < numDelegationPerPage.value
    return (allDelegationsCount / numDelegationPerPage.value 
        + ((isLessLongThan1Page || isModulo0 ) ? 0 : 1))
        .toFixed(0)
})

const allDelegations = computed(() => {
    if(validatorDelegations.value[cosmosChainId.value || '']) {
        return (validatorDelegations.value[cosmosChainId.value || ''][props.validator?.operatorAddress || ''])?.toSorted((a,b) => Number(BigInt(b.balance.amount) - BigInt(a.balance.amount) / BigInt(Math.pow(10,18)))) || []
    } else {
        return []
    }
})

const delegationsToShow = computed(() => {
    if(validatorDelegations.value[cosmosChainId.value || '']) {
        return getElements(allDelegations.value, numDelegationPerPage.value, (page.value - 1) * numDelegationPerPage.value)
    } else {
        return []
    }
})

function getElements<T>(arr: T[], x: number, y: number): T[] {
    const maxIndex = arr.length - 1;
    if (y + x > maxIndex) {
        return arr.slice(y);
    } else {
        return arr.slice(y, y + x);
    }
}

setTimeout(() => {
    loadValidatorDelegations(cosmosChainId.value || '', props.validator?.operatorAddress || '')
}, 1500);

</script>
<style>
</style>