<template>

<v-row class="text-caption">
       <v-col>
        <v-row>
            <v-col cols="3">
                Authority:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.authority}}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Base Fee:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.baseFee }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Base Fee Change Denominator:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.baseFeeChangeDenominator }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Elasticity Multiplier:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.elasticityMultiplier }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Enable Height:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.enableHeight }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                Min Gas Multiplier:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.minGasMultiplier }}
            </v-col>
        </v-row>
        <v-divider /><v-row>
            <v-col cols="3">
                Min Gas Price:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.minGasPrice }}
            </v-col>
        </v-row>
        <v-divider /><v-row>
            <v-col cols="3">
                No Base Fee:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.params.noBaseFee }}
            </v-col>
        </v-row>
        <v-divider />
       </v-col>
    </v-row>
</template>

<script lang="ts" setup>

import { protoRegistry } from '@/lib/http';
import type { DecodeObject } from '@cosmjs/proto-signing'
import { computed, type PropType } from 'vue';
import { MsgUpdateParams } from '@/lib/proto/ethermint/feemarket/v1/tx';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        regquired: true,
    },
    chainId: {
        type: String,
        required: true,
    },
})


const decodedMessage = computed(() => {
    try {
        if(props.message) {
            const messageType = protoRegistry.lookupType(props.message?.typeUrl)
            if(messageType) {
                return protoRegistry.decode(props.message) as MsgUpdateParams
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