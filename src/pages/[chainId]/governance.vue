<template>
  <v-container>
      <v-container class="pt-5">
          <v-row>
              <v-col cols="12" class="text-center pt-0">
                <div class="d-flex">
                  <div class="text-caption" v-if="votingProposals?.length > 0">
                    <v-btn size="x-small"
                      @click="() => {activeTab = ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD}"
                      :active="activeTab == ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD">Voting</v-btn>
                  </div>
                  <div class="text-caption"  v-if="depositingProposals?.length > 0">
                    <v-btn size="x-small"
                      @click="() => {activeTab = ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD}"
                      :active="activeTab == ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">Depositing</v-btn>
                  </div>
                  <div class="text-caption">
                    <v-btn size="x-small"
                      @click="() => {activeTab = ProposalStatus.PROPOSAL_STATUS_PASSED}"
                      :active="activeTab == ProposalStatus.PROPOSAL_STATUS_PASSED">Ended</v-btn>
                  </div>
                  <div class="flex-grow-1"></div>
                </div>
            </v-col>
          </v-row>

          <v-sheet elevation="12" color="" class="text-caption pa-3 mt-2 fill-heigh2">
            <proposal-header-row 
              v-for="proposal in proposalsToDisplay" :key="proposal.proposalId.toString()"
              :proposal="proposal" 
              @click="() => $router.push('proposal/' + proposal.proposalId.toString())"
              >
              <template v-slot:append>
                <proposal-status-chip :proposal="proposal" />
              </template>
            </proposal-header-row>
        </v-sheet>
        </v-container>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import ProposalHeaderRow from '@/components/governance/ProposalHeaderRow.vue';
import ProposalStatusChip from '@/components/governance/ProposalStatusChip.vue';

const { loadCosmosProposals } = useProposalsStore()
const { proposals } = storeToRefs(useProposalsStore())
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())


const cosmosChainId = computed(() => {
  return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

const depositingProposals = computed(() => {
  return proposals.value[cosmosChainId.value || '']?.filter(p => p.status === ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD)
})
const votingProposals = computed(() => {
  return proposals.value[cosmosChainId.value || '']?.filter(p => p.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD)
})
const endedProposals = computed(() => {
  return proposals.value[cosmosChainId.value || '']?.filter(p => [ProposalStatus.PROPOSAL_STATUS_PASSED, ProposalStatus.PROPOSAL_STATUS_FAILED, ProposalStatus.PROPOSAL_STATUS_REJECTED].includes(p.status))
})

const activeTab = ref(votingProposals.value?.length > 0 
  ? ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD 
  : ProposalStatus.PROPOSAL_STATUS_PASSED)

const proposalsToDisplay = computed(() => {
  switch(activeTab.value) {
    case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return depositingProposals.value?.toSorted((a,b) => Number(b.proposalId - a.proposalId));
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD: 
      return votingProposals.value?.toSorted((a,b) => Number(b.proposalId - a.proposalId));
    default:
      return endedProposals.value?.toSorted((a,b) => Number(b.proposalId - a.proposalId));
  }
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
