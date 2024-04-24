<template>
    <v-sheet class="text-caption pa-3 fill-height">

        <div class="text-h6 text-center pb-3">{{t('validator.addresses')}}</div>
        <v-row class="d-flex justify-center align-center">
            <v-col cols="12" md="6" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.operatorAddress') }}</div></b>
                    <div class="break-string">{{ props.validator?.operatorAddress }}</div>
                </div>
            </v-col>
            <v-col cols="12" md="6" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.consensusAddress') }}</div></b>
                    <div class="break-string">{{ props.validator?.consensusAddress }}</div>
                </div>
            </v-col>
            <v-col cols="12" md="6" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.consensusHexAddress') }}</div></b>
                    <div class="break-string">{{ props.validator?.consensusHexAddress }}</div>
                </div>
            </v-col>
            <v-col cols="12" md="6" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.operatorWallet') }}</div></b>
                    <div class="break-string">{{ props.validator?.operatorWallet }}</div>
                </div>
            </v-col>
            <v-col cols="12" md="12" lg="8">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.consensusPublicKey') }}</div></b>
                    <div class="break-string">{{ JSON.stringify(props.validator?.consensusPublicKey, null, 2) }}</div>
                </div>
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script lang="ts" setup>
import { ExtendedValidator } from '@/store/blockchain';
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

</script>
<style>
</style>
  