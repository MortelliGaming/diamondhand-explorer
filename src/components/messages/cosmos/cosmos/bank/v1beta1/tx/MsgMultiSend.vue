<template>
    <v-row no-gutters>
        <v-col cols="12" class="pt-0">
            <v-row
                class="pt-2"
                v-for="outputAmount in decodedMessage?.outputs"
                :key="outputAmount.address"
                no-gutters>
                <v-row no-gutters
                    v-for="asset in outputAmount.coins"
                    :key="outputAmount.address + asset.denom + 'in'">
                    <v-col cols="12" class="">
                        <span class="d-flex">
                            <b class="pr-1">{{ t('transaction.transfer') }}</b>
                            <asset :balance="asset" />
                        </span>
                        <span class="d-flex">
                            <b class="pr-1">{{ t('transaction.from') }}</b>
                            <copy-box role="button"
                                v-for="input in decodedMessage?.inputs"
                                :key="input.address"
                                @click="$router.push('../account/'+input.address)"
                                :show-qr="true"
                                :short="$vuetify.display.xs ? 12 : undefined"
                                :text="input.address" />
                        </span>
                        <span class="d-flex">
                            <b class="pr-1">{{ t('transaction.to') }}</b>
                            <copy-box role="button"
                                @click="$router.push('../account/'+outputAmount.address)"
                                :show-qr="true"
                                :short="$vuetify.display.xs ? 12 : undefined"
                                :text="outputAmount.address" />
                        </span>
                    </v-col>
                </v-row>
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
import CopyBox from '@/components/CopyBox.vue';


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