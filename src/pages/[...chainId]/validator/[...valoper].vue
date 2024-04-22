<template>
    <not-found v-if="!valoper"/>
    <div v-else>
        Validator Details
        {{ validator }}
    </div>
</template>

<script lang="ts" setup>
import NotFound from '@/components/404.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { getValidatorInfo } = useBlockchainStore()
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const valoper = computed(() => (route.params as { valoper: string })['valoper'])
const validator = computed(() => getValidatorInfo(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId || '')?.find(v => v?.operatorAddress === valoper.value))
</script>
  