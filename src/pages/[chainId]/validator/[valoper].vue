<template>
    <not-found v-if="!valoper"/>
    <div v-else>
        <v-container class="mt-3">
            <v-row>
                <v-col cols="12" sm="6" md="4">
                    <v-sheet width="100%"  style="height: calc(100% + 24px);" class="text-caption">
                        <v-row class="d-flex pl-4 pr-4">
                            <v-col>
                                <div class="text-h6 text-center pb-3">Validator</div>
                                <div>
                                    <v-row class="d-flex align-center justify-center pb-2">
                                        <v-col cols="3" class="d-flex align-center justify-center pl-5">
                                            <v-avatar>
                                                <v-img v-if="validator?.description.identity" :src="keybaseAvatars[validator?.description.identity]" />
                                                <v-icon icon="mdi-account" v-else />
                                            </v-avatar>
                                        </v-col>
                                        <v-col cols="9">
                                            <div>
                                                <b>{{ validator?.description.moniker }}</b>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                                <div class="d-flex flex-direction-row">
                                    <div> {{ validator?.description.details }}</div>
                                </div>
                                <div>
                                    <a :href="validator?.description.website">{{  validator?.description.website  }}</a>
                                </div>
                                <div>
                                    <a :href="'mailto:'+validator?.description.securityContact">{{  validator?.description.securityContact  }}</a>
                                </div>
                                <div class="d-flex flex-direction-row">
                                    <div class="pr-1"> Status: </div>
                                    <div> {{ validator?.status }}</div>
                                </div>
                                <div>
                                    <div class="d-flex flex-direction-row">
                                        <div class="pr-1"> Jailed: </div>
                                        <div class="pr-1">{{ validator?.jailed ? 'yes' : 'no' }}</div>
                                        <v-icon :icon="validator?.jailed ? 'mdi-handcuffs' : 'mdi-check'" :color="validator?.jailed ? 'error' : 'success'" />
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-sheet width="100%" class="text-caption">
                        <v-row class="d-flex">
                            <v-col>
                                <div class="text-h6 text-center">Commission</div>
                                <validator-staking-commission-chart 
                                    :valoperAddress="valoper"
                                    :chainId="cosmosChainId || ''" />
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
                <v-col cols="12" sm="6" md="4" :gutters="3">
                    <v-sheet width="100%" style="height: calc(100% + 24px);" class="text-caption">
                        <v-row class="d-flex pl-4 pr-4" style="height: 100%;">
                            <v-col>
                                <div class="text-h6 text-center pb-3">Bonding</div>
                                <div class="d-flex flex-direction-row align-center">
                                    <v-icon icon="mdi-bitcoin" />
                                    <div class="pr-1 pl-3"> Bonded Tokens: </div>
                                    <div> {{ BigInt(validator?.tokens || 0) / BigInt(Math.pow(10,18)) }}</div>
                                </div>
                                <div class="d-flex flex-direction-row">
                                    <v-icon icon="mdi-account" />
                                    <div class="pr-1 pl-3"> Delegators: </div>
                                    <div> {{ 0 }}</div>
                                </div>
                                <div class="d-flex flex-direction-row align-center">
                                    <v-icon icon="mdi-eye-minus-outline" />
                                    <div class="pr-1 pl-3"> Min Self Delegation: </div>
                                    <div> {{ validator?.minSelfDelegation }}</div>
                                </div>
                                <div class="d-flex flex-direction-row align-center"  v-if="validator?.unbondingHeight">
                                    <v-icon icon="mdi-water-opacity" />
                                    <div class="pr-1 pl-3"> Unbonding Height: </div>
                                    <div> {{ validator?.unbondingHeight }}</div>
                                </div>
                                <div class="d-flex flex-direction-row align-center" v-if="validator?.unbondingHeight">
                                    <v-icon icon="mdi-lan-disconnect" />
                                    <div class="pr-1 pl-3"> Unbonding Time: </div>
                                    <div> {{ moment(parseInt(validator?.unbondingTime.seconds.toString() || '0') * 1000).format('DD.MM.YYYY HH:mm:ss') }}</div>
                                </div>
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
                                <div class="text-h6 text-center pb-3">Addresses</div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col size="6">
                                <div class="text-caption text-center pb-3">{{ 'validator.operatorAddress' }}</div>
                                <div class="text-caption text-center pb-3">{{ validator?.operatorAddress }}</div>
                            </v-col>
                            <v-col size="6">
                                <div class="text-caption text-center pb-3">{{ 'validator.consensusAddress' }}</div>
                                <div class="text-caption text-center pb-3">{{ validator?.consensusAddress }}</div>
                            </v-col>
                            <v-col size="6">
                                <div class="text-caption text-center pb-3">{{ 'validator.consensusHexAddress' }}</div>
                                <div class="text-caption text-center pb-3">{{ validator?.consensusHexAddress }}</div>
                            </v-col>
                            <v-col size="6">
                                <div class="text-caption text-center pb-3">{{ 'validator.operatorWallet' }}</div>
                                <div class="text-caption text-center pb-3">{{ validator?.operatorWallet }}</div>
                            </v-col>
                            <v-col size="6">
                                <div class="text-caption text-center pb-3">{{ 'validator.consensusPublicKey' }}</div>
                                <div class="text-caption text-center pb-3">{{ JSON.stringify(validator?.consensusPublicKey, null, 2) }}</div>
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

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { getValidatorInfo } = useBlockchainStore()
const { availableChains, keybaseAvatars } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const valoper = computed(() => (route.params as {valoper: string}).valoper)
const validator = computed(() => getValidatorInfo(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId || '')?.find(v => v?.operatorAddress === valoper.value))

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

</script>
<style>
.test {
    color: #0d8d42
}
</style>
  