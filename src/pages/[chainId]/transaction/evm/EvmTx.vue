<template>
    <chain-content>
        <evm-tx-content
            :tx-hash="props.txHash" />
    </chain-content>
</template>

<script lang="ts" setup>
import ChainContent from '@/components/ChainContent.vue';
import EvmTxContent from './EvmTxContent.vue';

const props = defineProps({
    txHash: {
        type: String,
        required: true,
    }
})

</script>
<style>
.break-word {
    overflow-wrap: break-word;
}
</style>