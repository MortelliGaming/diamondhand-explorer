<template>
    <not-found v-if="!address"/>
    <div v-else>
        <v-container>
            <v-responsive class="mt-3">
                <base-sheet :title="$t('account.addresses')">
                    <v-row no-gutters class="pt-2">
                        <v-col cols="4" class="d-flex align-center">
                            <div>
                                <b>{{ $t('account.address') }}</b>
                            </div>
                        </v-col>
                        <v-col cols="8" class="d-flex align-center justify-end">
                            <copy-box
                                :short="$vuetify.display.xs ? 12 : undefined" :text="address" :show-qr="true">
                            </copy-box>
                        </v-col>
                        <v-col cols="4" class="d-flex align-center pt-2"  v-if="isEVMChain">
                            <div>
                                <b>{{ $t('account.addressHex') }}</b>
                            </div>
                        </v-col>
                        <v-col cols="8" v-if="isEVMChain" class="d-flex align-center justify-end">
                            <copy-box
                                :short="$vuetify.display.xs ? 12 : undefined" :text="hexAddress" :show-qr="true">
                            </copy-box>
                        </v-col>
                    </v-row>
                </base-sheet>
                <div class="pt-2"></div>
                <base-sheet :title="$t('account.balances')">
                    <v-row no-gutters style="max-height: 300px; overflow-y:scroll;">
                        <v-col cols="12" v-for="coin in displayBalances.filter(b => !b.displayDenom.includes('/')).sort((a, b) => (a.interChain === b.interChain ? a.displayDenom.localeCompare(b.displayDenom) : a.interChain ? 1 : -1))" :key="coin.baseDenom">
                            <v-row no-gutters>
                                <v-col cols="6" class="break-word">
                                    {{ coin.displayDenom }}
                                    <span v-if="coin.interChain">
                                        <v-chip label size="xx-small" color="green-lighten-4">
                                            <div class="pl-2 pr-2">
                                                IBC
                                            </div>
                                        </v-chip>
                                    </span>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    {{ coin.displayAmount }}
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" v-for="coin in erc20Balances.filter(b => b.display.amount > 0)" :key="coin.display.denom">
                            <v-row no-gutters>
                                <v-col cols="6">
                                    {{ coin.display.denom }}
                                    <span>
                                        <v-chip label size="xx-small" color="cyan-lighten-4">
                                            <div class="pl-2 pr-2">
                                                ERC20
                                            </div>
                                        </v-chip>
                                    </span>
                                </v-col>
                                <v-col cols="6" class="text-right">
                                    {{ coin.display.amount }}
                                </v-col>
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
import { useCoinsStore } from '@/store/coins';
import { storeToRefs } from 'pinia';
import { fromBech32, toHex, toBech32, fromHex } from '@cosmjs/encoding';
import { erc20Abi } from 'viem';

type DisplayBalance = {
    baseAmount: number
    baseDenom: string
    displayAmount: number
    displayDenom: string
    interChain: boolean
    erc20: boolean
}

const route = useRoute()
const { availableChains, chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { getCoin } = useCoinsStore();

const address = computed(() => {
    const paramAddress = (route.params as {address: string}).address
    if(paramAddress.startsWith('0x')) {
        return toBech32(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.bech32Config.bech32PrefixAccAddr || '', fromHex(paramAddress.replace('0x','')))
    } else {
        return paramAddress
    }
})

const chainConfig = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)
})

const isEVMChain = computed(() => {
    return chainConfig.value?.evm != null ? true : false
})

const hexAddress = computed(() => {
    return '0x' + toHex(fromBech32(address.value || '').data) as `0x${string}`
})

const displayBalances: Ref<DisplayBalance[]> = ref([])

const erc20Balances: Ref<{display: {amount: number, denom: string}}[]> = ref([])

async function loadEVMBalances() {
    const viemClient = chainClients.value[chainIdFromRoute.value]?.viemClient
    for(const erc20Contract of chainConfig.value?.erc20Contracts || []) {
        const balance = await viemClient?.readContract({
            address: erc20Contract as `0x${string}`,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [hexAddress.value],
        })
        const tokenSymbol = await viemClient?.readContract({
            address: erc20Contract as `0x${string}`,
            abi: erc20Abi,
            functionName: 'symbol',
            args: [],
        })
        const tokenDecimals = await viemClient?.readContract({
            address: erc20Contract as `0x${string}`,
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

async function loadCosmosBalances() {
    const allBalances = await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.bank.bank.allBalances(address.value)
    displayBalances.value = []
    for(const balance of allBalances || []) {
        const coinDef = getCoin(balance.denom)
        const baseDenomDef = coinDef?.denom_units
            .find(d => d.denom == balance.denom || d.aliases?.includes(balance.denom))
        const displayDenomDef = coinDef?.denom_units
            .find(d => d.denom == coinDef.display || d.aliases?.includes(coinDef.display))
        if(coinDef && baseDenomDef && displayDenomDef) {
            const baseAmount = Number(balance.amount) / Number(Math.pow(10, baseDenomDef.exponent))
            const baseDenom = baseDenomDef.denom
            const displayAmount = baseAmount  / Number(Math.pow(10, displayDenomDef.exponent))
            const displayDenom = displayDenomDef.denom.toUpperCase()
            const interChain: boolean = balance.denom.startsWith('ibc') || false
            const displayCoin = {
                baseAmount,
                baseDenom,
                displayAmount,
                displayDenom,
                interChain,
                erc20: false
            }
            displayBalances.value.push(displayCoin)
        } else {
            // coin not found in chain registry. check other sources...
            // first denom infos from chain 
            const denomsMetadata = await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.bank.bank.denomsMetadata()
            const denomDef = denomsMetadata?.find(d => d.denomUnits.map(du => du.denom).includes(balance.denom))
            if(denomDef) {
                const baseAmount = Number(balance.amount) / Number(Math.pow(10, denomDef.denomUnits.find(u => u.denom == denomDef.base)!.exponent))
                const baseDenom = denomDef.base
                const displayAmount = baseAmount  / Number(Math.pow(10, denomDef.denomUnits.find(u => u.denom == denomDef.display)!.exponent))
                const displayDenom = denomDef.display.toUpperCase()
                const interChain: boolean = balance.denom.startsWith('ibc') || false
                const displayCoin = {
                    baseAmount,
                    baseDenom,
                    displayAmount,
                    displayDenom,
                    interChain,
                    erc20: false
                }
                displayBalances.value.push(displayCoin)
            } else {

                // if still not found
                // denom info from chainconfig
                const denomsMetadata = availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.currencies
                    .find(c => c.coinDenom == balance.denom || c.coinMinimalDenom == balance.denom)
                
                if(denomsMetadata) {
                    const displayDecimals = denomsMetadata.coinMinimalDenom == balance.denom ? denomsMetadata.coinDecimals : 0
                    const baseDecimals = denomsMetadata.coinMinimalDenom == balance.denom ? 0 : denomsMetadata.coinDecimals
                    
                    const baseAmount = Number(balance.amount) * Math.pow(10, baseDecimals)
                    const baseDenom = denomsMetadata.coinMinimalDenom
                    const displayAmount = baseAmount  / Number(Math.pow(10, displayDecimals))
                    const displayDenom = denomsMetadata.coinDenom.toUpperCase()
                    const interChain: boolean = balance.denom.startsWith('ibc') || false
                    const displayCoin = {
                        baseAmount,
                        baseDenom,
                        displayAmount,
                        displayDenom,
                        interChain,
                        erc20: false
                    }
                    displayBalances.value.push(displayCoin)
                } else {

                    const displayCoin = {
                        baseAmount: Number(balance.amount),
                        baseDenom: balance.denom,
                        displayAmount: Number(balance.amount),
                        displayDenom: balance.denom,
                        interChain: balance.denom.startsWith('ibc'),
                        erc20: false
                    }
                    displayBalances.value.push(displayCoin)
                }

                // if still not found use denom and amount
            }
        }
        //console.log(getCoin(balance.denom))
    }
}

if(isEVMChain.value) {
    loadEVMBalances()
}
loadCosmosBalances()

</script>
<style scoped>
</style>
  