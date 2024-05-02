<template>
    <not-found v-if="!proposalId"/>
    <div v-else>
        <chain-content>
            <v-row justify="space-around" style="width: 100%;">
                <v-col cols="12">
                    <proposal-info-sheet v-if="proposal" :proposal="proposal" :chain-name="chainIdFromRoute"/>
                </v-col>
            </v-row>
            <v-row justify="space-around" style="width: 100%;">
                <v-col cols="12">
                    <proposal-votings-sheet v-if="proposal" :proposal="proposal" />
                </v-col>
            </v-row>
            <v-row justify="space-around" style="width: 100%;">
                <v-col cols="12">
                    <proposal-votes-sheet v-if="proposal" :proposal="proposal" :chain-name="chainIdFromRoute || ''" />
                </v-col>
            </v-row>
        </chain-content>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';
import ProposalInfoSheet from '@/components/governance/ProposalInfoSheet.vue';
import ProposalVotingsSheet from '@/components/governance/ProposalVotingsSheet.vue';
import ProposalVotesSheet from '@/components/governance/ProposalVotesSheet.vue';

import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { loadCosmosProposals } = useProposalsStore()
const { proposals } = storeToRefs(useProposalsStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const proposalId = computed(() => (route.params as {proposalId: string}).proposalId)

const proposal = computed(() => {
    return proposals.value[chainIdFromRoute.value || '']?.find(p => p.proposalId === BigInt(proposalId.value));
})

if(!proposal.value) {
    await loadCosmosProposals(chainIdFromRoute.value || '')
}

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  