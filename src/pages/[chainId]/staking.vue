<template>
<chain-content>
  <v-row style="width: 100%">
    <v-col cols="12" class="text-left pl-6 text-caption">
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-btn class="mr-2" size="x-small"
            @click="() => {activeTab = BondStatus[BondStatus.BOND_STATUS_BONDED]}"
            :active="activeTab == BondStatus[BondStatus.BOND_STATUS_BONDED]">{{(t('validator.bondStatus.BOND_STATUS_BONDED'))}}</v-btn>
          <v-btn class="mr-2" size="x-small"
            @click="() => {activeTab = BondStatus[BondStatus.BOND_STATUS_UNBONDED]}"
            :active="activeTab == BondStatus[BondStatus.BOND_STATUS_UNBONDED]">{{(t('validator.bondStatus.BOND_STATUS_UNBONDED'))}}</v-btn>
          <v-btn class="mr-2" size="x-small"
            @click="() => {activeTab = BondStatus[BondStatus.BOND_STATUS_UNBONDING]}"
            :active="activeTab == BondStatus[BondStatus.BOND_STATUS_UNBONDING]">{{(t('validator.bondStatus.BOND_STATUS_UNBONDING'))}}</v-btn>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
  <v-row class="pa-0 pl-2 pr-2" style="overflow-y: scroll; overflow-x:hidden;">
    <v-col cols="12">
      <v-data-table
        style="max-height: 75vh;"
        v-if="isTableVisible"
        :items-per-page="tableValidators?.length"
        :no-filter="true"
        :items="tableValidators"
        density="compact" 
        sticky 
        class="text-caption fill-height"  >
        <template v-slot:[`item.rank`]="{ value }">
          <v-chip class="text-caption">
            {{ value }}
          </v-chip>
        </template>
        <template v-slot:[`item.description`]="{ value }">
          <div class="d-flex align-center flex-row pt-1 pb-1" >
            <v-avatar size="25px">
              <v-img v-if="value[0]" class="pa-0" :src="keybaseAvatars[value[0]]" />
              <v-icon icon="mdi-help" v-else />
            </v-avatar>
            <div class="pl-2 d-flex flex-column text-left">
              <div class="text-left" role="button" @click="() => $router.push('validator/'+value[3])">
                {{ value[1] }}
              </div>
              <div class="text-left">
                <a :href="value[2]" target="_blank">{{value[2]}}</a>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:[`header.rank`]="{ column }">
          <div class="text-left">
            {{  t('validator.' + column.key) }}
          </div>
        </template>
        <template v-slot:[`header.description`]="{ column }">
          <div class="text-left">
            {{  t('validator.' + column.key) }}
          </div>
        </template>
        <template v-slot:[`header.votingPower`]="{ column }">
          <div class="text-left">
            {{  t('validator.' + column.key) }}
          </div>
        </template>
        <template v-slot:[`header.commission`]="{ column }">
          <div class="text-left">
            {{  t('validator.' + column.key) }}
          </div>
        </template>
        <template v-slot:[`header.action`]="{ column }">
          <div class="text-left">
            {{  t('validator.' + column.key) }}
          </div>
        </template>
        <template v-slot:[`item.action`]="{ value }">
          <div class="d-flex justify-center">
            <v-tooltip v-if="value[1] === false" :text="'delegate'">
              <template v-slot:activator="{ props }">
                <v-btn round size="x-small" v-bind="props" icon="mdi-bank-outline" @click="value[0]" />
              </template>
            </v-tooltip>
            <v-tooltip v-else :text="'jailed'">
              <template v-slot:activator="{ props }">
                <v-btn round size="x-small" v-bind="props" icon="mdi-lock" :color="'error'"/>
              </template>
            </v-tooltip>
          </div>
        </template>
        <template v-slot:bottom>

        </template>
        </v-data-table>
    </v-col>
  </v-row>
  <dh-tx-dialog
    ref="transactionDialog"
    :blockchain-config="chainConfig || undefined" />
</chain-content>
</template>

<script lang="ts" setup>
import numeral from 'numeral'
import { storeToRefs } from 'pinia'
import { computed, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { BondStatus } from "@/lib/proto/cosmos/staking/v1beta1/staking";
import ChainContent from '@/components/ChainContent.vue'

import { useAppStore } from '@/store/app'
import { useValidatorsStore } from '@/store/validators'
import { useBlockchainStore } from '@/store/blockchain'

import { DhTxDialog, WalletName, type TxDialogParams } from 'diamondhand-widget'
//import { WalletName } from 'diamondhand-widget';

const chainConfig = computed(() => 
  availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr
)

const { t } = useI18n()
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains } = storeToRefs(useBlockchainStore())


const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()
const { keybaseAvatars, validators } = storeToRefs(useValidatorsStore())

const activeTab = ref('BOND_STATUS_BONDED')

const transactionDialog = ref<InstanceType<typeof DhTxDialog>>();

const tableValidators = computed(() => {
  return validatorsToShow.value?.toSorted((a,b) => Number(BigInt(b?.tokens || 0n) - BigInt(a?.tokens || 0n)))
    .map(v => getValidatorInfo(chainIdFromRoute.value || '',v))
    .map((v, i) => {
    return {
        rank: i + 1,
        description: [v?.description.identity, v?.description?.moniker, v?.description?.website, v?.operatorAddress],
        votingPower: numeral(((BigInt(v?.tokens || 0n)) / BigInt(Math.pow(10, currentChainStakingCurrency.value?.coinDecimals || 0)))).format("0,0") + ' ' + currentChainStakingCurrency.value?.coinDenom,
        comission: numeral((Number((v?.commission.commissionRates.rate || 0n)) / Number(Math.pow(10, 18)) * 100)).format("0") + '%',
        action: [() => showDelegatedialog(v?.operatorAddress || ''), (v?.jailed)]
    }
  })
})

const validatorsToShow = computed(() => {
  return validators.value[chainIdFromRoute.value || '']?.filter(v => (BondStatus[v?.status]) === activeTab.value)
})

const currentChainStakingCurrency = computed(() => {
    return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr?.stakeCurrency
})
// make sure table isnt too big when data is there before mount
const isTableVisible = ref(false)

function showDelegatedialog(validatorAddress: string) {
  transactionDialog.value?.show('delegate', WalletName.Keplr, {
    validator: validatorAddress,
  } as TxDialogParams)
}

isTableVisible.value = true;
await loadCosmosValidators(chainIdFromRoute.value || '')

onUnmounted(() => {
  // isTableVisible.value = false;
})

</script>
