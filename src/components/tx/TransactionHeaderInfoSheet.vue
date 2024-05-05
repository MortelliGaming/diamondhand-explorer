<template>
    <v-sheet
        role="button"
        @click="$router.push('../transaction/' + decodedTx)"
        color="grey-darken-3" 
        elevation="12"
        class="pa-2">
        <v-row no-gutters>
            <v-col cols="12" style="overflow-wrap: break-word;">
                <b>{{ $t('blocks.hash')}}</b>
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                {{ txHash }}
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                <b>{{ $t('blocks.fees')}}</b>
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;" v-for="fee in decodedTx.authInfo.fee?.amount" :key="fee.denom">
                {{ getCosmosAsset(BigInt(fee.amount), fee.denom).display.amount }} {{ getCosmosAsset(BigInt(fee.amount), fee.denom).display.denom }}
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                <b>{{ $t('blocks.messages')}}</b>
            </v-col>
            <v-col 
                :class="'pb-2 d-flex ' + (decodedTx.body.messages.length > 1 ? 'justify-center' : '')"
                v-for="message in decodedTx.body.messages" :key="message.typeUrl">
                <v-chip
                    size="small"
                    color="cyan-lighten-3"
                    label
                    >
                    {{ message.typeUrl.split('.')[message.typeUrl.split('.').length -1]}}
                    </v-chip>
            </v-col>
        </v-row>
    </v-sheet>
</template>
<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { useBlockchainStore } from '@/store/blockchain';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { sha256 } from '@cosmjs/crypto';

const props = defineProps({
    tx: {
        type: Object as PropType<Uint8Array>,
        required: true,
    },
})

const { getCosmosAsset } = useBlockchainStore()

const decodedTx = computed(() => {
    return decodeTxRaw(props.tx)
})
const txHash = computed(() => {
    return Buffer.from(sha256(props.tx)).toString('hex').toUpperCase()
})

</script>