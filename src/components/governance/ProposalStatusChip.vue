<template>
    <v-chip :color="statusChipColor">
        <div  style="font-size: xx-small;" >{{ statusText }}</div>
    </v-chip>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { Proposal } from '@/lib/proto/cosmos/gov/v1/gov';
import { ProposalStatus } from '@/lib/proto/cosmos/gov/v1/gov';

const { t } = useI18n()

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
})

const statusChipColor = computed(() => {
    switch(props.proposal?.status) {
        case ProposalStatus.PROPOSAL_STATUS_DEPOSIT_PERIOD:
            return 'orange-lighten-1'
        case ProposalStatus.PROPOSAL_STATUS_PASSED: 
            return 'green-darken-3'
        case ProposalStatus.PROPOSAL_STATUS_VOTING_PERIOD:
            return 'green-lighten-1'
        default: 
            return 'red-darken-3'
    }
})

const statusText = computed(() => {
    return t('proposal.status.'+ ProposalStatus[props.proposal?.status || 0])
})

</script>
<style>
</style>
  