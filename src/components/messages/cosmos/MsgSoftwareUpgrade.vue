<template>
    <v-row class="text-caption">
       <v-col>
        <v-row>
            <v-col cols="3">
                name:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.plan.name }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Binaries:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;" v-for="binary in Object.entries(JSON.parse(decodedMessage?.plan.info || '{}')?.binaries)" :key="binary[0]">
                <div class="d-flex flex-column">
                    <div>
                        <b>{{ binary[0] }}</b>
                    </div>
                    <div>
                        {{ binary[1] }}
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Height:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.plan.height }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Authority:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.authority}}
            </v-col>
        </v-row>
        <v-divider />
        <div>
        </div>
       </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { protoRegistry } from '@/lib/http';
import type { DecodeObject } from '@cosmjs/proto-signing'
import { computed, type PropType } from 'vue';
import { MsgSoftwareUpgrade } from '@/lib/proto/cosmos/upgrade/v1beta1/tx';

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
                return protoRegistry.decode(props.message) as MsgSoftwareUpgrade
            }
        }
        return undefined
    } catch(err) {
        console.warn('cannot decode message type ' + props.message?.typeUrl)
        return undefined
    }
})

</script>
<style>
</style>