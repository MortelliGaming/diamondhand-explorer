<template>
    <chain-content>
        <loading v-if="isLoading" />
        <not-found v-else-if="!tx"/>
        <div v-else  style="width: 100%; height: 100%;">
            <base-sheet :title="tx.hash">
                <v-row no-gutters>
                    <v-col cols="12" class="break-word">
                        {{ tx }}
                    </v-col>
                </v-row>
            </base-sheet>
            <!-- Show Time Estimate in Future if Height is > latest -->
            <!-- 
            <tx-info-sheet 
                v-if="tx"
                :tx="tx" />
            <div class="pt-3"></div>
            <tx-messages-sheet-cosmos 
                style="height: auto !important;"
                v-if="tx?.tx?.body?.messages && !txEthHash"
                :tx="tx" />
            <tx-messages-sheet-ethermint 
                style="height: auto !important;"
                v-if="tx?.tx?.body?.messages && txEthHash?.startsWith('0x')"
                :tx="tx" />
            -->
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { GetTransactionReturnType } from 'viem';

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';
import Loading from '@/components/Loading.vue';
import BaseSheet from '@/components/BaseSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const route = useRoute()
const { chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const ethTxHash = computed(() => (route.params as {ethTxHash: `0x${string}`}).ethTxHash)
const tx: Ref<GetTransactionReturnType|undefined> = ref()

const isLoading = ref(false)
async function loadTransaction(hash: `0x${string}`) {
    isLoading.value = true
    chainClients.value[chainIdFromRoute.value]?.viemClient?.getTransaction({
        hash,
    }).then((txResponse) => {
        tx.value = txResponse
        isLoading.value = false
        return Promise.resolve(true)
    }).catch(() => {
        isLoading.value = false
    })
}

await loadTransaction(ethTxHash.value)

</script>
<style>
.break-word {
    overflow-wrap: break-word;
}
</style>
  