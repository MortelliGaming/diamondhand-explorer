<template>
  <chain-content>
    <v-row class="pb-3 pt-2" style="width: 100%;">
      <v-col cols="12" class="text-center pt-0">
        <div class="d-flex">
          <div class="text-caption" v-if="votingProposals?.length > 0 || activeTab == ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD">
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
      <base-sheet :title="$t('proposal.proposals')">
        <v-container class="pa-0" style="height:70vh; overflow-y: scroll; overflow-x:hidden;">
          <v-row no-gutters v-if="isLoadingProposals.includes(chainIdFromRoute)">
            <v-col>
              <v-progress-linear
                color="cyan-lighten-2"
                indeterminate
                rounded
                ></v-progress-linear>
            </v-col>
          </v-row>
          <proposal-header-row
            v-for="proposal in paginatedProposals" :key="proposal.id.toString()"
            :proposal="proposal" 
            @click="() => $router.push('proposal/' + proposal.id.toString())"
            >
            <template v-slot:append>
              <proposal-status-chip :proposal="proposal" />
            </template>
          </proposal-header-row>
          <v-row no-gutters v-if="paginatedProposals.length == 0">
            <v-col no-gutters>
              {{ $t('proposals.noProposals') }}
            </v-col>
          </v-row>
          <v-row>
            <v-col>
                <v-pagination
                    v-model="page"
                    :length="numPages"
                    rounded="circle"
                ></v-pagination>
            </v-col>
        </v-row>
        </v-container>
      </base-sheet>
    </v-col>
  </v-row>
</chain-content>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import ChainContent from '@/components/ChainContent.vue';
import BaseSheet from '@/components/BaseSheet.vue';
import ProposalHeaderRow from '@/components/governance/ProposalHeaderRow.vue';
import ProposalStatusChip from '@/components/governance/ProposalStatusChip.vue';

const { loadCosmosProposals } = useProposalsStore()
const { proposals, isLoadingProposals } = storeToRefs(useProposalsStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const depositingProposals = computed(() => {
  return proposals.value[chainIdFromRoute.value || '']?.filter(p => p.status === ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD)
})
const votingProposals = computed(() => {
  return proposals.value[chainIdFromRoute.value || '']?.filter(p => p.status === ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD)
})
const endedProposals = computed(() => {
  return proposals.value[chainIdFromRoute.value || '']?.filter(p => [ProposalStatus.PROPOSAL_STATUS_PASSED, ProposalStatus.PROPOSAL_STATUS_FAILED, ProposalStatus.PROPOSAL_STATUS_REJECTED].includes(p.status))
})

const page = ref(1)
const numPages = computed(() => {
  const numPagesDecimal = proposalsToDisplay.value?.length / 50;
  return Math.ceil(numPagesDecimal);
})

const activeTab = ref(ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD )

const proposalsToDisplay = computed(() => {
  switch(activeTab.value) {
    case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
      return depositingProposals.value?.toSorted((a,b) => Number(b.id - a.id));
    case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD: 
      return votingProposals.value?.toSorted((a,b) => Number(b.id - a.id));
    default:
      return endedProposals.value?.toSorted((a,b) => Number(b.id - a.id));
  }
})

const numProposalsPerPage = 50
const paginatedProposals = computed(() => {
  return proposalsToDisplay.value.slice((page.value - 1) * numProposalsPerPage, (page.value - 1) * numProposalsPerPage + numProposalsPerPage)
})

setTimeout(() => {
  loadCosmosProposals(chainIdFromRoute.value || '').then(() => {
    activeTab.value = votingProposals.value?.length > 0 
    ? ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD 
    : ProposalStatus.PROPOSAL_STATUS_PASSED
  })
},0)

</script>
<style>
.break-string {
  overflow-wrap: break-word;
}
</style>
