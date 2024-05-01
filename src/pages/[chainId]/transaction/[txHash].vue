<template>
    <chain-content>
        <not-found v-if="!txHash"/>
        <div v-else  style="width: 100%; height: 100%;">
            <!-- Show Time Estimate in Future if Height is > latest -->
            <base-sheet :title="$t('transaction.details')" style="max-height:266px; overflow-y: scroll;overflow-x: hidden;">
                <v-row no-gutters>
                    <v-col cols="12">
                        <b>{{  $t('transaction.height') }}</b>
                    </v-col>
                    <v-col cols="12" role="button" @click="$router.push('../block/'+tx?.txResponse?.height)">
                        {{  tx?.txResponse?.height }}
                    </v-col>
                    <v-col cols="12" v-if="tx?.txResponse?.info">
                        <b>{{  $t('transaction.info') }}</b>
                    </v-col>
                    <v-col cols="12" v-if="tx?.txResponse?.info">
                        {{  tx?.txResponse?.info }}
                    </v-col>
                    <v-col cols="12">
                        <b>{{  $t('transaction.gas') }}</b>
                    </v-col>
                    <v-col cols="12">
                        {{  tx?.txResponse?.gasUsed }} / {{ tx?.txResponse?.gasWanted }}
                    </v-col>
                    <v-col cols="12">
                        <b>{{  $t('transaction.timestamp') }}</b>
                    </v-col>
                    <v-col cols="12">
                        {{  moment(tx?.txResponse?.timestamp).format('DD.YY.MM HH:mm:ss') }}
                    </v-col>
                    <v-col cols="12" v-if="(tx?.tx?.authInfo?.signerInfos || []).length > 0">
                        <b>{{  $t('transaction.signers') }}</b>
                    </v-col>
                    <v-col cols="12" role="button" v-for="signer in tx?.tx?.authInfo?.signerInfos" :key="signer.publicKey?.toString()">
                        <div  v-if="signer.publicKey">
                            <div>{{ getAddressForPublicKey(signer.publicKey)?.bech32Address }} / {{ getAddressForPublicKey(signer.publicKey)?.ethAddress }}</div>
                        </div>
                    </v-col>
                    <v-col cols="12">
                        <b>{{  $t('transaction.hash') }}</b>
                    </v-col>
                    <v-col cols="12" style="overflow-wrap: break-word;">
                        {{  txHash }}
                    </v-col>
                    <v-col cols="12" v-if="txEthHash">
                        <b>{{  $t('transaction.hashEth') }}</b>
                    </v-col>
                    <v-col cols="12" v-if="txEthHash" style="overflow-wrap: break-word;">
                        {{  txEthHash }}
                    </v-col>
                </v-row>
            </base-sheet>
            <div class="pt-3"></div>
            <base-sheet :title="$t('transaction.messages')" style="max-height:350px; overflow-y: scroll;overflow-x: hidden;">
                <v-row>
                    <v-col cols="12" v-for="msg in decodedMessages" :key="msg.toString" style="overflow-wrap: break-word;">
                        {{ msg.data ? msg.data.typeUrl + ',' + JSON.stringify(decodeMessage(msg.data)) : msg }}
                        <div v-if="msg.data && decodeMessage(msg.data).to">
                            {{ decodeMessage(msg.data).to }}
                            {{ isAddress(decodeMessage(msg.data).to).toString() }}
                            {{
                                ethers.Transaction.from(decodeMessage(msg.data)).unsignedHash
                            }}
                        </div>
                        <div v-if="msg.to">
                            {{
                                ethers.Transaction.from(decodeMessage(msg.data)).hash
                            }}
                            {{
                                ethers.hashMessage(ethers.Transaction.from(msg).serialized)
                            }}
                            {{ msg.to }}
                            {{ isAddress(msg.to).toString() }}
                        </div>
                    </v-col>
                </v-row>
            </base-sheet>
        </div>
    </chain-content>
</template>

<script lang="ts" setup>
import { Buffer } from 'buffer';
import { Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { createPublicClient, http, isAddress } from 'viem';
import { ethers } from 'ethers';
import { computeAddress } from '@ethersproject/transactions';
import secp256k1 from 'secp256k1';

import NotFound from '@/components/404.vue'
import ChainContent from '@/components/ChainContent.vue';
import BaseSheet from '@/components/BaseSheet.vue';

import { DynamicFeeTx, LegacyTx } from '@/lib/proto/ethermint/evm/v1/tx';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

import { protoRegistry } from '@/lib/protoRegistry';
import moment from 'moment';
import { GetTxResponse } from '@/lib/proto/cosmos/tx/v1beta1/service';
import { toBech32} from '@cosmjs/encoding';

const route = useRoute()
const { availableChains, cosmosClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const messageMapper = {
    '/ethermint.evm.v1.LegacyTx': LegacyTx,
    '/ethermint.evm.v1.DynamicFeeTx': DynamicFeeTx
} as Record<string,any>

const txHash = computed(() => (route.params as {txHash: string}).txHash)
const txEthHash = computed(() => {
    return tx.value?.txResponse?.logs?.map(l => l.events.map(e => e.attributes.find(a => a.key === 'ethereumTxHash'))?.filter(e => e))[0][0]?.value
})

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

console.log(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.evm?.rpcUrls['default'].http[0])
const viemClient =  createPublicClient({
    transport: http(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.evm?.rpcUrls['default'].http[0]),
})
viemClient.getBytecode({
    address: '0x7F4FdA70b48AC483Edcd0aA5D20cFD0C1e9840e3'
}).then((res) => {
    console.log(res)
})



const tx: Ref<GetTxResponse|undefined> = ref()

const decodedMessages = computed(() => {
    try {
        console.log(tx.value?.tx?.body)
        return tx.value?.tx?.body?.messages.map(msg => protoRegistry.decode(msg))
    } catch {
        return tx.value?.tx?.body?.messages
    }
})

function decodeMessage(message: {typeUrl: string, value: Uint8Array}) {
    if(messageMapper[message.typeUrl]) {
        return messageMapper[message.typeUrl].decode(message.value);
    }
    return message.value
}

function _u8aToHexString(u8arr: Uint8Array): string {
  return "0x" + Buffer.from(u8arr).toString("hex");
}

function ethPublicKeyToAddress(inputValue: string) {
    //Validation: Must be hexadecimal, with length of 40, 66, or 130
    if (!/^[0-9A-Fa-f]+$/.test(inputValue)) {
        return { error: "(not a valid input, expected hexadecimal)" };
    }
    const isEthAddress = inputValue.length === 40;
    const isPublicKey = [66, 130].includes(inputValue.length);
    if (isEthAddress) {
        return { success: true, ethAddress: "0x" + inputValue };
    } else if (isPublicKey) {
        try {
        //Re-encode public key
        const publicKeyBytes = Buffer.from(inputValue, "hex");
        const publicKeyHexUncompressed = _u8aToHexString(
            secp256k1.publicKeyConvert(publicKeyBytes, false)
        );
        const publicKeyHexCompressed = _u8aToHexString(
            secp256k1.publicKeyConvert(publicKeyBytes)
        );
        const ethAddress = computeAddress(publicKeyHexCompressed);
        const bech32Address = toBech32('mx', Buffer.from(ethAddress.replace('0x',''), 'hex'))
        
        return {
            success: true,
            publicKeyHexUncompressed,
            publicKeyHexCompressed,
            ethAddress,
            bech32Address
        };
        } catch (error) {
            console.error(error);
            return { error: "(not a valid input, invalid public key)" };
        }
    }
    return {
        error:
        "not a valid input, incorrect length (expected 40, 66, or 130 hexadecimal characters)"
    };
}

function getAddressForPublicKey(_pubKey: {typeUrl: string, value: Uint8Array} ) {
    try {
        const decodedPublickey = protoRegistry.decode(_pubKey).key
        const hexKey = Buffer.from(decodedPublickey, 'base64').toString('hex')
        const addresses = ethPublicKeyToAddress(hexKey)
        return addresses;
    } catch(err) {
        console.log(err)
    } 
    return undefined
}

function loadTransaction() {
    cosmosClients.value[cosmosChainId.value||'']?.queryClient.extensions.tx.tx.getTx(txHash.value).then(txResponse => {
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
  