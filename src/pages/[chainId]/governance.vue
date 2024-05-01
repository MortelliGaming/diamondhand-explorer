<template>
  <chain-content>
    <v-row class="pb-3 pt-2" style="width: 100%;">
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
  <v-row style="width: 100%;" no-gutters class="fill-height">
    <v-col>
      <base-sheet :title="$t('proposal.proposals')" style="max-height:90%; overflow-y: scroll; overflow-x:hidden;">
        <proposal-header-row 
          v-for="proposal in proposalsToDisplay" :key="proposal.proposalId.toString()"
          :proposal="proposal" 
          @click="() => $router.push('proposal/' + proposal.proposalId.toString())"
          >
          <template v-slot:append>
            <proposal-status-chip :proposal="proposal" />
          </template>
        </proposal-header-row>
      </base-sheet>
    </v-col>
  </v-row>
</chain-content>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import ChainContent from '@/components/ChainContent.vue';
import BaseSheet from '@/components/BaseSheet.vue';
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
await loadCosmosProposals(cosmosChainId.value || '')

</script>
<style>
.break-string {
  overflow-wrap: break-word;
}
</style>
