<template>
    <not-found v-if="!valoper"/>
    <div v-else>
        <v-container class="mt-3">
            <v-row justify="space-around">
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
            <v-row class="mt-5">
                <v-col>
                    <v-sheet width="100%">
                        <v-row>
                            <v-col>
                                <div class="text-h6 text-center pb-3">Votes</div>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row class="mt-5">
                <v-col>
                    <v-sheet width="100%">
                        <v-row>
                            <v-col>
                                <div class="text-h6 text-center pb-3">Delegations</div>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row  class="mt-5">
                <v-col>
                    <v-sheet width="100%">
                        <v-row>
                            <v-col>
                                <div class="text-h6 text-center pb-3">Operator Transactions</div>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import NotFound from '@/components/404.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import ValidatorInfoSheet from '@/components/validator/ValidatorInfoSheet.vue'
import ValidatorComissionSheet from '@/components/validator/ValidatorComissionSheet.vue'
import ValidatorBondingSheet from '@/components/validator/ValidatorBondingSheet.vue';
import ValidatorAddressesSheet from '@/components/validator/ValidatorAddressesSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()
const { validators } = storeToRefs(useValidatorsStore())
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

setTimeout(() => loadCosmosValidators(cosmosChainId.value || ''), 300);
</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  