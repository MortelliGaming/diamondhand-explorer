<!-- Helper Component To Read the ChainId From URL Param -->
<!-- Shows 404 if invalid chainId -->
<template>
  <div v-if="isChainValid">
    <div v-if="isConnecting || isLoading.length > 0 || validatorStore.isLoading.value.length > 0" style="height: 100%;">
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
import { useValidatorsStore } from '@/store/validators';

// Components
import NotFound from '@/components/404.vue'
import Loading from './Loading.vue';
import { computed, onUnmounted, ref } from 'vue';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains, isLoading, cosmosHelper } = storeToRefs(useBlockchainStore())
const validatorStore = storeToRefs(useValidatorsStore())

const availabeChainNames = computed(() => {
  return availableChains.value.map(c => c.name)
})
const isChainValid = computed(() => {
  return chainIdFromRoute.value && availabeChainNames.value.includes(chainIdFromRoute.value)
})

const isConnecting = ref(false);
const readConnecting = setInterval(() => {
  isConnecting.value = cosmosHelper.value?.GetIsConnecting()
}, 1000)

onUnmounted(() => {
  clearInterval(readConnecting)
})
</script>
