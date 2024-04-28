<template>
    <apexchart class="d-flex justify-center" style="margin-left: -15px;" v-if="series.length > 0" width="100%" height="100px" type="bar" :options="chartOptions" :series="series"></apexchart>
</template>

<script lang="ts" setup>
import { type PropType, Ref, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { type ApexOptions } from 'apexcharts'
import Apexchart from 'vue3-apexcharts';

import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        required: true,
    },
})
const { t } = useI18n()
const series = computed(() => {
    return [{
        name: t('proposal.yes'),
        data: [Number(BigInt(props.proposal?.finalTallyResult?.yes) / BigInt(Math.pow(10,18)))]
    }, {
        name: t('proposal.no'),
        data: [Number(BigInt(props.proposal?.finalTallyResult?.no) / BigInt(Math.pow(10,18)))]
    }, {
        name: t('proposal.noWithVeto'),
        data: [Number(BigInt(props.proposal?.finalTallyResult?.noWithVeto) / BigInt(Math.pow(10,18)))]
    }, {
        name: t('proposal.abstain'),
        data: [Number(BigInt(props.proposal?.finalTallyResult?.abstain) / BigInt(Math.pow(10,18)))]
    }]
})

const chartOptions: Ref<ApexOptions> = ref({
    colors: ['#0fc321', '#e2653b', '#e01515','#15e0d2','bbbfbf'],
    series: series.value || [],
    chart: {
        type: 'bar',
        stacked: true,
        stackType: '100%',
        toolbar: {
            show: false,
        }
    },
    plotOptions: {
        bar: {
            horizontal: true,
        },
    },
    title: {
        text: ''
    },
    fill: {
        opacity: 1
    
    },
    legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['white','white','white','white','white']
        }
    },
    grid: {
        show: false,
    },
    xaxis: {
        show: false,
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: false,
        labels: {
            show: false
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
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
        enabled: true,
        fillSeriesColor: true,
        x: {
            show: false
        }
    },
    stroke: {
        colors: ['#0fc321', '#e2653b', '#e01515','#15e0d2','bfbfbf']
    },
})

</script>
<style>
</style>
  