<template>
    <v-row no-gutters>
        <v-col cols="12" class="pb-2">
            <b>{{ props.message?.typeUrl }}</b>
        </v-col>
        <v-col cols="4" style="overflow-wrap: break-word;" class="pr-2">
            <b>{{ t('message.from') }} </b>
        </v-col>
        <v-col cols="5" style="overflow-wrap: break-word;" class="pr-2">
            <b>{{ t('message.to') }} </b>
        </v-col>
        <v-col
            cols="3" style="overflow-wrap: break-word;" class="pr-2 text-right">
            <b>{{ t('message.amount') }} </b>
        </v-col>
        <v-col
            v-for="inputAmount in decodedMessage?.inputs"
            :key="inputAmount.address"
            cols="4" style="overflow-wrap: break-word;" class="pr-2">
            <v-row no-gutters>
                <v-col cols="12">
                    {{ inputAmount.address }}
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col
                    v-for="asset in inputAmount.coins"
                    :key="inputAmount.address + asset.denom + 'in'"
                    cols="12">
                    <asset :balance="asset" />
                </v-col>
            </v-row>
        </v-col><v-col
            v-for="outputAmount in decodedMessage?.outputs"
            :key="outputAmount.address"
            cols="4" style="overflow-wrap: break-word;" class="pr-2">
            <v-row no-gutters>
                <v-col cols="12">
                    {{ outputAmount.address }}
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col
                    v-for="asset in outputAmount.coins"
                    :key="outputAmount.address + asset.denom + 'in'"
                    cols="12">
                    {{ asset }}
                    <asset :balance="asset" />
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { protoRegistry } from '@/lib/protoRegistry';
import type { DecodeObject } from '@cosmjs/proto-signing'
import { computed, type PropType } from 'vue';
import { MsgMultiSend } from '@/lib/proto/cosmos/bank/v1beta1/tx';

import Asset from '@/components/Asset.vue';


const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        regquired: true,
    },
})
const { t } = useI18n()

const decodedMessage = computed(() => {
    try {
        if(props.message && props.message.typeUrl === MsgMultiSend.typeUrl) {
            return protoRegistry.decode(props.message) as MsgMultiSend
        }
    } catch(err) {
        console.warn('wrong message type for' + props.message?.typeUrl)
    }
    return undefined
})

type ValueType = string | RecursiveObject;

interface RecursiveObject {
    [key: string]: ValueType;
}

</script>
<style>
</style>