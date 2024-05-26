<template>
    <span>
        <span><b>{{ assetBalance?.displayDenom }}</b></span>
        <span class="pl-1">{{ assetBalance?.displayAmount }}</span>
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
import { PropType, ref } from 'vue';
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

findAsset(props.balance, chainIdFromRoute.value).then((res) => {
    assetBalance.value = res;
})

</script>