<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <div class="text-h6 text-center">Delegations ({{ (validatorDelegations[cosmosChainId || ''] ? (validatorDelegations[cosmosChainId || ''][validator?.operatorAddress || ''])?.length : '')}})</div>
            <v-container style="height: 300px;overflow-y: scroll;" v-if="validatorDelegations[cosmosChainId || '']">
                <v-row v-for="(delegation, i) in (validatorDelegations[cosmosChainId || ''][validator?.operatorAddress || '']).toSorted((a,b) => parseInt(b.balance.amount) - parseInt(a.balance.amount))" :key="delegation.delegation.delegatorAddress">
                    <v-col cols="12" class="d-flex  d-flex align-center" v-if="delegation">
                        <v-chip class="justify-center">{{ i + 1 }}</v-chip>
                        <div class="pl-2 pr-2" style="max-width: 65%; overflow-wrap: break-word;">
                            <div class="text-caption">
                                {{ delegation.delegation.delegatorAddress }}
                            </div>
                        </div>
                        <div class="text-caption text-right d-flex align-end justify-end flex-grow-1" style="word-break: break-word;">
                            {{ (parseInt(delegation.balance.amount) / Math.pow(10,18)).toFixed(2) }} {{ delegation.balance.denom }}
                        </div>
                    </v-col>
                    <v-divider />
                </v-row>
            </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { ExtendedValidator, useValidatorsStore } from '@/store/validators';
import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const { loadValidatorDelegations } = useValidatorsStore()
const { validatorDelegations } = storeToRefs(useValidatorsStore())

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})
const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

setTimeout(() => {
    loadValidatorDelegations(cosmosChainId.value || '', props.validator?.operatorAddress || '')
}, 1500);

</script>
<style>
</style>