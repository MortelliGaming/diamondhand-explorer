<template>
    <span>
        <span><b>{{ assetBalance?.displayDenom }}</b></span>
        <span class="pl-1">
            <span 
                :innerHTML="formatScientificNotation"
                v-if="longAmountString.startsWith('0.0000') && (assetBalance?.displayAmount || 0) > 0">
            </span>
            <span v-else>
                {{ assetBalance?.displayAmount.toFixed(4).replace(/0+$/, '').replace(/\.+$/, '') }}
            </span>
        </span>
        <span v-if="assetBalance?.interChain" class="pl-1">
            <v-chip label size="xx-small" color="green-lighten-4">
                <div class="pl-2 pr-2">
                    IBC
                </div>
            </v-chip>
        </span>
    </span>
</template>
<script lang="ts" setup>
import { PropType, computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { ExplorerAsset, useCoinsStore } from '@/store/coins';
import { useAppStore } from '@/store/app';

export type Coin = {
    amount: string
    balance: string
}

const props = defineProps({
    balance: {
        type: Object as PropType<{
            amount: string
            denom: string
        }>,
        required: true
    }
})
const { findAsset } = useCoinsStore()
const { chainIdFromRoute } = storeToRefs(useAppStore())
const assetBalance = ref<ExplorerAsset>();

const longAmountString = computed(() => (assetBalance.value?.displayAmount || 0).toFixed(36))

const formatScientificNotation= computed(() => {
  if(longAmountString.value.startsWith('0.')) {
    const numZeros = longAmountString.value.split('0.')[1].match(/^0+/)
    ? longAmountString.value.split('0.')[1].match(/^0+/)![0].length
    : 0
    const append = longAmountString.value.split('0.')[1].substring(numZeros, numZeros + 4).replace(/0+$/, '').replace(/\.+$/, '')
    const append2 = roundLastDecimal(parseFloat('0.' + append))
    console.log(roundLastDecimal(parseFloat('0.' + append)))
    return `0.0<sub><b>${numZeros}</b></sub>${append2.toString().replace('0.', '')}`;
  }

  const [mantissa, exponent] = (assetBalance.value?.displayAmount || 0).toString().split('e-');
  const exponentValue = parseInt(exponent, 10);
  const decimalDigits = mantissa.split('.')[1] || '';
  const addExponent = mantissa.split('.')[0][mantissa.split('.')[0].length-1] != '0'
    ? mantissa.split('.')[0].length
    : 1
  const lastFiveDigits = decimalDigits.slice(-5).padEnd(5, '0');
  console.log(`0.0<sub>${exponentValue - addExponent}</sub>${lastFiveDigits}`)
  return `0.0<sub><b>${exponentValue - addExponent}</b></sub>${lastFiveDigits}`;
})

function roundLastDecimal(num: number): number {
    return Math.round(num * 1000) / 1000;
}

watch(props, () => {
    console.log('asset updated')
    findAsset(props.balance, chainIdFromRoute.value).then((res) => {
        assetBalance.value = res;
    })
})

</script>