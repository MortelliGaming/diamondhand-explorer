<template>
  <chain-content>
    <v-responsive>
      <v-row class="pt-3">
        <v-col v-if="transactions?.length == 0">
            {{ $t('blocks.noTxInBlock') }}
        </v-col>
        <v-col cols="12" sm="6" md="4" class="pb-2" v-for="tx in transactions" :key="tx.toString()">
            <v-sheet
                role="button"
                @click="$router.push('./transaction/' + getTxHash(tx))"
                color="blue-grey-darken-4" 
                elevation="12"
                class="pa-2">
                <v-row no-gutters style="max-width: 100%;">
                    <v-col cols="12" style="overflow-wrap: break-word;">
                        <b>{{ $t('blocks.hash')}}</b>
                    </v-col>
                    <v-col cols="12" style="overflow-wrap: break-word;">
                        {{ getTxHash(tx) }}
                    </v-col>
                    <v-col cols="12" style="overflow-wrap: break-word;">
                        <b>{{ $t('blocks.fees')}}</b>
                    </v-col>
                    <v-col cols="12" style="overflow-wrap: break-word;" v-for="fee in decodeTx(tx).authInfo.fee?.amount" :key="fee.denom">
                        {{ Number(fee.amount) / Math.pow(10,18) }} {{ fee.denom.toUpperCase() }}
                    </v-col>
                    <v-col cols="12" style="overflow-wrap: break-word;">
                        <b>{{ $t('blocks.messages')}}</b>
                    </v-col>
                    <v-col 
                        :class="'pb-2 d-flex ' + (decodeTx(tx).body.messages.length > 1 ? 'justify-center' : '')"
                        v-for="message in decodeTx(tx).body.messages" :key="message.typeUrl">
                        <v-chip
                            size="small"
                            color="orange-darken-4"
                            label
                            >
                            {{ message.typeUrl.split('.')[message.typeUrl.split('.').length -1]}}
                            </v-chip>
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

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())

const transactions = computed(() => {
  return latestBlocks.value[chainIdFromRoute.value]?.flatMap(b => b.txs)
})

function decodeTx(transaction: Uint8Array) {
    return decodeTxRaw(transaction)
}

function getTxHash(tx: Uint8Array) {
    return Buffer.from(sha256(tx)).toString('hex').toUpperCase()
}

</script>
