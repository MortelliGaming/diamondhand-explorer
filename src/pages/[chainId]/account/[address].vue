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
                        <v-col cols="12">
                            <v-row no-gutters>
                                <v-col cols="12" class="break-word text-left">
                                    <asset
                                        v-for="balance in balances.sort((a, b) => {
                                            const aHasSlash = a.denom.includes('/');
                                            const bHasSlash = b.denom.includes('/');

                                            if (aHasSlash && !bHasSlash) {
                                                return 1; // Move 'a' after 'b'
                                            } else if (!aHasSlash && bHasSlash) {
                                                return -1; // Move 'a' before 'b'
                                            } else {
                                                return 0; // Keep the original order
                                            }
                                        })"
                                        :key="'balance' + balance.denom"
                                        :balance="balance" />
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
                            <v-row>
                                <v-col cols="4">
                                    <b>{{ $t('validator.validator') }}</b>
                                </v-col>
                                <v-col cols="4" class="text-right d-flex flex-column align-end justify-center pr-2">
                                    <b>{{ $t('validator.delegation') }}</b>
                                </v-col>
                                <v-col cols="4" class="text-right d-flex flex-column align-end justify-center">
                                    <b>{{ $t('validator.rewards') }}</b>
                                </v-col>
                            </v-row>
                            <v-row no-gutters v-for="(delegation, i) in delegations" :key="delegation.delegation.validatorAddress + i">
                                <v-col
                                    cols="4"
                                    class="d-flex align-center">
                                    <validator-header :validator="validators[chainIdFromRoute]?.find(v => v.operatorAddress == delegation.delegation.validatorAddress)" />
                                </v-col>
                                <v-col
                                    cols="4"
                                    class="text-right d-flex flex-column align-end justify-center pr-1">
                                    <asset :balance="delegation.balance" />
                                </v-col>
                                <v-col cols="4" class="text-right d-flex flex-column align-end justify-center" >
                                    <asset :balance="{
                                        amount: addPeriodBeforeEnd(reward.amount),
                                        denom: reward.denom
                                    }" v-for="reward in rewards.find(r => r.validatorAddress == delegation.delegation.validatorAddress)?.reward" :key="delegation.delegation.validatorAddress + reward.denom + 'reward'"></asset>
                                </v-col>
                                <v-divider />
                            </v-row>
                        </v-col>
                    </v-row>
                </base-sheet>
                <div class="pt-2"></div>
                <account-transactions :account="address"/>
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
import Asset from '@/components/Asset.vue';
import ValidatorHeader from '@/components/ValidatorHeader.vue';
import AccountTransactions from './AccountTransactions.vue';

import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';
import { useAppStore } from '@/store/app';
import { useCoinsStore } from '@/store/coins';
import { storeToRefs } from 'pinia';
import { fromBech32, toHex, toBech32, fromHex } from '@cosmjs/encoding';
import { erc20Abi } from 'viem';
import { Delegation, DelegationResponse } from '@/lib/proto/cosmos/staking/v1beta1/staking';
import { DelegationDelegatorReward } from '../../../lib/proto/cosmos/distribution/v1beta1/distribution';
import { Coin } from '@/lib/proto/cosmos/base/v1beta1/coin';

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
const { validators } = storeToRefs(useValidatorsStore())
const { erc20Assets, isLoadingERC20Tokens } = storeToRefs(useCoinsStore());

const address = computed(() => {
    const paramAddress = (route.params as {address: string}).address
    if(paramAddress.startsWith('0x')) {
        return toBech32(availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.bech32Config.bech32PrefixAccAddr || '', fromHex(paramAddress.replace('0x','')))
    } else {
        return paramAddress
    }
})

const hexAddress = computed(() => {
    return '0x' + toHex(fromBech32(address.value || '').data) as `0x${string}`
})

const chainConfig = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)
})

const isEVMChain = computed(() => {
    return chainConfig.value?.evm != null ? true : false
})

const balances: Ref<Coin[]> = ref([])
const delegations: Ref<DelegationResponse[]> = ref([])
const rewards: Ref<DelegationDelegatorReward[]> = ref([])

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
    balances.value = allBalances || [];
}

async function loadDelegations() {
    const res = (await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.staking.staking.delegatorDelegations(address.value))?.delegationResponses
    if(res) {
        delegations.value = res;
    }
    const rewardsResult = (await chainClients.value[chainIdFromRoute.value]?.cosmosClients?.queryClient.extensions.distribution.distribution.delegationTotalRewards(address.value))?.rewards
    if(rewardsResult) {
        rewards.value = rewardsResult
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
// await init();
await new Promise((resolve) => setTimeout(() => resolve(true), 750))
loadCosmosBalances();
await new Promise((resolve) => setTimeout(() => resolve(true), 750))
loadDelegations();
</script>
<style scoped>
</style>
  