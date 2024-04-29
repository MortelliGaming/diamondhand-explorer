<!-- Helper Component To Read the ChainId From URL Param -->
<!-- Shows 404 if invalid chainId -->
<template>
  <div v-if="isChainValid" class="fill-height">
    <div v-if="props.isLoading" style="height: 100%;">
      <loading />
    </div>
    <v-container class="fill-height" v-else>
      <slot></slot>
    </v-container>
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

const props = defineProps({
  isLoading: Boolean
})

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains } = storeToRefs(useBlockchainStore())

const availabeChainNames = computed(() => {
  return availableChains.value.map(c => c.name)
})
const isChainValid = computed(() => {
  return chainIdFromRoute.value && availabeChainNames.value.includes(chainIdFromRoute.value)
})
</script>
