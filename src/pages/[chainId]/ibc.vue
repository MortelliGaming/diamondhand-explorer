<template>
  <chain-content>
    {{ chainIdFromRoute }}
    ibc
  </chain-content>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import ChainContent from '@/components/ChainContent.vue'
import { useAppStore } from '@/store/app'

const { chainIdFromRoute } = storeToRefs(useAppStore())

</script>
