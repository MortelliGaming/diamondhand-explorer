<template>
    <not-found v-if="!valoper"/>
    <div v-else>
        <v-container class="mt-3">
            <v-row justify="space-around">
                <v-col cols="12" sm="6" md="4">
                    <validator-info-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-sheet class="text-caption fill-height pa-3">
                        <div class="text-h6 text-center">Commission</div>
                        <validator-staking-commission-chart 
                            :valoperAddress="valoper"
                            :chainId="cosmosChainId || ''" />
                         <v-container class="d-flex justify-center"  style="margin-top:-25px;">
                            <div class="">
                                Rate: {{ parseInt(validator?.commission.commissionRates.rate || '0') / Math.pow(10, 18) * 100 }}%
                            </div>
                            <div class="pl-3 pr-3">
                                24h ±: {{ parseInt(validator?.commission.commissionRates.maxChangeRate || '0') / Math.pow(10, 18) * 100 }}%
                            </div>
                            <div class="">
                                Max: {{ parseInt(validator?.commission.commissionRates.maxRate || '0') / Math.pow(10, 18) * 100 }}%
                            </div>
                        </v-container>

                        <div class="text-center">
                            Updated: {{ moment(parseInt(validator?.commission.updateTime.seconds.toString() || '0') * 1000).format('DD.MM.yyyy')  }}
                        </div>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="6" md="4" :gutters="3">
                    <v-sheet class="fill-height pa-3 text-caption">
                        <div class="text-h6 text-center pb-3">Bonding</div>
                        <div class="d-flex flex-direction-row align-center">
                            <v-icon icon="mdi-bitcoin" />
                            <div class="pr-1 pl-3"> Bonded Tokens: </div>
                            <div class="d-flex flex-grow-1"> {{ BigInt(validator?.tokens || 0) / BigInt(Math.pow(10,18)) }}</div>
                        </div>
                        <div class="d-flex flex-direction-row">
                            <v-icon icon="mdi-account" />
                            <div class="pr-1 pl-3"> Delegators: </div>
                            <div class="d-flex flex-grow-1"> {{ 0 }}</div>
                        </div>
                        <div class="d-flex flex-direction-row align-center">
                            <div><v-icon icon="mdi-eye-minus-outline" /></div>
                            <div class="pr-1 pl-3"> Min Self Delegation: </div>
                            <div class="d-flex flex-grow-1"> {{ validator?.minSelfDelegation }}</div>
                        </div>
                        <div class="d-flex flex-direction-row align-center"  v-if="validator?.unbondingHeight">
                            <v-icon icon="mdi-water-opacity" />
                            <div class="pr-1 pl-3"> Unbonding Height: </div>
                            <div class="d-flex flex-grow-1"> {{ validator?.unbondingHeight }}</div>
                        </div>
                        <div class="d-flex flex-direction-row align-center" v-if="validator?.unbondingHeight">
                            <v-icon icon="mdi-lan-disconnect" />
                            <div class="pr-1 pl-3"> Unbonding Time: </div>
                            <div class="d-flex flex-grow-1"> {{ moment(parseInt(validator?.unbondingTime.seconds.toString() || '0') * 1000).format('DD.MM.YYYY HH:mm:ss') }}</div>
                        </div>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row class="mt-5">
                <v-col>
                    <v-sheet class="text-caption fill-height pa-3 text-left">
                        <div class="text-h6 text-center pb-3">Addresses</div>
                        <b><div>{{ 'validator.operatorAddress' }}</div></b>
                        <div class="break-string">{{ validator?.operatorAddress }}</div>
                        <b><div>{{ 'validator.consensusAddress' }}</div></b>
                        <div class="break-string">{{ validator?.consensusAddress }}</div>
                        <b><div>{{ 'validator.consensusHexAddress' }}</div></b>
                        <div class="break-string">{{ validator?.consensusHexAddress }}</div>
                        <b><div>{{ 'validator.operatorWallet' }}</div></b>
                        <div class="break-string">{{ validator?.operatorWallet }}</div>
                        <b><div>{{ 'validator.consensusPublicKey' }}</div></b>
                        <div class="break-string">{{ JSON.stringify(validator?.consensusPublicKey, null, 2) }}</div>
                    </v-sheet>
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
import moment from 'moment'

import ValidatorStakingCommissionChart from '@/components/charts/ValidatorStakingCommissionChart.vue';
import ValidatorInfoSheet from '@/components/ValidatorInfoSheet.vue'

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { getValidatorInfo } = useBlockchainStore()
const { availableChains, cosmosChaindata } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const valoper = computed(() => (route.params as {valoper: string}).valoper)

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

const basicValidator = computed(() => {
    return cosmosChaindata.value[cosmosChainId.value || '']?.validators?.validators.find(v => v.operatorAddress === valoper.value);
})

const validator = computed(() => { return (basicValidator.value != undefined ? getValidatorInfo(cosmosChainId.value || '', basicValidator.value) : null)})

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  