<template>
    <not-found v-if="!address"/>
    <div v-else>
        <v-container>
            <v-responsive class="mt-3">
                <base-sheet :title="$t('account.addresses')">
                <v-row no-gutters class="pt-2">
                    <v-col cols="12" sm="6" class="d-flex align-center">
                        <div>
                            <b>{{ $t('account.address') }}</b>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex align-center">
                        <copy-box
                            :short="$vuetify.display.xs" :text="address" :show-qr="true">
                        </copy-box>
                    </v-col>
                    <v-col cols="12" sm="6" class="d-flex align-center pt-2"  v-if="isEVMChain">
                        <div>
                            <b>{{ $t('account.addressHex') }}</b>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="6" v-if="isEVMChain" class="d-flex align-center">
                        <copy-box
                            :short="$vuetify.display.xs" :text="hexAddress" :show-qr="true">
                        </copy-box>
                    </v-col>
                </v-row>
                </base-sheet>
            </v-responsive>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import BaseSheet from '@/components/BaseSheet.vue';
import CopyBox from '@/components/CopyBox.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useProposalsStore } from '@/store/proposals';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { fromBech32, toHex } from '@cosmjs/encoding'

const route = useRoute()
const { loadCosmosProposals } = useProposalsStore()
const { availableChains } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const address = computed(() => (route.params as {address: string}).address)

const isEVMChain = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.evm != null ? true : false
})

const cosmosChainId = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.chainId
})

const hexAddress = computed(() => {
    return '0x' + toHex(fromBech32(address.value || '').data)
})

setTimeout(() => {
    loadCosmosProposals(cosmosChainId.value || '')
}, 500);

</script>
<style scoped>
</style>
  