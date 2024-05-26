<template>
<v-row no-gutters  v-for="output in decodedMessage?.outputs" :key="output.address">
    <v-col
        v-for="asset in output.coins"
        :key="asset.denom + output.address"
        cols="12"
        class="d-flex align-center">
        <span class="pr-1">{{ $t('transaction.send') }}</span>
        <asset :balance="asset"/>
        <span class="pl-1 pr-1">{{ $t('transaction.to') }}</span>
        <copy-box :text="output.address" :short="6" />
    </v-col>
</v-row>
</template>
<script lang="ts" setup>

import { PropType, computed } from 'vue';
import { DecodeObject } from '@cosmjs/proto-signing';
import { protoRegistry } from '@/lib/protoRegistry';
import { MsgMultiSend } from '@/lib/proto/cosmos/bank/v1beta1/tx';
import CopyBox from '@/components/CopyBox.vue';
import Asset from '@/components/Asset.vue';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        required: true,
    }
})

const decodedMessage = computed(() => {
    return protoRegistry.decode(props.message) as MsgMultiSend
})
</script>