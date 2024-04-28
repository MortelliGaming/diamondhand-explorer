<template>
    <v-sheet elevation="12" color="" class="text-caption pa-3 fill-heigh2">
        <v-container class="pt-0">
            <v-row>
                <v-col cols="6">
                    <div class="text-h6 text-left">{{t('proposal.votes')}}</div>
                </v-col>
            </v-row>
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
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { Ref, ref, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

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
  