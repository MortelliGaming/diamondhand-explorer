<template>
  <chain-content>
    <v-responsive class="text-caption">
      <v-row class="pt-3">
        <v-col v-if="transactions?.length == 0">
            {{ $t('blocks.noTxInBlock') }}
        </v-col>
        <v-col v-else cols="12" class="pb-2" v-for="tx in transactions" :key="tx.toString()">
          <transaction-header-info-sheet
            @click="$router.push('./transaction/' + calcTxHash(tx))"
            :tx="tx" />
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
import TransactionHeaderInfoSheet from '@/components/tx/TransactionHeaderInfoSheet.vue';
import { sha256 } from '@cosmjs/crypto';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())

const transactions = computed(() => {
  return latestBlocks.value[chainIdFromRoute.value]?.flatMap(b => b.txs)
})

function calcTxHash(tx: Uint8Array) {
  return Buffer.from(sha256(tx)).toString('hex').toUpperCase()
}
</script>
