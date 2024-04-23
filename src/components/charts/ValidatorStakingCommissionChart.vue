<template>
    <apexchart v-if="series.length > 0" width="200" type="donut" :options="chartOptions" :series="series"></apexchart>
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';
import { type ApexOptions } from 'apexcharts'
import Apexchart from 'vue3-apexcharts';

import { useBlockchainStore } from '@/store/blockchain';

const { getValidatorInfo } = useBlockchainStore()

const props = defineProps({
    chainId: {
        type: String,
        required: true,
    },
    valoperAddress: {
        type: String,
        required: true,
    }
})

const valoper = computed(() => props.valoperAddress)
const validator = computed(() => getValidatorInfo(props.chainId)?.find(v => v?.operatorAddress === valoper.value))

const series = computed(() => {
    // [min, step, current, step, max]
    return [    
        (parseInt(validator.value?.commission.commissionRates.rate.toString() || '0') - parseInt(validator.value?.commission.commissionRates.maxChangeRate.toString() || '0') ) / Math.pow(10,18) * 100,
        parseInt(validator.value?.commission.commissionRates.maxChangeRate.toString() || '0') / Math.pow(10,18) * 100,
        1,
        parseInt(validator.value?.commission.commissionRates.maxChangeRate.toString() || '0') / Math.pow(10,18) * 100,
        (parseInt(validator.value?.commission.commissionRates.maxRate.toString() || '0')) / Math.pow(10,18) * 100,
    ] as number[]
})

const chartOptions: Ref<ApexOptions> = ref({
    colors: ['#868686', '#5ab580', '#0d8d42','#5ab580','#868686'],
    series: series.value || [],
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
                        formatter: (w) => (w == series.value[series.value.length-1].toString()
                            ? series.value[series.value.length - 1] + '%'
                            : w == series.value[0].toString() ? '0%': (w == series.value[1].toString() || w == series.value[3].toString()) ? series.value[3] + '%' : '')
                    },
                    total: {
                        fontSize: '12px',
                        show: true,
                        color: '#0d8d42',
                        label: 'Current',
                        formatter: function () {
                            return (parseInt((validator?.value?.commission.commissionRates.rate.toString() || '0')) / Math.pow(10,18) * 100).toFixed(2) + '%'
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
})

</script>
<style>
.test {
    color: #0d8d42
}
</style>
  