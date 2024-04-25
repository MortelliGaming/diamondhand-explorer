<template>
    <not-found v-if="!valoper"/>
    <div v-else>
        <v-container class="mt-3">
            <v-row justify="space-around">
                <v-col cols="12" sm="6" lg="4">
                    <validator-info-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" lg="4">
                    <validator-comission-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" lg="4" :gutters="3">
                    <validator-bonding-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
                <v-col cols="12" sm="6" lg="12" :gutters="3">
                    <validator-addresses-sheet
                        v-if="validator"
                        :validator="validator" />
                </v-col>
            </v-row>
            <v-row class="mt-5">
                <v-col>
                    <v-sheet width="100%" v-if="cosmosChainId">
                        <div class="text-h6 text-center pb-3 pt-3">Votes</div>
                        <v-container style="height: 300px;overflow-y: scroll;">
                            <v-row v-for="proposal in votingAndEndedProposals" :key="proposal?.proposalId.toString()">
                                <v-col cols="12" class="d-flex  d-flex justify-center align-center" v-if="proposal">
                                    <v-chip>{{ proposal?.proposalId }}</v-chip>
                                    <div class="pl-2 pr-2" style="max-width: 70%;">
                                        <div class="text-caption">
                                            <b>{{ proposal?.content?.typeUrl?.split('.')[proposal?.content?.typeUrl?.split('.').length -1] }}</b>
                                        </div>
                                        <div class="text-caption" style="word-break: break-word;">
                                            {{ JSON.stringify(decodePropsalContent(proposal)) }}
                                        </div>
                                    </div>
                                    <div class="text-caption flex-grow-1 d-flex justify-center align-center">
                                        {{  validatorVotes[proposal.proposalId.toString()] ? validatorVotes[proposal.proposalId.toString()] : 'did not vote' }}
                                    </div>
                                </v-col>
                                <v-divider />
                            </v-row>
                        </v-container>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row class="mt-5">
                <v-col>
                    <v-sheet width="100%">
                        <v-row>
                            <v-col>
                                <div class="text-h6 text-center pb-3">Delegations</div>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
            </v-row>
            <v-row  class="mt-5">
                <v-col>
                    <v-sheet width="100%">
                        <v-row>
                            <v-col>
                                <div class="text-h6 text-center pb-3">Operator Transactions</div>
                            </v-col>
                        </v-row>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import NotFound from '@/components/404.vue'
import { Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import ValidatorInfoSheet from '@/components/validator/ValidatorInfoSheet.vue'
import ValidatorComissionSheet from '@/components/validator/ValidatorComissionSheet.vue'
import ValidatorBondingSheet from '@/components/validator/ValidatorBondingSheet.vue';
import ValidatorAddressesSheet from '@/components/validator/ValidatorAddressesSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { ProposalStatus } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { protoRegistry } from '@/lib/http';
import { Proposal, Vote } from '@/lib/proto/cosmos/gov/v1beta1/gov';

const route = useRoute()
const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()
const { loadCosmosProposals, getProposalInfo } = useProposalsStore()
const { validators } = storeToRefs(useValidatorsStore())
const { proposals } = storeToRefs(useProposalsStore())
const { availableChains, cosmosHelper } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const validatorVotes: Ref<Record<string, Vote|undefined>> = ref({})

const valoper = computed(() => (route.params as {valoper: string}).valoper)
const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})
const basicValidator = computed(() => {
    return validators.value[cosmosChainId.value || '']?.find(v => v.operatorAddress === valoper.value);
})
const validator = computed(() => { return (basicValidator.value != undefined ? getValidatorInfo(cosmosChainId.value || '', basicValidator.value) : null)})


const votingAndEndedProposals = computed(() => {
    return proposals.value[cosmosChainId.value || '']?.filter(p => [ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD, ProposalStatus.PROPOSAL_STATUS_PASSED].includes(p.status))
        .map(p => getProposalInfo(cosmosChainId.value || '', p.proposalId))
        .filter(a => a)
        .toSorted((a,b) => parseInt(b!.proposalId.toString()) - parseInt(a!.proposalId.toString()))
})

function decodePropsalContent(proposal: Proposal): any {
    try {
        if(proposal.content) {
            return protoRegistry.decode(proposal.content)
        }
    } catch {/** */}
    return proposal
}

setTimeout(() => {
    loadCosmosValidators(cosmosChainId.value || '').then(() => {
        loadCosmosProposals(cosmosChainId.value || '').then(async () => {
            for(const proposal of proposals.value[cosmosChainId.value || '']) {
                try {
                    validatorVotes.value[proposal.proposalId.toString()] = (await cosmosHelper.value.GetProposalVotes(cosmosChainId.value || '', proposal.proposalId, validator?.value?.operatorWallet || ''))?.vote
                } catch {
                    validatorVotes.value[proposal.proposalId.toString()] = undefined;
                }
            }
        })
    })
}, 500);
</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  