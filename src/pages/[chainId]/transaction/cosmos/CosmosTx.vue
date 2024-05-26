<template>
    <chain-content class="pl-0 pr-0">
        <not-found v-if="!txHash"/>
        <div v-else  style="width: 100%; height: 100%;">
            <!-- Show Time Estimate in Future if Height is > latest -->
            <tx-info-sheet 
                v-if="tx"
                :tx="tx" />
            <div class="pt-3"></div>
            <evm-tx-content
                class="pa-0"
                :txHash="txEthHash"
                v-if="txEthHash && tx?.tx?.body?.messages.map(m => m.typeUrl).includes(MsgEthereumTx.typeUrl)" />
            <tx-messages-sheet-cosmos
                style="height: auto !important;"
                v-else-if="tx?.tx?.body?.messages && !txEthHash"
                :tx="tx" />
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { type Ref, computed, ref } from 'vue';

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';

import TxInfoSheet from './TxInfoSheet.vue';
import EvmTxContent from '../evm/EvmTxContent.vue';
import TxMessagesSheetCosmos from './TxMessagesSheetCosmos.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

import { GetTxResponse } from '@/lib/proto/cosmos/tx/v1beta1/service';
import { MsgEthereumTx } from '@/lib/proto/ethermint/evm/v1/tx';

const { chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const props = defineProps({
    txHash: {
        type: String,
        required: true,
    }
})

const txHash = computed(() => props.txHash)

const txEthHash = computed(() => {
    const ethTxEvent = tx.value?.txResponse?.logs?.map(l => l.events.map(e => e.attributes.find(a => a.key === 'ethereumTxHash'))?.filter(e => e))
    return (ethTxEvent && ethTxEvent?.length > 0) ? ethTxEvent[0][0]?.value : undefined
})

const tx: Ref<GetTxResponse|undefined> = ref()

function loadTransaction() {
    chainClients.value[chainIdFromRoute.value||'']?.cosmosClients?.queryClient.extensions.tx.tx.getTx(props.txHash).then(txResponse => {
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
  