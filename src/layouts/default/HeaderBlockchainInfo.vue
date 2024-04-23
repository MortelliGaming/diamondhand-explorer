<template>
  <div v-if="selectedChain" class="pl-2 pl-sm-16 ml-sm-3 d-flex align-center">
    <v-avatar>
      <v-img :src="selectedChain?.keplr?.chainSymbolImageUrl" />
    </v-avatar>
    <div>
      <div class="pl-2 text-caption d-flex direction-row">
        <div>{{ selectedChain?.name}}</div>
        <b class="pl-2">#{{ chainData?.blockchain?.lastHeight }}</b>
      </div>
      <div class="text-caption pl-2">
        {{ selectedChain?.keplr?.rpc }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app';
import { useBlockchainStore } from '@/store/blockchain';
import { computed } from 'vue';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains, cosmosChaindata } = storeToRefs(useBlockchainStore())

const selectedChain = computed(() => {
  return availableChains.value.find(c => c.name == chainIdFromRoute.value)
})

const chainData = computed(() => {
  return cosmosChaindata.value[selectedChain.value?.keplr?.chainId || '']
})

</script>
