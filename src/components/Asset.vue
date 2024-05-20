<template>
    <v-row no-gutters class="d-flex flex-row" style="width: 100%;">
        <v-col class="text-right justify-end d-flex align-center">
            {{ assetBalance?.displayDenom.includes('/') ? assetBalance?.displayDenom.split('/')[assetBalance?.displayDenom.split('/').length -1] : assetBalance?.displayDenom }}
            {{ numeral(assetBalance?.displayAmount).format((assetBalance?.displayAmount || 1.1) >= 1.0 ? `` : `'0.000000`) }}
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { storeToRefs } from 'pinia';
import numeral from 'numeral';
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

findAsset(props.balance, chainIdFromRoute.value).then((res) => {
    assetBalance.value = res;
})

</script>