<template>
    <base-sheet :title="$t('blocks.block') + ' #' + props.block.block.header.height">
        <v-row no-gutters class="pt-3">
            <v-col cols="12">
                <b>{{ $t('blocks.time') }}</b>
            </v-col>
            <v-col cols="12">
                {{ moment(props.block.block.header.time.toISOString()).format('DD.MM.YY HH:mm:ss') }}
            </v-col>
            <v-col cols="12">
                <b>{{ $t('blocks.proposer') }}</b>
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                <v-avatar v-if="proposer" class="mr-2" size="small">
                    <v-img 
                        v-if="keybaseAvatars[proposer?.description.identity]"
                        :src="keybaseAvatars[proposer?.description.identity]" />
                    <v-icon v-else icon="mdi-account" />
                </v-avatar>
                {{ proposer?.description.moniker }}
            </v-col>
            <v-col cols="12">
                <b>{{ $t('blocks.hash') }}</b>
            </v-col>
            <v-col cols="12" style="overflow-wrap: break-word;">
                {{ blockHash }}
            </v-col>
        </v-row>
    </base-sheet>
</template>
<script lang="ts" setup>
import BaseSheet from '../BaseSheet.vue';
import moment from 'moment';
import { PropType, computed } from 'vue';
import { BlockResponse } from '@cosmjs/tendermint-rpc';

import { useValidatorsStore } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const props = defineProps({
    block: {
        type: Object as PropType<BlockResponse>,
        required: true,
    },
})
const { getValidatorInfo } = useValidatorsStore()
const { validators, keybaseAvatars } = storeToRefs(useValidatorsStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const proposer = computed(() => {
    const hexAddress = '0x' + Buffer.from(props.block.block.header.proposerAddress).toString('hex')
    return validators.value[chainIdFromRoute.value || '']?.find(
                v => getValidatorInfo(chainIdFromRoute.value || '', v)?.consensusHexAddress.toLowerCase() === hexAddress.toLowerCase())
})

const blockHash = computed(() => {
    return props.block ? Buffer.from(props.block.blockId.hash).toString('hex') : ''
})

</script>