<template>
  <div>
    <v-container class="mt-3">
        <v-row>
          <v-col class="text-h6 text-center">{{t('module.governance')}}</v-col>
        </v-row>
        <v-row>
          <v-col class="text-center pl-6">
            <div class="d-flex">
              <div class="pa-3 text-caption" v-if="votingProposals?.length > 0">
                <v-btn size="x-small"
                  @click="() => {activeTab = ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD}"
                  :active="activeTab == ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD">Voting</v-btn>
              </div>
              <div class="pa-3 text-caption"  v-if="depositingProposals?.length > 0">
                <v-btn size="x-small"
                  @click="() => {activeTab = ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD}"
                  :active="activeTab == ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">Depositing</v-btn>
              </div>
              <div class="pa-3 text-caption">
                <v-btn size="x-small"
                  @click="() => {activeTab = ProposalStatus.PROPOSAL_STATUS_PASSED}"
                  :active="activeTab == ProposalStatus.PROPOSAL_STATUS_PASSED">Ended</v-btn>
              </div>
              <div class="flex-grow-1"></div>
            </div>
          </v-col>
        </v-row>
        <proposal-header-row v-for="proposal in proposalsToDisplay" :key="proposal.proposalId.toString()" :proposal="proposal"/>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import ProposalHeaderRow from '@/components/governance/ProposalHeaderRow.vue';

const { t } = useI18n()
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
      return depositingProposals.value;
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD: 
      return votingProposals.value;
    default:
      return endedProposals.value;
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
