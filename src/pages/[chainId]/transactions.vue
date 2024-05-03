<template>
  <chain-content>
    <v-responsive class="text-caption">
      <v-row class="pt-3">
        <v-col v-if="transactions?.length == 0">
            {{ $t('blocks.noTxInBlock') }}
        </v-col>
        <v-col v-else cols="12" class="pb-2" v-for="tx in transactions" :key="tx.toString()">
            <v-sheet
                role="button"
                @click="$router.push('./transaction/' + getTxHash(tx))"
                color="grey-darken-3" 
                elevation="12"
                class="pa-2">
                <v-row no-gutters style="max-width: 100%;">
                    <v-col cols="12" sm="3" style="overflow-wrap: break-word;">
                        <div><b>{{ $t('transaction.hash')}}</b></div>
                        <div>{{ getTxHash(tx) }}</div>
                        <div><b>{{ $t('transaction.time')}}</b></div>
                        <div>{{ moment(getTxTime(tx)?.toISOString()).format('DD.MM.YY HH:mm:ss') }}</div>
                        <div><b>{{ $t('transaction.fees')}}</b></div>
                        <div  v-for="fee in decodeTx(tx).authInfo.fee?.amount" :key="fee.denom">
                          {{ Number(fee.amount) / Math.pow(10,18) }} {{ fee.denom.toUpperCase() }}
                        </div>
                    </v-col>
                    <v-col cols="12">
                      <v-row no-gutters>
                        <v-col 
                            class="pt-2 pb-2 d-flex"
                            v-for="message in decodeTx(tx).body.messages" :key="message.typeUrl">
                            <v-chip
                                size="small"
                                color="cyan-lighten-3"
                                label
                                >
                                {{ message.typeUrl.split('.')[message.typeUrl.split('.').length -1]}}
                                </v-chip>
                        </v-col>
                      </v-row>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
    </v-responsive>
  </chain-content>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import ChainContent from '@/components/ChainContent.vue'
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain'
import { computed } from 'vue';
import { decodeTxRaw } from '@cosmjs/proto-signing';
import { sha256 } from '@cosmjs/crypto'
import moment from 'moment';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())

const transactions = computed(() => {
  return latestBlocks.value[chainIdFromRoute.value]?.flatMap(b => b.txs)
})

function decodeTx(transaction: Uint8Array) {
    return decodeTxRaw(transaction)
}

function getTxTime(transaction: Uint8Array) {
  return latestBlocks.value[chainIdFromRoute.value].find(b => b.txs.includes(transaction))?.header.time
}

function getTxHash(tx: Uint8Array) {
    return Buffer.from(sha256(tx)).toString('hex').toUpperCase()
}

</script>
