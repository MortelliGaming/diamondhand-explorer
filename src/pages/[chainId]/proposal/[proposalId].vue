<template>
    <not-found v-if="!proposalId"/>
    <div v-else>
        <v-container class="mt-3">
            <v-row justify="space-around">
                <v-col cols="12">
                    <proposal-info-sheet v-if="proposal" :proposal="proposal" :chain-id="cosmosChainId"/>
                </v-col>
            </v-row>
            <v-row justify="space-around">
                <v-col cols="12">
                    <proposal-timeline-sheet v-if="proposal" :proposal="proposal" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import ProposalTimelineSheet from '@/components/governance/ProposalTimelineSheet.vue';
import ProposalInfoSheet from '@/components/governance/ProposalInfoSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { loadCosmosProposals } = useProposalsStore()
const { proposals } = storeToRefs(useProposalsStore())
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const proposalId = computed(() => (route.params as {proposalId: string}).proposalId)

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})
const proposal = computed(() => {
    return proposals.value[cosmosChainId.value || '']?.find(p => p.proposalId === BigInt(proposalId.value));
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
  