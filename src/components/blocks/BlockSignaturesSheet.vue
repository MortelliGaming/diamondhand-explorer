<template>
    <base-sheet :title="$t('blocks.blockSignatures')" class="pt-5" style="height:100%;">
        <v-container class="pa-0 mt-2" style="height: 160px; overflow-y: scroll; overflow-x:hidden;">
            <v-row class="pt-3" v-if="nextBlock">
                <v-col cols="12" sm="4" md="3" v-for="signature in nextBlock?.block.lastCommit?.signatures" :key="signature.validatorAddress?.toString()">
                    <block-commit-sheet :signature="signature" />
                </v-col>
            </v-row>
        </v-container>
    </base-sheet>
</template>
<script lang="ts" setup>
import BaseSheet from '../BaseSheet.vue';
import BlockCommitSheet from './BlockCommitSheet.vue';

import { PropType, computed } from 'vue';
import { BlockResponse } from '@cosmjs/tendermint-rpc';
import { useBlocksStore } from '@/store/blocks';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const props = defineProps({
    block: {
        type: Object as PropType<BlockResponse>,
        required: true,
    },
})

const { blocks } = storeToRefs(useBlocksStore())
const { loadCosmosBlock } = useBlocksStore()
const { chainIdFromRoute } = storeToRefs(useAppStore())

const nextBlock = computed(() => {
    return blocks.value[chainIdFromRoute.value || '']?.find(b => b.block.header.height === props.block.block.header.height + 1);
})
loadCosmosBlock(chainIdFromRoute.value, props.block.block.header.height + 1)

</script>