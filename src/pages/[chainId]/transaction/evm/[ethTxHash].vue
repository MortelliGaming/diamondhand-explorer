<template>
    <chain-content>
        <loading v-if="isLoading" />
        <not-found v-else-if="!tx"/>
        <div v-else  style="width: 100%; height: 100%;">
            <tx-info-sheet :tx="tx"/>
            <div class="pt-2"></div>
            <base-sheet :title="$t('transaction.details')">
                <v-row no-gutters>
                    <v-col cols="12" class="break-word">
                        <b>{{ $t('transaction.from') }}</b>
                    </v-col>
                    <v-col cols="12" class="break-word">
                        {{ tx.from }}
                    </v-col>
                    <v-col cols="12" class="break-word">
                        <b>{{ $t('transaction.to') }}</b>
                    </v-col>
                    <v-col cols="12" class="break-word">
                        {{ tx.to }}
                    </v-col>
                    <v-col cols="12" class="break-word" v-if="tx.value > 0">
                        <b>{{ $t('transaction.value') }}</b>
                    </v-col>
                    <v-col cols="12" class="break-word" v-if="tx.value > 0">
                        {{ tx.value }}
                    </v-col>
                    <v-col cols="12" class="break-word" v-if="isSmartcontractInteraction && decodedInput">
                        <b>{{ $t('transaction.input') }}</b>
                    </v-col>
                    <v-col cols="12" class="break-word" v-if="isSmartcontractInteraction && decodedInput">
                        <v-row no-gutters>
                            <v-col cols="12">
                                <b>{{ decodedInput?.function }}</b>
                            </v-col>
                            <v-col cols="12" sm="6" v-for="attribute in decodedInput?.attributes" :key="attribute.name">
                                <b>{{ attribute.name }}: </b>
                                {{ (decodedInput?.function == 'transfer' && attribute.name == 'amount' ?  Number(attribute.value) / Math.pow(10, erc20TokenDecimals) : attribute.value) }} 
                                {{ (decodedInput?.function == 'transfer' && attribute.name == 'amount' ? erc20TokenSymbol : '') }}
                            </v-col>
                        </v-row>
                    </v-col>
                    <v-col cols="12" class="break-word" v-if="isSmartcontractInteraction && !decodedInput">
                        <b>{{ $t('transaction.inputRaw') }}</b>
                    </v-col>
                    <v-col cols="12" class="break-word" v-if="isSmartcontractInteraction && !decodedInput">
                        {{ tx.input }}
                    </v-col>
                </v-row>
            </base-sheet>
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { GetTransactionReturnType, decodeFunctionData, GetBytecodeReturnType, erc20Abi } from 'viem';
import { whatsabi } from "@shazow/whatsabi";

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';
import Loading from '@/components/Loading.vue';
import BaseSheet from '@/components/BaseSheet.vue';

import TxInfoSheet from './TxInfoSheet.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { AnyProvider } from '@shazow/whatsabi/lib.types/types';
import { ABIFunction } from '@shazow/whatsabi/lib.types/abi';

type DecodedTxInput = { 
    function: string
    attributes: { name: string, value: string}[]
}

const route = useRoute()
const { chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const isSmartcontractInteraction = ref(false)
const ethTxHash = computed(() => (route.params as {ethTxHash: `0x${string}`}).ethTxHash)
const tx: Ref<GetTransactionReturnType|undefined> = ref()
const decodedInput: Ref<DecodedTxInput|undefined> = ref()
const erc20TokenSymbol: Ref<string> = ref('')
const erc20TokenDecimals: Ref<number> = ref(18)

const isLoading = ref(false)

async function loadTransaction(hash: `0x${string}`) {
    isLoading.value = true
    chainClients.value[chainIdFromRoute.value]?.viemClient?.getTransaction({
        hash,
    }).then((txResponse) => {
        tx.value = txResponse
        if(tx.value.to) {
            chainClients.value[chainIdFromRoute.value]?.viemClient?.getBytecode({
                address: tx.value.to,
            }).then((bytecode: GetBytecodeReturnType) => {
                if(bytecode) {
                    isSmartcontractInteraction.value = true
                    loadAndDecodeTxInput()
                }
            })
        }
        isLoading.value = false
        return Promise.resolve(true)
    }).catch((err) => {
        console.log(err)
        isLoading.value = false
    })
}

function loadAndDecodeTxInput() {
    whatsabi.autoload(tx.value?.to || '', {
        followProxies: true,
        enableExperimentalMetadata: true,
        provider: chainClients.value[chainIdFromRoute.value]!.viemClient as AnyProvider}).then(async (abi) => {
            console.log(abi)

        let isERC20 = false
        // check if we have a ERC 20 contract
        if(abi.abi.find(i => i.type=='function' && i.name == 'symbol')
            && abi.abi.find(i => i.type=='function' && i.name == 'totalSupply')) {
            console.log('is probalby erc20')
            isERC20 = true
            // load token symbol
            chainClients.value[chainIdFromRoute.value]!.viemClient?.readContract({
                address: tx.value?.to as `0x${string}` || '0x0',
                abi: erc20Abi,
                functionName: 'symbol'
            }).then(tokenSymbolResult => {
                erc20TokenSymbol.value = tokenSymbolResult
            })
            // load token decimal
            chainClients.value[chainIdFromRoute.value]!.viemClient?.readContract({
                address: tx.value?.to as `0x${string}` || '0x0',
                abi: erc20Abi,
                functionName: 'decimals'
            }).then(tokenSymbolResult => {
                erc20TokenDecimals.value = tokenSymbolResult
            })
        }  
        const abiToUse = (isERC20 ? erc20Abi : abi.abi)
        const _decodedInput = decodeFunctionData({
            abi: abiToUse,
            data: tx.value!.input,
        })
        if(_decodedInput && _decodedInput.args && _decodedInput.args.length) {
            const result = {
                function: _decodedInput.functionName,
                attributes: []
            } as { 
                function: string, 
                attributes: { name: string, value: string}[]
            }
            for(let i=0;i<(_decodedInput.args.length || 0);i++) {
                const abiParameter = abiToUse.find(a => a.name == _decodedInput?.functionName) as (ABIFunction|undefined);
                if(abiParameter?.inputs) {
                    result.attributes.push({
                        name: abiParameter.inputs[i]?.name || abiParameter.inputs[i]?.type || '',
                        value: _decodedInput.args[i]?.toString() || ''
                    })
                }
            }
            decodedInput.value = result
        }
    }).catch((err) => {
        console.log('error get contract ABI: ' + err)
    })
}

await loadTransaction(ethTxHash.value)

</script>
<style>
.break-word {
    overflow-wrap: break-word;
}
</style>