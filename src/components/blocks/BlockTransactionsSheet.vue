<template>
    <base-sheet :title="$t('blocks.transactions')" class="pt-5" style="height:100%;">
        <v-container class="pa-0 mt-2" :style="'max-height: 350px; overflow-y: '+(props.block.block.txs.length == 0 ? 'hidden;' : 'scroll;'+ 'overflow-x: hidden;')">
            <v-row class="pt-3">
                <v-col v-if="props.block.block.txs.length == 0">
                    {{ $t('blocks.noTxInBlock') }}
                </v-col>
                <v-col cols="12" sm="6" md="4" class="pb-2" v-for="tx in props.block.block.txs" :key="tx.toString()">
                    <transaction-header-info-sheet
                        :tx="tx" 
                        @click="$router.push('../transaction/' + calcTxHash(tx))"
                    />
                </v-col>
            </v-row>
        </v-container>
    </base-sheet>
</template>
<script lang="ts" setup>
import BaseSheet from '../BaseSheet.vue';
import TransactionHeaderInfoSheet from '../tx/TransactionHeaderInfoSheet.vue';

import { PropType } from 'vue';
import { BlockResponse } from '@cosmjs/tendermint-rpc';
import { sha256 } from '@cosmjs/crypto';

const props = defineProps({
    block: {
        type: Object as PropType<BlockResponse>,
        required: true,
    },
})

function calcTxHash(tx: Uint8Array) {
  return Buffer.from(sha256(tx)).toString('hex').toUpperCase()
}
</script>