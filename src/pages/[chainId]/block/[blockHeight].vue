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
                    <base-sheet :title="$t('blocks.block') + ' #' + block.block.header.height">
                        <v-row no-gutters class="pt-3">
                            <v-col cols="12">
                                <b>{{ $t('blocks.time') }}</b>
                            </v-col>
                            <v-col cols="12">
                                {{ moment(block.block.header.time.toISOString()).format('DD.MM.YY HH:mm:ss') }}
                            </v-col>
                            <v-col cols="12">
                                <b>{{ $t('blocks.proposer') }}</b>
                            </v-col>
                            <v-col cols="12" style="overflow-wrap: break-word;">
                                <v-avatar v-if="blockProposer" class="mr-2" size="small">
                                    <v-img 
                                        v-if="keybaseAvatars[blockProposer.description.identity]"
                                        :src="keybaseAvatars[blockProposer.description.identity]" />
                                    <v-icon v-else icon="mdi-account" />
                                </v-avatar>
                                {{ blockProposer?.description.moniker }}
                            </v-col>
                            <v-col cols="12">
                                <b>{{ $t('blocks.hash') }}</b>
                            </v-col>
                            <v-col cols="12" style="overflow-wrap: break-word;">
                                {{ blockHash }}
                            </v-col>
                        </v-row>
                    </base-sheet>
                    <div class="pt-3" style="height: 100%">
                        <base-sheet :title="$t('blocks.transactions')" class="pt-5" style="height:100%;">
                            <v-container class="pa-0 mt-2" style="max-height: 350px; overflow-y: scroll;">
                                <v-row class="pt-3">
                                    <v-col cols="12" sm="6" md="4" class="pb-2" v-for="tx in block.block.txs" :key="tx.toString()">
                                        <v-sheet
                                            color="blue-grey-darken-4" 
                                            elevation="12"
                                            class="pa-2">
                                            <v-row no-gutters>
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
                            </v-container>
                        </base-sheet>
                    </div>
                    <div class="pt-3" style="height: 100%">
                        <base-sheet :title="$t('blocks.blockSignatures')" class="pt-5" style="height:100%;">
                            <v-container class="pa-0 mt-2" style="height: 160px; overflow-y: scroll;">
                                <v-row class="pt-3">
                                    <v-col cols="12" sm="4" md="3" v-for="signature in nextBlock?.block.lastCommit?.signatures" :key="signature.validatorAddress?.toString()">
                                        <v-sheet
                                        color="blue-grey-darken-4" rounded elevation="12" class="pa-2 fill-height">
                                                <v-row no-gutters class="d-flex flex-row">
                                                    <v-col v-if="signature.validatorAddress" cols="12" class="d-flex justify-center">
                                                        <v-avatar v-if="getValidator(signature.validatorAddress)" class="mr-2" size="x-small">
                                                            <v-img 
                                                                v-if="keybaseAvatars[getValidator(signature.validatorAddress)!.description.identity]"
                                                                :src="keybaseAvatars[getValidator(signature.validatorAddress)!.description.identity]" />
                                                            <v-icon v-else icon="mdi-account" />
                                                        </v-avatar>
                                                        {{ getValidator(signature.validatorAddress)?.description.moniker  }}
                                                    </v-col>
                                                    <v-col class="d-flex justify-center pt-1" cols="12"><b>{{ BlockIdFlag[signature.blockIdFlag] }}</b></v-col>
                                                </v-row>
                                            </v-sheet>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </base-sheet>
                    </div>
                </div>
            </div>
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { Buffer } from 'buffer';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import { decodeTxRaw } from '@cosmjs/proto-signing'

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';
import BaseSheet from '@/components/BaseSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useBlocksStore } from '@/store/blocks';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import moment from 'moment';
import { BlockIdFlag } from '@cosmjs/tendermint-rpc';
import { sha256 } from '@cosmjs/crypto';

const route = useRoute()
const { availableChains, latestBlocks } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { blocks } = storeToRefs(useBlocksStore())
const { validators, keybaseAvatars } = storeToRefs(useValidatorsStore())
const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()
const { loadCosmosBlock } = useBlocksStore()

const blockHeight = computed(() => parseInt((route.params as {blockHeight: string}).blockHeight))
const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

const latestBlockHeight = computed(() => {
    return latestBlocks.value[cosmosChainId.value || '']?.length > 0 ? latestBlocks.value[cosmosChainId.value || ''][0]?.header.height : 0;
})
const block = computed(() => {
    return blocks.value[cosmosChainId.value || '']?.find(b => b.block.header.height === blockHeight.value);
})
const nextBlock = computed(() => {
    return blocks.value[cosmosChainId.value || '']?.find(b => b.block.header.height === blockHeight.value + 1);
})

const blockHash = computed(() => {
    return block.value ? Buffer.from(block.value.blockId.hash).toString('hex') : ''
})
const blockProposer = computed(() => {
    if(!block.value) {
        return undefined
    }
    return getValidator(block.value.block.header.proposerAddress)
})

function getValidator(validatorAddress: Uint8Array) {
    const proposerAddressHex = '0x' + Buffer.from(validatorAddress).toString('hex')
    return validators.value[cosmosChainId.value || '']?.find(
            v => getValidatorInfo(cosmosChainId.value || '', v)?.consensusHexAddress.toLowerCase() === proposerAddressHex.toLowerCase())
}

function decodeTx(transaction: Uint8Array) {
    return decodeTxRaw(transaction)
}

function getTxHash(tx: Uint8Array) {
    return Buffer.from(sha256(tx)).toString('hex').toUpperCase()
}

if(!validators.value[cosmosChainId.value || '']) {
    await loadCosmosValidators(cosmosChainId.value || '');
}

await loadCosmosBlock(cosmosChainId.value || '', blockHeight.value)
loadCosmosBlock(cosmosChainId.value || '', blockHeight.value + 1)
</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  