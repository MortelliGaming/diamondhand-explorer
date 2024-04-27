<template>
    <div class="text-caption" v-for="prop in Object.entries(dynamicMessage)" :key="prop[0]">
        <message-property :property="prop" />
        <v-divider />
    </div>
</template>

<script lang="ts" setup>

import { protoRegistry } from '@/lib/http';
import type { DecodeObject } from '@cosmjs/proto-signing'
import { computed, type PropType } from 'vue';
import MessageProperty from './MessageProperty.vue';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        regquired: true,
    },
})

const decodedMessage = computed(() => {
    try {
        if(props.message) {
            const messageType = protoRegistry.lookupType(props.message?.typeUrl)
            if(messageType) {
                return protoRegistry.decode(props.message)
            }
        }
    } catch(err) {
        console.warn('cannot decode message type ' + props.message?.typeUrl)
    }
    return props.message ? props.message : undefined
})

const dynamicMessage = computed(() => {
    return (decodedMessage.value || {}) as Record<string,string>
})


type ValueType = string | RecursiveObject;

interface RecursiveObject {
    [key: string]: ValueType;
}

</script>
<style>
</style>