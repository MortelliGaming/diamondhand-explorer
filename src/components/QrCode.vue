<template>
    
    <q-r-code-vue3
        imgclass="qr"
        :backgroundOptions="{ color: 'transparent' }"
        :dotsOptions="{
            type: 'dot',
            color: '#FFFFFF',
            gradient: {
                type: 'linear',
                rotation: 0,
                colorStops: [
                    { offset: 0, color: '#FFFFFF' },
                    { offset: 1, color: '#FFFFFF' },
                ],
            },
            size: 0.8
        }"
        :image="dhLogo"
        :imageOptions="{
            imageSize: 0.6
        }"
        :cornersDotOptions="{ type: undefined, color: '#FFFFFF' }"
        :cornersSquareOptions="{ type: 'dot', color: '#FFFFFF' }"
        :value="props.content"
    />
</template>

<script lang="ts" setup>
import QRCodeVue3 from 'qrcode-vue3';
import dhLogo from '@/assets/logo.png';

const props = defineProps({
    content: {
        type: String,
        default: ''
    }
})

</script>
<style>
.qr {
    height: 100px;
    width: 100px;
}
</style>
  