<template>
    <not-found v-if="!blockHeight"/>
    <div v-else>
        <!-- Show Time Estimate in Future if Height is > latest -->
        <v-container class="mt-3" v-if="blockHeight > latestBlockHeight">
            {{ 'in future' }}
        </v-container>
        <v-container class="mt-3" v-else>
            {{ blockHeight }}
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { availableChains, latestBlocks } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const blockHeight = computed(() => parseInt((route.params as {blockHeight: string}).blockHeight))
const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})


const latestBlockHeight = computed(() => {
    return latestBlocks.value[cosmosChainId.value || '']?.length > 0 ? latestBlocks.value[cosmosChainId.value || ''][0]?.header.height : 0;
})
const block = computed(() => {
    return latestBlocks.value[cosmosChainId.value || '']?.find(b => b.header.height === blockHeight.value);
})

if(!block.value) {
    //loadCosmosProposals(cosmosChainId.value || '')
}

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  