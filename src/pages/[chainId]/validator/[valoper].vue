<template>
    <not-found v-if="!valoper"/>
    <div v-else class="fill-height">
        <chain-content :is-loading="isLoadingValidators.includes(cosmosChainId || '') || isLoadingValidatorDelegations.includes(cosmosChainId || '')">
            <v-row style="width: 100%;">
                <v-col cols="12" sm="6" lg="4">
                    <validator-info-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                    <validator-comission-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" lg="4" :gutters="3">
                    <validator-bonding-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" lg="12" :gutters="3">
                    <validator-addresses-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
            </v-row>
            <v-row class="mt-5" style="width: 100%">
                <v-col cols="12">
                    <validator-votes-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
            </v-row>
            <v-row class="mt-5" style="width: 100%">
                <v-col cols="12">
                    <validator-delegations-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
            </v-row>
        </chain-content>
    </div>
</template>

<script lang="ts" setup>
import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';

import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';

import ValidatorInfoSheet from '@/components/validator/ValidatorInfoSheet.vue'
import ValidatorComissionSheet from '@/components/validator/ValidatorComissionSheet.vue'
import ValidatorBondingSheet from '@/components/validator/ValidatorBondingSheet.vue';
import ValidatorAddressesSheet from '@/components/validator/ValidatorAddressesSheet.vue';
import ValidatorVotesSheet from '@/components/validator/ValidatorVotesSheet.vue';
import ValidatorDelegationsSheet from '@/components/validator/ValidatorDelegationsSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { getValidatorInfo, loadCosmosValidators, loadValidatorDelegations } = useValidatorsStore()
const { validators, isLoadingValidators, isLoadingValidatorDelegations } = storeToRefs(useValidatorsStore())
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const valoper = computed(() => (route.params as {valoper: string}).valoper)
const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})
const basicValidator = computed(() => {
    return validators.value[cosmosChainId.value || '']?.find(v => v.operatorAddress === valoper.value);
})
const validator = computed(() => { return (basicValidator.value != undefined ? getValidatorInfo(cosmosChainId.value || '', basicValidator.value) : null)})

onMounted(() => {
    if(!validator.value) {
        loadCosmosValidators(cosmosChainId.value || '')
    }
    loadValidatorDelegations(cosmosChainId.value || '', valoper.value)
})

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  