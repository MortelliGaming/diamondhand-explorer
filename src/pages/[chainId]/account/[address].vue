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
                                :short="$vuetify.display.xs ? 12 : undefined" :text="address" :show-qr="true">
                            </copy-box>
                        </v-col>
                        <v-col cols="12" sm="6" class="d-flex align-center pt-2"  v-if="isEVMChain">
                            <div>
                                <b>{{ $t('account.addressHex') }}</b>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" v-if="isEVMChain" class="d-flex align-center">
                            <copy-box
                                :short="$vuetify.display.xs ? 12 : undefined" :text="hexAddress" :show-qr="true">
                            </copy-box>
                        </v-col>
                    </v-row>
                </base-sheet>
                <div class="pt-2"></div>
                <base-sheet :title="$t('account.balances')">
                    <v-row no-gutters>
                        <v-col cols="12" v-for="coin in balances" :key="coin.denom">
                            <v-row no-gutters>
                                <v-col cols="3">
                                    {{ getCosmosAsset(BigInt(coin.amount), coin.denom).display.denom }}
                                </v-col>
                                <v-col cols="3" class="text-right">
                                    {{ getCosmosAsset(BigInt(coin.amount), coin.denom).display.amount }}
                                </v-col>
                                <v-col></v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" v-for="coin in erc20Balances" :key="coin.display.denom">
                            
                            <v-row no-gutters>
                                <v-col cols="3">
                                    {{ coin.display.denom }}
                                    <span>
                                        <v-chip label size="xx-small" color="cyan-lighten-4">
                                            <div class="pl-2 pr-2">
                                                ERC20
                                            </div>
                                        </v-chip>
                                    </span>
                                </v-col>
                                <v-col cols="3" class="text-right">
                                    {{ coin.display.amount }}
                                </v-col>
                                <v-col></v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </base-sheet>
                <div class="pt-2"></div>
                <base-sheet :title="$t('account.transactions')">
                    <v-row no-gutters>
                        <v-col cols="12">
                        </v-col>
                    </v-row>
                </base-sheet>
                <div class="pt-2"></div>
                <base-sheet :title="$t('account.delegations')">
                    <v-row no-gutters>
                        <v-col cols="12">
                            
                        </v-col>
                    </v-row>
                </base-sheet>
            </v-responsive>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import BaseSheet from '@/components/BaseSheet.vue';
import CopyBox from '@/components/CopyBox.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { fromBech32, toHex, toBech32, fromHex } from '@cosmjs/encoding';
import { Coin } from '@/lib/proto/cosmos/base/v1beta1/coin';
import { erc20Abi } from 'viem';

const route = useRoute()
const { availableChains, chainClients, latestBlocks } = storeToRefs(useBlockchainStore())
const { getCosmosAsset, getChainCurrencies } = useBlockchainStore()
const { chainIdFromRoute } = storeToRefs(useAppStore())

const address = computed(() => {
    const paramAddress = (route.params as {address: string}).address
    if(paramAddress.startsWith('0x')) {
        return toBech32(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.bech32Config.bech32PrefixAccAddr || '', fromHex(paramAddress.replace('0x','')))
    } else {
        return paramAddress
    }
})


const isEVMChain = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.evm != null ? true : false
})

const hexAddress = computed(() => {
    return '0x' + toHex(fromBech32(address.value || '').data) as `0x${string}`
})

const balances:Ref<Coin[]> = ref([])

console.log(getChainCurrencies(chainIdFromRoute.value))
setTimeout(async () => {
    for(const denom of getChainCurrencies(chainIdFromRoute.value)) {
        chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.bank.bank.balance(address.value, denom?.coinMinimalDenom)
        .then((balance) => {
            balances.value.push(balance)
            console.log(`denom ${balance.denom}: ${balance.amount }`)
        })
        await new Promise((resolve) => setTimeout(() => resolve(true), 500))
    }
},0)

const erc20Balances: Ref<{display: {amount: number, denom: string}}[]> = ref([])

if(isEVMChain.value) {
    const viemClient = chainClients.value[chainIdFromRoute.value]?.viemClient
    let latestBlockNumber = 0
    if(latestBlocks.value[chainIdFromRoute.value]?.length > 0) {
        latestBlockNumber = latestBlocks.value[chainIdFromRoute.value][0]?.header?.height
    } else {
        latestBlockNumber =  Number(await viemClient?.getBlockNumber());
    }
    // find all erc20 contracts
    const erc20ContractAddresses = new Set((await viemClient?.getContractEvents({ 
        abi: erc20Abi,
        eventName: 'Transfer',
        fromBlock: BigInt((Number(latestBlockNumber) - 1000)),
        toBlock: BigInt(Number(latestBlockNumber))
    }))?.flatMap(e => e.address))

    for(const erc20Contract of erc20ContractAddresses) {
        const balance = await viemClient?.readContract({
            address: erc20Contract,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [hexAddress.value],
        })
        const tokenSymbol = await viemClient?.readContract({
            address: erc20Contract,
            abi: erc20Abi,
            functionName: 'symbol',
            args: [],
        })
        const tokenDecimals = await viemClient?.readContract({
            address: erc20Contract,
            abi: erc20Abi,
            functionName: 'decimals',
            args: [],
        })
        erc20Balances.value.push({
            display: {
                amount: Number(balance) / Math.pow(10, Number(tokenDecimals)),
                denom: tokenSymbol || ''
            }
        })
    }
}

</script>
<style scoped>
</style>
  