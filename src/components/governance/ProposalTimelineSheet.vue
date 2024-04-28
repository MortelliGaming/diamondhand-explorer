<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <div class="text-h6">{{ t('proposal.dates') }}</div>
            <v-row class="d-flex justify-center pt-2">
                <v-col cols="6" sm="3" class="text-center">
                    <v-sheet elevation="6" color="grey-darken-3" class="pa-1">
                        <time-formatter :time="props.proposal?.submitTime" :title="t('proposal.submitTime')" />
                    </v-sheet>
                </v-col>
                <v-col cols="6" sm="3" class="text-center">
                    <v-sheet elevation="6" color="grey-darken-3" class="pa-1">
                        <time-formatter :time="props.proposal?.depositEndTime" :title="t('proposal.depositEndTime')" />
                    </v-sheet>
                    
                </v-col>
                <v-col cols="6" sm="3" class="text-center">
                    <v-sheet elevation="6" color="grey-darken-3" class="pa-1">
                        <time-formatter :time="props.proposal?.votingStartTime" :title="t('proposal.votingStartTime')" />
                    </v-sheet>
                    
                </v-col>
                <v-col cols="6" sm="3" class="text-center">
                    <v-sheet elevation="6" color="grey-darken-3" class="pa-1">
                        <time-formatter :time="props.proposal?.votingEndTime" :title="t('proposal.votingEndTime')" />
                    </v-sheet>
                    
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
  