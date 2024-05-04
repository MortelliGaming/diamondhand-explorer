<template>
    
    <q-r-code-vue3
        imgclass="qr"
        :backgroundOptions="{ color: 'transparent' }"
        :dotsOptions="{
            type: 'dots',
            color: '#FFFFFF',
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: '#FFFFFF' },
                    { offset: 1, color: '#FFFFFF' },
                ],
            },
        }"
        image="http://testnet.localhost:5173/src/assets/logo.png"
        :imageOptions="{
            imageSize: 0.8
        }"
        :cornersDotOptions="{ type: undefined, color: '#FFFFFF' }"
        :cornersSquareOptions="{ type: 'dot', color: '#FFFFFF' }"
        :value="props.content"
    />
</template>

<script lang="ts" setup>
import QRCodeVue3 from 'qrcode-vue3';

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

</script>
<style>
.qr {
    max-height: 100px;
    max-width: 100px;
}
</style>
  