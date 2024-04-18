<!-- Helper Component To Read the ChainId From URL Param -->
<!-- Shows 404 if invalid chainId -->
<template>
  <div v-if="chainIdFromRoute && Object.keys(availableChains).includes(chainIdFromRoute)">
    <slot></slot>
  </div>
  <not-found v-else />
</template>

<script lang="ts" setup>
// External
import { storeToRefs } from 'pinia';
// Components
import NotFound from '@/components/404.vue'
// Store
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains } = storeToRefs(useBlockchainStore())
</script>
