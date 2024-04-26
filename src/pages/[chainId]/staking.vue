<template>
  <v-layout class="fill-height" >
    <v-container v-show="!isCurrentChainLoading">
      <v-row class="pt-3 pl-5 pr-5" v-if="$vuetify.display.mdAndUp">
        <v-col class="text-center">
          <v-alert
            class="d-flex justify-center"
            :text="moment(Number(BigInt(chainData?.stakingParams?.params.unbondingTime.seconds || 0n) * BigInt(1000))).format('HH:mm:ss')"
            title="Unbond"
            :icon="'mdi-clock-outline'"
            type="success"
          ></v-alert>
        </v-col>
        <v-col class="text-center">
          <v-alert
            class="d-flex justify-center"
            :text="Number(BigInt(slashingParams?.slashFractionDowntime || 0n) / BigInt(Math.pow(10, 18) * 100)).toString() + '%'"
            title="Downtime"
            :icon="'mdi-arrow-down'"
            type="warning"
          ></v-alert>
        </v-col>
        <v-col class="text-center">
          <v-alert
            class="d-flex justify-center"
            :text="(BigInt(slashingParams?.slashFractionDoubleSign || 0n) / BigInt(Math.pow(10, 18) * 100)).toString() + '%'"
            title="Double Sign"
            :icon="'mdi-chevron-double-up'"
            type="error"
          ></v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-center pl-6">
          <div class="d-flex">
            <div class="pa-3 text-caption">
              <v-btn size="x-small"
                @click="() => {activeTab = BondStatus[BondStatus.BOND_STATUS_BONDED]}"
                :active="activeTab == BondStatus[BondStatus.BOND_STATUS_BONDED]">active</v-btn>
            </div>
            <div class="pa-3 text-caption">
              <v-btn size="x-small"
                @click="() => {activeTab = BondStatus[BondStatus.BOND_STATUS_UNBONDED]}"
                :active="activeTab == BondStatus[BondStatus.BOND_STATUS_UNBONDED]">inactive</v-btn>
            </div>
            <div class="pa-3 text-caption">
              <v-btn size="x-small"
                @click="() => {activeTab = BondStatus[BondStatus.BOND_STATUS_UNBONDING]}"
                :active="activeTab == BondStatus[BondStatus.BOND_STATUS_UNBONDING]">unbonding</v-btn>
            </div>
            <div class="flex-grow-1"></div>
          </div>
        </v-col>
      </v-row>
    <chain-content class="pl-5 pr-5 fill-height" ref="tableContainer">
        <div>
          <v-data-table 
            v-if="isTableVisible"
            :items-per-page="tableValidators?.length"
            :no-filter="true"
            :items="tableValidators"
            density="compact" 
            sticky 
            class="text-caption" 
            :style="'height:' + (tableContainerHeight - ($vuetify.display.mdAndUp ? 170 : 50 ))+ 'px; width:'+(tableContainerWidth - 40)+'px;'" >
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
            <template v-slot:[`header.action`]="{ column }">
              <div class="d-flex justify-center">
                {{  column.value }}
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
        </div>
      </chain-content>
    </v-container>
    <loading v-show="isCurrentChainLoading" />
  </v-layout>
  <div>
  </div>
</template>

<script lang="ts" setup>
import numeral from 'numeral'
import moment from 'moment'

import { storeToRefs } from 'pinia'
import ChainContent from '@/components/ChainContent.vue'
import Loading from '@/components/Loading.vue'
import { useAppStore } from '@/store/app'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue';
import { VLayout, VRow } from 'vuetify/components';
import { BondStatus } from "cosmjs-types/cosmos/staking/v1beta1/staking";

import { useBlockchainStore } from '@/store/blockchain'
import { useValidatorsStore } from '@/store/validators'

import { QueryParamsResponse as QuerySlashingParamsResponse } from 'cosmjs-types/cosmos/slashing/v1beta1/query';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains, cosmosChaindata } = storeToRefs(useBlockchainStore())
const { getValidatorInfo,loadCosmosValidators } = useValidatorsStore()
const { keybaseAvatars, validators, isLoading } = storeToRefs(useValidatorsStore())

const tableContainer: Ref<typeof ChainContent|undefined> = ref()

const activeTab = ref('BOND_STATUS_BONDED')

const tableContainerHeight = computed(() => {
  return (tableContainer.value?.$el.offsetHeight)
})
const tableContainerWidth = computed(() => {
  return (tableContainer.value?.$el.offsetWidth)
})

const cosmosChainId = computed(() => {
  return availableChains.value.find(c => c.name === chainIdFromRoute.value)?.keplr?.chainId
})
/*
const evmChainId = computed(() => {
  return availableChains.value.find(c => c.name === chainIdFromRoute.value)?.evm?.id
})
*/

const chainData = computed(() => {
  return cosmosChaindata.value[cosmosChainId.value || '']
})


const slashingParams = computed(() => {
  const parsed = QuerySlashingParamsResponse.toJSON(chainData.value?.slashingParams || {} as any) as {
    params: {
      signedBlocksWindow: string, 
      minSignedPerWindow: string, 
      downtimeJailDuration: { 
        seconds: string, nanos: number
      }, 
      slashFractionDoubleSign: string,
      slashFractionDowntime: string
    }
  }
  if(!parsed.params) {
    return {}
  }
  return { 
    signedBlocksWindow: BigInt(parsed.params.signedBlocksWindow), 
    minSignedPerWindow: BigInt(window.atob(parsed.params.minSignedPerWindow)), 
    downtimeJailDuration: { 
      seconds: BigInt(parsed.params.downtimeJailDuration.seconds), 
      nanos: BigInt(parsed.params.downtimeJailDuration.nanos)
    }, 
    slashFractionDoubleSign: BigInt(window.atob(parsed.params.slashFractionDoubleSign)), 
    slashFractionDowntime: BigInt(window.atob(parsed.params.slashFractionDowntime))
  }
})

const tableValidators = computed(() => {
  return validatorsToShow.value?.toSorted((a,b) => Number(BigInt(b?.tokens || 0n) - BigInt(a?.tokens || 0n)))
    .map(v => getValidatorInfo(cosmosChainId.value || '',v))
    .map((v, i) => {
    return {
        rank: i + 1,
        description: [v?.description.identity, v?.description?.moniker, v?.description?.website, v?.operatorAddress],
        votingPower: numeral(((BigInt(v?.tokens || 0n)) / BigInt(Math.pow(10, 18)))).format("0,0"),
        comission: numeral((BigInt((v?.commission.commissionRates.rate || 0n)) / BigInt(Math.pow(10, 18) * 100))).format("0,0") + '%',
        action: [() => { console.log(v?.operatorAddress); /* showDelegateDialog(v?.operatorAddress || '') */}, (v?.jailed)]
    }
  })
})

const validatorsToShow = computed(() => {
  return validators.value[cosmosChainId.value || '']?.filter(v => (BondStatus[v?.status]) === activeTab.value)
})

const isCurrentChainLoading = computed(() => {
  return isLoading.value.includes(chainIdFromRoute.value)
})
// make sure table isnt too big when data is there before mount
const isTableVisible = ref(false)

onMounted(() => {

  setTimeout(() => loadCosmosValidators(cosmosChainId.value || ''), 300);
  isTableVisible.value = true;
})

onUnmounted(() => {
  isTableVisible.value = false;
})

</script>
