<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container>   
            <div class="text-h6 text-center pb-3">{{t('validator.addresses')}}</div>
            <v-row class="d-flex justify-center align-center" no-gutters style="max-height: 300px; overflow-y: scroll;">
                <v-col cols="12" lg="4">
                    <div class="d-flex flex-column">
                        <b><div>{{ t('validator.operatorAddress') }}</div></b>
                        <copy-box :text="props.validator?.operatorAddress" />
                    </div>
                </v-col>
                <v-col cols="12" lg="4">
                    <div class="d-flex flex-column">
                        <b><div>{{ t('validator.consensusAddress') }}</div></b>
                        <copy-box :text="props.validator?.consensusAddress" />
                    </div>
                </v-col>
                <v-col cols="12" lg="4">
                    <div class="d-flex flex-column">
                        <b><div>{{ t('validator.consensusHexAddress') }}</div></b>
                        <copy-box :text="props.validator?.consensusHexAddress" />
                    </div>
                </v-col>
                <v-col cols="12" lg="4">
                    <div class="d-flex flex-column">
                        <b><div>{{ t('validator.operatorWallet') }}</div></b>
                        <copy-box :text="props.validator?.operatorWallet" />
                    </div>
                </v-col>
                <v-col cols="12" md="12" lg="8">
                    <div class="d-flex flex-column">
                        <b><div>{{ t('validator.consensusPublicKey') }}</div></b>
                        <div class="break-string">{{ JSON.stringify(props.validator?.consensusPublicKey, null, 2) }}</div>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { ExtendedValidator } from '@/store/validators';

import CopyBox from '../CopyBox.vue';

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
  