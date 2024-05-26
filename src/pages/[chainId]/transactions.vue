<template>
  <chain-content>
    <v-responsive class="text-caption">
      <v-row class="pt-3">
        <v-col v-if="transactions?.length == 0">
            {{ $t('blocks.noTxInBlock') }}
        </v-col>
        <v-col v-else cols="12" class="pb-2" v-for="tx in paginatedTxs" :key="tx.toString()">
          <transaction-header-info-sheet
            @click="$router.push('./transaction/' + calcTxHash(tx))"
            :tx="tx" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
              v-model="pageNum"
              :length="numPages"
              rounded="circle"
          ></v-pagination>
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
import { computed, ref } from 'vue';
import TransactionHeaderInfoSheet from '@/components/tx/TransactionHeaderInfoSheet.vue';
import { sha256 } from '@cosmjs/crypto';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())

const numTxsPerPage = 12
const pageNum = ref(1)
const numPages = computed(() => {
    return Math.ceil(transactions.value?.length / numTxsPerPage)
})

const transactions = computed(() => {
  return latestBlocks.value[chainIdFromRoute.value]?.flatMap(b => b.txs)
})

const paginatedTxs = computed(() => {
    return transactions.value?.slice((pageNum.value - 1) * numTxsPerPage, ((pageNum.value - 1) * numTxsPerPage) + numTxsPerPage)
})

function calcTxHash(tx: Uint8Array) {
  return Buffer.from(sha256(tx)).toString('hex').toUpperCase()
}
</script>
