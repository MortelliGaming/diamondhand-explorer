<template>
    <base-sheet :title="t('proposal.votes')">
        <v-row v-for="vote in votes" :key="vote.voter">
            <v-col cols="12">
                {{ vote.voter }}
                {{ vote.options }}
            </v-col>
        </v-row>
        <v-row v-if="votes.length == 0">
            <v-col>
                {{ t('proposal.noVotesFound') }}
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import { Ref, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseSheet from '../BaseSheet.vue';
import { Proposal, Vote } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import { useBlockchainStore } from '@/store/blockchain';
import { storeToRefs } from 'pinia';

const { t } = useI18n()
const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        required: true,
    },
    chainId: {
        type: String,
        required: true,
    }
})

const { cosmosHelper } = storeToRefs(useBlockchainStore())
const votes: Ref<Vote[]> = ref([])

cosmosHelper.value.GetProposalVotes(props.chainId, props.proposal.proposalId).then((res) => {
    votes.value = res?.votes || []
})

</script>
<style>
</style>
  