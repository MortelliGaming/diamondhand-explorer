<template>
    <base-sheet :title="t('proposal.votes')">
        <v-row v-for="vote in votes" :key="vote.voter" no-gutters>
            <v-col cols="12">
                <v-row no-gutters>
                    <v-col cols="9">
                        <v-row class="d-flex" no-gutters>
                            <v-col cols="2" class="d-flex align-center pt-2 pb-2">
                                <v-avatar size="x-small">
                                    <v-img v-if="findValidatorByOperatorAddress(vote.voter)?.description.identity" :src="keybaseAvatars[findValidatorByOperatorAddress(vote.voter)!.description.identity]" />
                                    <v-icon icon="mdi-account" v-else />
                                </v-avatar>
                            </v-col>
                            <v-col cols="10" class="break-word d-sm-flex align-sm-center">
                                <div>
                                    {{ findValidatorByOperatorAddress(vote.voter)?.description.moniker || vote.voter }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="3" class="text-right text-bold d-flex align-center justify-end">
                        {{ $t('proposal.voteOption.' + VoteOption[vote.options[0].option]) }}
                    </v-col>
                </v-row>
            </v-col>
            <v-divider />
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
import { Proposal } from '@/lib/proto/cosmos/gov/v1/gov';
import { Vote } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { storeToRefs } from 'pinia';
import { VoteOption } from '../../lib/proto/cosmos/group/v1/types';

const { t } = useI18n()
const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        required: true,
    },
    chainName: {
        type: String,
        required: true,
    }
})

const { validators, keybaseAvatars } = storeToRefs(useValidatorsStore())
const { getValidatorInfo } = useValidatorsStore()
const { chainClients } = storeToRefs(useBlockchainStore())
const isLoadingVotes = ref(false)
const votes: Ref<Vote[]> = ref([])
const gov = chainClients.value[props.chainName]?.cosmosClients?.queryClient.extensions.gov.gov;

isLoadingVotes.value = true;
gov?.votes(props.proposal.id.toString()).then(async (res) => {
    votes.value = res?.votes || []
    let nextPage = res?.pagination?.nextKey
    while(nextPage?.length || 0 > 0) {
        const nextRes = await gov?.votes(props.proposal.id.toString(), nextPage);
        votes.value.concat(nextRes.votes)
        nextPage = nextRes.pagination?.nextKey
        console.log('next page votes')
    }
    isLoadingVotes.value = false;
}).catch(() => {
    isLoadingVotes.value = false;
})

function findValidatorByOperatorAddress(operatorWalletAddress: string) {
    return Object.values(validators.value)
        .flatMap((vs,i)=> vs.flatMap(v => getValidatorInfo(Object.keys(validators.value)[i],v))).find(v => v.operatorWallet == operatorWalletAddress)
}

</script>
<style>
</style>
  