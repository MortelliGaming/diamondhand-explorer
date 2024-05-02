<template>
    <base-sheet :title="$t('transaction.details')" style="max-height:165px; overflow-y: scroll;overflow-x: hidden;">
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
            <v-col cols="12" role="button" v-for="signer in signers" :key="signer.bech32">
                <div>
                    {{ signer.bech32 }} 
                </div>
                <div v-if="chainConfig?.evm" class="pl-2">
                    {{ signer.evm }} 
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
</template>

<script lang="ts" setup>
import { PropType, computed } from 'vue';
import BaseSheet from '@/components/BaseSheet.vue';
import moment from 'moment';
import { GetTxResponse } from '@/lib/proto/cosmos/tx/v1beta1/service';
import { toBech32} from '@cosmjs/encoding';

import { getAddressForPublicKey } from '@/lib/keyhelper';
import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const props = defineProps({
    tx: {
        type: Object as PropType<GetTxResponse>,
        required: true
    }
})
const chainConfig = computed(() => {
    return availableChains.value.find(c => c.name === chainIdFromRoute.value)
})
const txHash = computed(() => {
    return props.tx?.txResponse?.txhash
})
const txEthHash = computed(() => {
    return props.tx?.txResponse?.logs?.map(l => l.events.map(e => e.attributes.find(a => a.key === 'ethereumTxHash'))?.filter(e => e))[0][0]?.value
})

const signers = computed(() => {
    return props.tx.tx?.authInfo?.signerInfos.map(signer => {
        if(signer.publicKey) {
            const addresses = getAddressForPublicKey(signer.publicKey)
            if(addresses.rawAddress && addresses.hex) {
                return {
                    bech32: toBech32(chainConfig.value?.keplr?.bech32Config.bech32PrefixAccAddr || '', addresses.rawAddress),
                    evm: addresses.hex
                }
            }
        } 
        return {
            bech32: '',
            evm: ''
        }
    })
})

</script>
<style>
.break-string {
    overflow-wrap: break-word;
}
</style>
  