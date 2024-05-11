<template>
    <apexchart class="d-flex justify-center" v-if="series.length > 0" width="200" type="donut" :options="chartOptions" :series="series"></apexchart>
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';
import { type ApexOptions } from 'apexcharts'
import Apexchart from 'vue3-apexcharts';

import { useValidatorsStore } from '@/store/validators';
import { storeToRefs } from 'pinia';

const { getValidatorInfo } = useValidatorsStore()
const { validators } = storeToRefs(useValidatorsStore())


const props = defineProps({
    chainName: {
        type: String,
        required: true,
    },
    valoperAddress: {
        type: String,
        required: true,
    }
})

const valoper = computed(() => props.valoperAddress)
const basicValidator = computed(() => {
    return validators.value[props.chainName]?.find(v => v.operatorAddress === valoper.value);
})

const validator = computed(() => { return (basicValidator.value != undefined ? getValidatorInfo(props.chainName, basicValidator.value) : null)})

const series = computed(() => {
    // [min, step, current, step, max]
    const rate = Number(BigInt(validator.value?.commission.commissionRates.rate || 0n)) / Number(BigInt(Math.pow(10,18))) * 100
    const maxChange = Number(BigInt(validator.value?.commission.commissionRates.maxChangeRate || 0n)) / Number(BigInt(Math.pow(10,18))) * 100
    const max = Number(BigInt(validator.value?.commission.commissionRates.maxRate || 0n)) / Number(BigInt(Math.pow(10,18))) * 100
    return [
        // commmision rate - maxChange
        rate - maxChange,
        // max Change
        maxChange,
        // current
        1,
        // max change
        maxChange,
        // max
        max,
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
                            return (Number((validator?.value?.commission.commissionRates.rate || 0n)) / Math.pow(10,18) * 100).toFixed(2) + '%'
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
  