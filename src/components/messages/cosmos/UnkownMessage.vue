<template>
    <v-row>
        <v-col cols="12" class="pb-0">
            <b>{{ props.message?.typeUrl }}</b>
        </v-col>
    </v-row>
    <v-row>
        <v-col style="white-space: pre-wrap; overflow-wrap: break-word;" class="pt-0">
            {{ (JSON.stringify(dynamicMessage, null, '\t').replace(/^\s+/, '')) }}
        </v-col>
    </v-row>
    <v-divider />
</template>

<script lang="ts" setup>
import { protoRegistry } from '@/lib/protoRegistry';
import type { DecodeObject } from '@cosmjs/proto-signing'
import { computed, type PropType } from 'vue';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        regquired: true,
    },
    chainName: {
        type: String,
        required: false,
    }
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