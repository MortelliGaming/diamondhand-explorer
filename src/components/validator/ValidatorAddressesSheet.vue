<template>
    <base-sheet :title="t('validator.addresses')">
        <v-row class="d-flex justify-center align-center mt-5" no-gutters style="max-height: 220px; overflow-y: scroll; overflow-x:hidden;">
            <v-col cols="12" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.operatorAddress') }}</div></b>
                    <copy-box
                        :show-qr="true"
                        :text="props.validator?.operatorAddress" />
                </div>
            </v-col>
            <v-col cols="12" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.consensusAddress') }}</div></b>
                    <copy-box
                        :text="props.validator?.consensusAddress" />
                </div>
            </v-col>
            <v-col cols="12" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.consensusHexAddress') }}</div></b>
                    <copy-box
                        :text="props.validator?.consensusHexAddress" />
                </div>
            </v-col>
            <v-col cols="12" lg="4">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.operatorWallet') }}</div></b>
                    <copy-box
                        @click="$router.push('../account/' + props.validator?.operatorWallet)"
                        :text="props.validator?.operatorWallet" />
                </div>
            </v-col>
            <v-col cols="12" md="12" lg="8">
                <div class="d-flex flex-column">
                    <b><div>{{ t('validator.consensusPublicKey') }}</div></b>
                    <div class="break-string">{{ JSON.stringify(props.validator?.consensusPublicKey, null, 2) }}</div>
                </div>
            </v-col>
        </v-row>
    </base-sheet>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

import BaseSheet from '../BaseSheet.vue';
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
  