<template>
    <div>
        <div
            class="break-string">
            {{ props.short ? shortenString(props.text || '', 12, 3) : props.text }}
            <span
                role="button"
                @click="() => copyToClipboard(props.text)">
                <v-icon size="x-small" icon="mdi-content-copy" />
            </span>
            <qr-code-dialog
                :qr-content="props.text"
                v-if="props.showQr == true"/>
        </div>
        <v-snackbar rounded elevation="12" color="success" location="top" :timeout="1000" v-model="snackbar" class="text-center">
            <div class="text-center text-caption"><b>{{ t('message.copied') }}</b></div>
        </v-snackbar>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import QrCodeDialog from './QrCodeDialog.vue';
import { shortenString } from '@/lib/stringHelper';

const props = defineProps({
    text: {
        type: String,
        required: false,
        default: undefined
    },
    short: {
        type: Boolean,
        default: false
    },
    showQr: {
        type: Boolean,
        default: false,
    }
})
const { t } = useI18n()
const snackbar = ref(false)

function copyToClipboard(text: string|undefined) {
    if(navigator.clipboard) {
        navigator.clipboard.writeText(text || '')
    }
    snackbar.value = true
}
</script>
<style>
</style>
  