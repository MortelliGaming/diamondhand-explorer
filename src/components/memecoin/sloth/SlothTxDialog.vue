<template>
    <v-dialog max-width="500" v-model="isActive">
        <template v-slot:default>
            <v-card :title="$t(!props.txHash?.startsWith('0x') ? 'sloth.waitForTxConfirm' : 'sloth.tokensBought')">
            <v-card-text class="d-flex flex-column justify-center align-center">
                <v-avatar size="x-large">
                    <v-img :class="!props.txHash?.startsWith('0x') ? 'sloth-token' : ''" :src="slothTokenImage" />
                </v-avatar>
                <div
                    v-if="!props.txHash?.startsWith('0x')"
                    class="text-caption pt-2" style="overflow-wrap: anywhere;">
                    {{ props.txHash }}
                </div>
                <copy-box class="text-caption pt-2" v-else :text="props.txHash" :short="10" :show-qr="false"/>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                :text="$t('text.close')"
                @click="isActive = false"
                ></v-btn>
            </v-card-actions>
            </v-card>
        </template>
    </v-dialog>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';

import CopyBox from '@/components/CopyBox.vue';
import slothTokenImage from '@/assets/slothToken.webp';

const props = defineProps({
    txHash: String
});

const emit = defineEmits(['close'])

const isActive = ref(false)

function show() {
    isActive.value = true;
}
function hide() {
    isActive.value = false;
}
function toggle() {
    isActive.value = !isActive.value;
}

defineExpose({
    show,
    hide,
    toggle
})

watch(isActive, () => {
    if(isActive.value == false) {
        emit('close');
    }
});

</script>
<style>
.sloth-token img {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* Makes the image circular */
  animation: rotate3d 3s infinite linear; /* Applies the animation */
}

@keyframes rotate3d {
  0% {
    transform: rotateY(0deg); /* Starts with the front side visible */
  }
  50% {
    transform: rotateY(180deg); /* Flips to the back side */
  }
  100% {
    transform: rotateY(360deg); /* Completes the full rotation */
  }
}
</style>