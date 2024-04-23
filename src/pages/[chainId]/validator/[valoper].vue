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
                                <div id="validatorCommissionChart"></div>
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
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import moment from 'moment'
import { type ApexOptions } from 'apexcharts'
import ApexCharts from 'apexcharts'

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { getValidatorInfo } = useBlockchainStore()
const { availableChains, keybaseAvatars } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const valoper = computed(() => (route.params as {valoper: string}).valoper)
const validator = computed(() => getValidatorInfo(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId || '')?.find(v => v?.operatorAddress === valoper.value))

const _series = computed(() => {
    // [min, step, current, step, max]
    console.log(validator.value?.commission.commissionRates.rate.toString())
    return [    
        (parseInt(validator.value?.commission.commissionRates.rate.toString() || '0') - parseInt(validator.value?.commission.commissionRates.maxChangeRate.toString() || '0') ) / Math.pow(10,18) * 100,
        parseInt(validator.value?.commission.commissionRates.maxChangeRate.toString() || '0') / Math.pow(10,18) * 100,
        1,
        parseInt(validator.value?.commission.commissionRates.maxChangeRate.toString() || '0') / Math.pow(10,18) * 100,
        (parseInt(validator.value?.commission.commissionRates.maxRate.toString() || '0')) / Math.pow(10,18) * 100,
    ] as number[]
})

const chartOptions: ApexOptions = {
    colors: ['#868686', '#5ab580', '#0d8d42','#5ab580','#868686'],
    series: _series.value || [],
    labels: ['Min', 'Daily Change', 'Current', 'Daily Change', 'Max'],
    chart: {
      type: 'donut',
      selection: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
        show: false,
    },
    plotOptions: {
        pie: {
            startAngle: -90,
            endAngle: 90,
            donut: {
                labels: {
                    show: true,
                    name: {
                        show: true,
                        formatter: (w) => w
                    },
                    value: {
                        show: true,
                        formatter: (w) => (w == _series.value[_series.value.length-1].toString()
                            ? _series.value[_series.value.length - 1] + '%'
                            : w == _series.value[0].toString() ? '0%': (w == _series.value[1].toString() || w == _series.value[3].toString()) ? _series.value[3] + '%' : '')
                    },
                    total: {
                        fontSize: '12px',
                        show: true,
                        color: '#0d8d42',
                        label: 'Current',
                        formatter: function () {
                            return (parseInt((validator?.value?.commission.commissionRates.rate.toString() || '0')) / Math.pow(10,18) * 100).toString() + '%'
                        }
                    }
                }
            }
        },
    },
    states: {
        normal: {
            filter: {
                type: 'none',
                value: 0,
            }
        },
        hover: {
            filter: {
                type: 'none',
                value: 0
            }
        },
        active: {
            allowMultipleDataPointsSelection: false,
            filter: {
                type: 'none',
                value: 0,
            }
        },
    },
    tooltip: {
        enabled: false,
    },
    stroke: {
        colors: ['#868686', '#5ab580', '#0d8d42','#5ab580','#868686']
    },
}

let apecxChart: ApexCharts|undefined = undefined

onMounted(() => {
    apecxChart = new ApexCharts(document.querySelector("#validatorCommissionChart"), chartOptions);

    watch(validator, () => {
        chartOptions.series = _series.value;
        if(apecxChart) {
            try {
                apecxChart?.destroy()
            } catch { /* */ }
        }
        apecxChart = new ApexCharts(document.querySelector("#validatorCommissionChart"), chartOptions);
        apecxChart.render()
    })
})

</script>
<style>
.test {
    color: #0d8d42
}
</style>
  