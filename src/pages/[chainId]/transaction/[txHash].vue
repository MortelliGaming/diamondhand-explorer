<template>
    <div style="visibility: hidden;"></div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const txHash = (route.params as {txHash: string|undefined}).txHash || ''

if((route.params as {txHash: string|undefined}).txHash?.startsWith('0x')) {
    router.push('./evm/' + txHash)
} else {
    router.push('./cosmos/' + txHash)
}

</script>
  