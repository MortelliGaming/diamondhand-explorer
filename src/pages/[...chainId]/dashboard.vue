<template>
  <div v-if="chainId">
  {{ chainId }}
  dashboard
  </div>
  <not-found v-else />
</template>

<script lang="ts" setup>
import { Ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import NotFound from '@/components/404.vue'

const route = useRoute()
const chainId: Ref<string> = computed(() => {
  return (route.params as { chainId: string }).chainId || '' as string;
})
</script>
