<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <div class="text-h6 text-center">{{ t('proposal.dates') }}</div>
            <v-row class="d-flex justify-center">
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.submitTime" :title="t('proposal.submitTime')" />
                </v-col>
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.depositEndTime" :title="t('proposal.depositEndTime')" />
                </v-col>
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.votingStartTime" :title="t('proposal.votingStartTime')" />
                </v-col>
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.votingEndTime" :title="t('proposal.votingEndTime')" />
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import TimeFormatter from '@/components/TimeFormatter.vue';

const { t } = useI18n()
const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
})

</script>
<style>
</style>
  