<template>
    <v-row>
        <v-col cols="1"  class="d-flex justify-center align-center">
            <v-chip>{{ props.proposal?.proposalId }}</v-chip>
        </v-col>
        <v-col cols="9" class="d-flex  d-flex justify-center align-center" v-if="props.proposal">
            <div class="pl-2 pr-2">
                <div class="text-caption">
                    <b>{{ props.proposal?.content?.typeUrl?.split('.')[props.proposal?.content?.typeUrl?.split('.').length -1] }}</b>
                </div>
                <div class="text-caption" style="word-break: break-word;">
                    {{ JSON.stringify(decodePropsalContent(props.proposal)) }}
                </div>
            </div>
        </v-col>
        <v-col cols="2" class="d-flex align-center" v-if="(proposal?.votingEndTime.seconds || 0) <= Date.now()">
            <v-chip color="success" class="justify-center" v-if="(proposal?.status || ProposalStatus.PROPOSAL_STATUS_UNSPECIFIED) == ProposalStatus.PROPOSAL_STATUS_PASSED">
                <v-icon icon="mdi-check" />
            </v-chip>
            <v-chip color="success" class="justify-center" v-else>
                <v-icon icon="mdi-cancel" />
            </v-chip>
        </v-col>
        <v-col col="2" v-else-if="proposal?.status === ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD">
            {{ proposal.totalDeposit }}
        </v-col>
        <v-col col="2" v-else>
            {{ 'current turnout' }}
        </v-col>
        <v-divider />
    </v-row>
</template>

<script lang="ts" setup>

import { protoRegistry } from '@/lib/http';
import type { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';
import type { PropType } from 'vue';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1beta1/gov';

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
})

function decodePropsalContent(proposal: Proposal): any {
    try {
        if(proposal.content) {
            return protoRegistry.decode(proposal.content)
        }
    } catch {/** */}
    return proposal
}

</script>
<style>
</style>