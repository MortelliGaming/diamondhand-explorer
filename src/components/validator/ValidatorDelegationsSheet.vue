<template>
    <base-sheet :title="t('validator.delegations') + '('+ (validatorDelegations[chainIdFromRoute || ''] ? (validatorDelegations[chainIdFromRoute || ''][validator?.operatorAddress || ''])?.length : '') +')'">
        <v-container style="height: 300px;overflow-y: scroll; overflow-x:hidden;" v-if="validatorDelegations[chainIdFromRoute || '']" class="pa-0 mt-5">
            <v-row v-for="(delegation, i) in delegationsToShow" :key="delegation.delegation.delegatorAddress">
                <v-col 
                    @click="$router.push('../account/'+delegation.delegation.delegatorAddress)"
                    cols="12" class="d-flex  d-flex align-center" v-if="delegation">
                    <v-chip class="justify-center">{{ ((page-1) * numDelegationPerPage) + 1 + i }}</v-chip>
                    <div class="pl-2" style="max-width: 65%; overflow-wrap: break-word;">
                        <div class="text-caption">
                            <copy-box
                                :show-qr="true"
                                :text="delegation.delegation.delegatorAddress" />
                        </div>
                    </div>
                    <div class="text-caption text-right d-flex align-end justify-end flex-grow-1" style="word-break: break-word;">
                        {{ getCosmosAsset(BigInt(delegation.balance.amount), delegation.balance.denom).display.amount }} {{ getCosmosAsset(BigInt(delegation.balance.amount), delegation.balance.denom).display.denom }}
                    </div>
                </v-col>
                <v-divider />
            </v-row>
        </v-container>
        <v-row>
            <v-col>
                <v-pagination
                    v-model="page"
                    :length="numPages"
                    rounded="circle"
                ></v-pagination>
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import CopyBox from '../CopyBox.vue';

import { ExtendedValidator, useValidatorsStore } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { useBlockchainStore } from '@/store/blockchain';
import BaseSheet from '../BaseSheet.vue';

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})
const { t } = useI18n()
const { chainIdFromRoute } = storeToRefs(useAppStore())

const { validatorDelegations } = storeToRefs(useValidatorsStore())
const { getCosmosAsset } = useBlockchainStore()

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
    if(validatorDelegations.value[chainIdFromRoute.value || '']) {
        return (validatorDelegations.value[chainIdFromRoute.value || ''][props.validator?.operatorAddress || ''])?.toSorted((a,b) => Number(BigInt(b.balance.amount) - BigInt(a.balance.amount))) || []
    } else {
        return []
    }
})

const delegationsToShow = computed(() => {
    if(validatorDelegations.value[chainIdFromRoute.value || '']) {
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

</script>
<style>
</style>