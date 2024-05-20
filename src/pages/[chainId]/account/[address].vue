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
                        <v-col cols="12" v-if="isLoadingERC20Tokens[chainIdFromRoute]">
                            <v-progress-linear
                            color="cyan-lighten-2"
                            indeterminate
                            ></v-progress-linear>
                        </v-col>
                        <v-col v-else cols="12" v-for="coin in erc20Balances.filter(b => b.display.amount > 0)" :key="coin.display.denom">
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
                <base-sheet :title="$t('account.delegations')">
                    <v-row no-gutters>
                        <v-col cols="12">
                            <v-row no-gutters v-for="delegation in displayDelegations" :key="delegation.validatorAddress">
                                <v-col
                                    cols="4"
                                    class="d-flex align-center"
                                    v-if="validators[chainIdFromRoute]?.find(v => v.operatorAddress == delegation.validatorAddress)">
                                    {{ getValidatorInfo(chainIdFromRoute, validators[chainIdFromRoute].find(v => v.operatorAddress == delegation.validatorAddress)!)?.description.moniker }}
                                </v-col>
                                <v-col
                                    cols="3"
                                    class="d-flex align-center pr-1">
                                    {{ numeral(delegation.delegation?.balance.displayAmount).format() }} {{ delegation.delegation?.balance.displayDenom }}
                                </v-col>
                                <v-col cols="5">
                                    <v-row no-gutters v-for="reward in delegation.rewards" :key="delegation.validatorAddress + reward.baseDenom">
                                        <v-col cols="8" class="text-right">
                                            {{ numeral(reward.displayAmount).format('0.000000') }}
                                        </v-col>
                                        <v-col cols="4" class="text-right justify-end"> {{ reward.displayDenom }}
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-divider />
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
            </v-responsive>
        </v-container>
    </div>
</template>

<script lang="ts" setup>
import { Ref, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/404.vue'
import BaseSheet from '@/components/BaseSheet.vue';
import CopyBox from '@/components/CopyBox.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { useCoinsStore } from '@/store/coins';
import { storeToRefs } from 'pinia';
import { fromBech32, toHex, toBech32, fromHex } from '@cosmjs/encoding';
import { erc20Abi } from 'viem';
import { Delegation } from '@/lib/proto/cosmos/staking/v1beta1/staking';
import numeral from 'numeral';

type DisplayBalance = {
    baseAmount: number
    baseDenom: string
    displayAmount: number
    displayDenom: string
    interChain: boolean
    erc20: boolean
}

export type DisplayDelegation = {
    validatorAddress: string,
    delegation: {delegation: Delegation, balance: DisplayBalance }|undefined,
    rewards: DisplayBalance[]
}

const route = useRoute()
const { availableChains, chainClients } = storeToRefs(useBlockchainStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { findAsset } = useCoinsStore();
const { getValidatorInfo } = useValidatorsStore()
const { keybaseAvatars, validators } = storeToRefs(useValidatorsStore())
const { erc20Assets, isLoadingERC20Tokens } = storeToRefs(useCoinsStore());

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
const displayDelegations: Ref<DisplayDelegation[]> = ref([])

const erc20Balances: Ref<{display: {amount: number, denom: string}}[]> = ref([])

function addPeriodBeforeEnd(str: string): string {
  const lastEighteenChars = str.slice(-18); // Get the last 18 characters
  const restOfString = str.slice(0, -18); // Get the rest of the string

  return `${restOfString}.${lastEighteenChars}`;
}

async function loadEVMBalances() {
    const viemClient = chainClients.value[chainIdFromRoute.value]?.viemClient
    erc20Balances.value = []
    for(const erc20Asset of erc20Assets.value[chainIdFromRoute.value] || []) {
        const balance = await viemClient?.readContract({
            address: erc20Asset.contract,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [hexAddress.value],
        })
        erc20Balances.value.push({
            display: {
                amount: Number(balance) / Math.pow(10, Number(erc20Asset.decimals)),
                denom: erc20Asset.symbol || ''
            }
        })
    }
}

async function loadCosmosBalances() {
    const allBalances = await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.bank.bank.allBalances(address.value)
    displayBalances.value = []
    for(const balance of allBalances || []) {
        findAsset(balance, chainIdFromRoute.value).then(displayCoin => {
            displayBalances.value.push(displayCoin)
        });
    }
}

async function loadDelegations() {
    const delegations = await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.staking.staking.delegatorDelegations(address.value)
    displayDelegations.value = []
    for(const validatorAddress of delegations?.delegationResponses.flatMap(r => r.delegation.validatorAddress) || []) {
        const validatorDelegation = await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.distribution.distribution.delegationRewards(address.value, validatorAddress)
        
        const coins = []
        let delegationsRes: {delegation: Delegation, balance: DisplayBalance }| undefined = undefined;
        const delegationResponse = delegations?.delegationResponses.find(d => d.delegation.validatorAddress == validatorAddress)
        if(delegationResponse) {
            const displayCoin = await findAsset(delegationResponse?.balance, chainIdFromRoute.value)
            delegationsRes = {
                delegation: delegationResponse?.delegation,
                balance: displayCoin
            }
        }

        for(const balance of validatorDelegation?.rewards || []) {
            balance.amount = addPeriodBeforeEnd(balance.amount);
            const displayCoin = await findAsset(balance, chainIdFromRoute.value)
            coins.push(displayCoin)
        }
        displayDelegations.value.push({
            validatorAddress,
            delegation: delegationsRes,
            rewards: coins,
        })
    }
}

watch(isLoadingERC20Tokens.value, () => {
    if(isLoadingERC20Tokens.value[chainIdFromRoute.value] == false && isEVMChain.value) {
        loadEVMBalances()
    }
})
if(isLoadingERC20Tokens.value[chainIdFromRoute.value] == false && isEVMChain.value) {
    loadEVMBalances()
}
loadCosmosBalances();
loadDelegations();

</script>
<style scoped>
</style>
  