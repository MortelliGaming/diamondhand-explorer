<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <div class="text-h6 text-center">Dates</div>
            <v-row class="d-flex justify-center">
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.submitTime" :title="'submit time'" />
                </v-col>
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.depositEndTime" :title="'deposit end time'" />
                </v-col>
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.votingStartTime" :title="'voting start'" />
                </v-col>
                <v-col class="text-center">
                    <time-formatter :time="props.proposal?.votingEndTime" :title="'voting end'" />
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { Proposal } from '@/lib/proto/cosmos/gov/v1beta1/gov';

import TimeFormatter from '@/components/TimeFormatter.vue';

const props = defineProps({
    proposal: {
        type: Object as PropType<Proposal>,
        regquired: true,
    },
})

</script>
<style>
</style>
  