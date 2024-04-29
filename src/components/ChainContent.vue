<!-- Helper Component To Read the ChainId From URL Param -->
<!-- Shows 404 if invalid chainId -->
<template>
  <div v-if="isChainValid" class="fill-height">
    <div v-if="isLoading.length > 0">
      <loading />
    </div>
    <div v-else>
      <slot></slot>
    </div>
  </div>
  <not-found v-else />
</template>

<script lang="ts" setup>
// External
import { storeToRefs } from 'pinia';

// Store
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain';

// Components
import NotFound from '@/components/404.vue'
import Loading from './Loading.vue';
import { computed } from 'vue';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains, isLoading } = storeToRefs(useBlockchainStore())

const availabeChainNames = computed(() => {
  return availableChains.value.map(c => c.name)
})
const isChainValid = computed(() => {
  return chainIdFromRoute.value && availabeChainNames.value.includes(chainIdFromRoute.value)
})
</script>
