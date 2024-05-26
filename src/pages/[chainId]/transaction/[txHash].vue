<template>
    <div style="visibility: hidden;"></div>
    <cosmos-tx
        v-if="!txHash.startsWith('0x')"
        :txHash="txHash" />
    <evm-tx
        v-if="txHash.startsWith('0x')"
        :txHash="txHash" />
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';
import CosmosTx from './cosmos/CosmosTx.vue';
import EvmTx from './evm/EvmTx.vue';

const route = useRoute()

const txHash = (route.params as {txHash: string|undefined}).txHash || ''
</script>
  