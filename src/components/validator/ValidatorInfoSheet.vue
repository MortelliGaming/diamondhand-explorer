<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <div class="text-h6 text-center pb-3">Validator</div>
            <div>
                <v-row class="d-flex align-center justify-center pb-2">
                    <v-col cols="3" class="d-flex align-center justify-center pl-5">
                        <v-avatar size="x-large">
                            <v-img v-if="props.validator?.description.identity" :src="keybaseAvatars[props.validator?.description.identity]" />
                            <v-icon icon="mdi-account" v-else />
                        </v-avatar>
                    </v-col>
                    <v-col cols="9">
                        <div class="text-bold">
                            <b>{{ props.validator?.description.moniker }}</b>
                        </div>
                    </v-col>
                </v-row>
            </div>
            <div class="d-flex flex-direction-row">
                <div> {{ props.validator?.description.details }}</div>
            </div>
            <div>
                <a :href="props.validator?.description.website">{{  props.validator?.description.website  }}</a>
            </div>
            <div>
                <a :href="'mailto:'+props.validator?.description.securityContact">{{  props.validator?.description.securityContact  }}</a>
            </div>
            <div class="d-flex flex-direction-row">
                <div class="pr-1"> Status: </div>
                <div> {{ props.validator?.bondStatus }}</div>
            </div>
            <div>
                <div class="d-flex flex-direction-row">
                    <div class="pr-1"> Jailed: </div>
                    <div class="pr-1">{{ props.validator?.jailed ? 'yes' : 'no' }}</div>
                    <v-icon :icon="props.validator?.jailed ? 'mdi-handcuffs' : 'mdi-check'" :color="props.validator?.jailed ? 'error' : 'success'" />
                </div>
            </div>
    </v-sheet>
</template>

<script lang="ts" setup>
import { type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { ExtendedValidator, useBlockchainStore } from '@/store/blockchain';

const { keybaseAvatars } = storeToRefs(useBlockchainStore())

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

</script>
<style>
</style>
  