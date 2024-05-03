<template>
    <chain-content>
        <not-found v-if="!txHash"/>
        <div v-else  style="width: 100%; height: 100%;">
            <!-- Show Time Estimate in Future if Height is > latest -->
            <tx-info-sheet 
                v-if="tx"
                :tx="tx" />
            <div class="pt-3"></div>
            <tx-messages-sheet-cosmos
                style="height: auto !important;"
                v-if="tx?.tx?.body?.messages && !txEthHash"
                :tx="tx" />
            <tx-messages-sheet-ethereum 
                style="height: auto !important;"
                v-if="tx?.tx?.body?.messages && txEthHash"
                :tx="tx" />
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { type Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';

import TxInfoSheet from './TxInfoSheet.vue';
import TxMessagesSheetCosmos from './TxMessagesSheetCosmos.vue';
import TxMessagesSheetEthereum from './TxMessagesSheetEthereum.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

import { GetTxResponse } from '@/lib/proto/cosmos/tx/v1beta1/service';

const route = useRoute()
const { chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const txHash = computed(() => (route.params as {txHash: string}).txHash)
const txEthHash = computed(() => {
    const ethTxEvent = tx.value?.txResponse?.logs?.map(l => l.events.map(e => e.attributes.find(a => a.key === 'ethereumTxHash'))?.filter(e => e))
    return (ethTxEvent && ethTxEvent?.length > 0) ? ethTxEvent[0][0]?.value : undefined
})

const tx: Ref<GetTxResponse|undefined> = ref()

function loadTransaction() {
    chainClients.value[chainIdFromRoute.value||'']?.cosmosClients?.queryClient.extensions.tx.tx.getTx(txHash.value).then(txResponse => {
        tx.value= txResponse
    })
}

await loadTransaction()

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  