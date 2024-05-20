<template>
    <base-sheet :title="t('validator.validator')">
        <div class="mt-3">
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
            <div class="pr-1"> {{ t('validator.status')}}: </div>
            <div> {{ bondStatusTranslation }}</div>
        </div>
        <div>
            <div class="d-flex flex-direction-row">
                <div class="pr-1"> {{t('validator.jailed')}}: </div>
                <div class="pr-1">{{ props.validator?.jailed ? t('message.yes') : t('message.no') }}</div>
                <v-icon :icon="props.validator?.jailed ? 'mdi-handcuffs' : 'mdi-check'" :color="props.validator?.jailed ? 'error' : 'success'" />
            </div>
        </div>
        <div>
            <v-btn
                @click="showDelegatedialog(props.validator?.operatorAddress || '')"
                density="compact" color="blue-grey-lighten-1">{{ t('validator.delegate') }}</v-btn>
        </div>
    </base-sheet>
    <dh-tx-dialog
        ref="transactionDialog"
        :blockchain-config="chainConfig || undefined" />
</template>

<script lang="ts" setup>
import { computed, ref, type PropType } from 'vue';
import { storeToRefs } from 'pinia';
import { ExtendedValidator, useValidatorsStore } from '@/store/validators';
import { useI18n } from 'vue-i18n';
import { DhTxDialog, TxDialogParams, WalletName } from 'diamondhand-widget';

import BaseSheet from '../BaseSheet.vue';
import { useAppStore } from '@/store/app';
import { useBlockchainStore } from '@/store/blockchain';

const { t } = useI18n();
const { keybaseAvatars } = storeToRefs(useValidatorsStore())

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains } = storeToRefs(useBlockchainStore())

const props = defineProps({
    validator: {
        type: Object as PropType<ExtendedValidator>,
        regquired: true,
    },
})

const chainConfig = computed(() => 
  availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr
)

const bondStatusTranslation = computed(() => {
    return t('validator.bondStatus.' + props.validator?.bondStatus)
})

const transactionDialog = ref<InstanceType<typeof DhTxDialog>>();

function showDelegatedialog(validatorAddress: string) {
  transactionDialog.value?.show('delegate', WalletName.Keplr, {
    validator: validatorAddress,
  } as TxDialogParams)
}

</script>
<style>
</style>
  