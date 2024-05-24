<template>
    <base-sheet :title="$t('account.transactions')">
        <v-row
            style="max-height: 350px;overflow-y: scroll; overflow-x: hide;"
            no-gutters>
            <v-col
                class="pt-2 pb-2"
                v-for="tx in paginatedTxs"
                :key="tx.hash"
                cols="12">
                <transaction-header-info-sheet
                    @click="$router.push('../transaction/' + tx.hash)"
                    :tx="tx.tx" />
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="12">
                <v-pagination
                    v-model = pageNum
                    :length="numPages"
                    rounded="circle"
                ></v-pagination>
            </v-col>
        </v-row>
    </base-sheet>
</template>
<script setup lang="ts">
import BaseSheet from '@/components/BaseSheet.vue';
import { useAppStore } from '@/store/app';
import { useBlockchainStore } from '@/store/blockchain';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { SearchTxQuery } from '@cosmjs/stargate';

import TransactionHeaderInfoSheet from '@/components/tx/TransactionHeaderInfoSheet.vue';

const props = defineProps({
    account: {
        type: String,
        required: true
    }
})

const numTxsPerPage = 10
const pageNum = ref(1)
const numPages = computed(() => {
    return Math.ceil(accountTxs.value.length / numTxsPerPage)
})

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { chainClients } = storeToRefs(useBlockchainStore())

const chainClient = ref(chainClients.value[chainIdFromRoute.value])

// load account transactions
const queryReceived: SearchTxQuery = [{
    key: 'transfer.recipient',
    value: props.account
}]
const querySent: SearchTxQuery = [{
    key: 'message.sender',
    value: props.account
}]
const txsSent = await chainClient.value?.cosmosClients?.stargateClient.searchTx(querySent)
const txsReceived = await chainClient.value?.cosmosClients?.stargateClient.searchTx(queryReceived)

const accountTxs = ref((txsSent || []).concat(txsReceived || []).sort((a,b) => b.height - a.height))
const paginatedTxs = computed(() => {
    return accountTxs.value.slice((pageNum.value - 1) * numTxsPerPage, ((pageNum.value - 1) * numTxsPerPage) + numTxsPerPage)
})
</script>