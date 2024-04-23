<template>
  <chain-content>
    {{ chainIdFromRoute }}
    blocks
  </chain-content>
</template>

<script lang="ts" setup>
// External
import { storeToRefs } from 'pinia'

// Store
import { useAppStore } from '@/store/app'

// Components
import ChainContent from '@/components/ChainContent.vue'

const { chainIdFromRoute } = storeToRefs(useAppStore())

</script>
