<template>
    <not-found v-if="!address"/>
    <div v-else>
        <v-container class="mt-3">
            <v-row justify="space-around">
                <v-col cols="12">
                    account 
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'

import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { loadCosmosProposals } = useProposalsStore()
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const address = computed(() => (route.params as {address: string}).address)

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

setTimeout(() => {
    loadCosmosProposals(cosmosChainId.value || '')
}, 500);

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  