<template>
    <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
            <span
                v-bind="activatorProps"
                role="button">
                <v-icon size="x-small" icon="mdi-qrcode" />
            </span>
        </template>

        <template v-slot:default>
            <v-card class="text-center" :title="props.qrContent">
            <v-card-text class="text-center">
                <qr-code :content="props.qrContent" />
                <div class="pb-2"></div>
            </v-card-text>
            </v-card>
        </template>
    </v-dialog>
</template>
<script lang="ts" setup>
import QrCode from './QrCode.vue';

const props = defineProps({
    qrContent: {
        type: String,
        default: 'https://diamondhand.capital'
    }
})

</script>