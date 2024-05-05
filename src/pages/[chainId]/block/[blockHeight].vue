<template>
    <chain-content>
        <not-found v-if="!blockHeight"/>
        <div v-else  style="width: 100%; height: 100%;">
            <!-- Show Time Estimate in Future if Height is > latest -->
            <v-container class="mt-3" v-if="blockHeight > latestBlockHeight">
                {{ 'in future' }}
            </v-container>
            <div v-else class="fill-height">
                <div v-if="block">
                    <block-info-sheet :block="block" />
                    <div class="pt-3" style="height: 100%"></div>
                    <block-transactions-sheet :block="block" />  
                    <div class="pt-3" style="height: 100%"></div>
                    <block-signatures-sheet :block="block" />
                </div>
            </div>
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useBlocksStore } from '@/store/blocks';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

import BlockInfoSheet from '@/components/blocks/BlockInfoSheet.vue';
import BlockTransactionsSheet from '@/components/blocks/BlockTransactionsSheet.vue';
import BlockSignaturesSheet from '@/components/blocks/BlockSignaturesSheet.vue';

const route = useRoute()
const { latestBlocks } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { blocks } = storeToRefs(useBlocksStore())
const { validators } = storeToRefs(useValidatorsStore())
const { loadCosmosValidators } = useValidatorsStore()
const { loadCosmosBlock } = useBlocksStore()

const blockHeight = computed(() => parseInt((route.params as {blockHeight: string}).blockHeight))

const latestBlockHeight = computed(() => {
    return latestBlocks.value[chainIdFromRoute.value || '']?.length > 0 ? latestBlocks.value[chainIdFromRoute.value || ''][0]?.header.height : 0;
})
const block = computed(() => {
    return blocks.value[chainIdFromRoute.value || '']?.find(b => b.block.header.height === blockHeight.value);
})

if(!validators.value[chainIdFromRoute.value || '']) {
    await loadCosmosValidators(chainIdFromRoute.value || '');
}

await loadCosmosBlock(chainIdFromRoute.value || '', blockHeight.value)
</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  