<template>
  <v-layout class="fill-height" >
    <v-container>
      <v-row class="pt-3 pl-5 pr-5" v-if="$vuetify.display.mdAndUp">
        <v-col class="text-center">
          <v-alert
            class="d-flex justify-center"
            :text="moment(parseInt(chainData?.stakingParams?.params.unbondingTime.seconds.toString() || '0') * 1000).format('HH:mm:ss')"
            title="Unbond"
            :icon="'mdi-clock-outline'"
            type="success"
          ></v-alert>
        </v-col>
        <v-col class="text-center">
          <v-alert
            class="d-flex justify-center"
            :text="(parseInt(slashingParams?.slashFractionDowntime?.toString() || '') / Math.pow(10, 18) * 100).toString() + '%'"
            title="Downtime"
            :icon="'mdi-arrow-down'"
            type="warning"
          ></v-alert>
        </v-col>
        <v-col class="text-center">
          <v-alert
            class="d-flex justify-center"
            :text="(parseInt(slashingParams?.slashFractionDoubleSign?.toString() || '') / Math.pow(10, 18) * 100).toString() + '%'"
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
                @click="() => {activeTab = BondStatus[BondStatus.BONDED]}"
                :active="activeTab == BondStatus[BondStatus.BONDED]">active</v-btn>
            </div>
            <div class="pa-3 text-caption">
              <v-btn size="x-small"
                @click="() => {activeTab = BondStatus[BondStatus.UNBONDED]}"
                :active="activeTab == BondStatus[BondStatus.UNBONDED]">inactive</v-btn>
            </div>
            <div class="pa-3 text-caption">
              <v-btn size="x-small"
                @click="() => {activeTab = BondStatus[BondStatus.UNBONDING]}"
                :active="activeTab == BondStatus[BondStatus.UNBONDING]">unbonding</v-btn>
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
  </v-layout>
  <div>
  <dh-tx-dialog
    ref="txDialog"
    :blockchain-config="bConfig" />
  </div>
</template>

<script lang="ts" setup>
import numeral from 'numeral'
import moment from 'moment'

import { storeToRefs } from 'pinia'
import ChainContent from '@/components/ChainContent.vue'
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain'
import { Ref, computed, onMounted, onUnmounted, ref } from 'vue';
import { VLayout, VRow } from 'vuetify/components';
import { BondStatus } from '@evmos/proto/dist/proto/cosmos/staking/staking';

import { DhTxDialog } from 'dh-widget';
import { QueryParamsResponse as QuerySlashingParamsResponse } from 'cosmjs-types/cosmos/slashing/v1beta1/query';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains, keybaseAvatars, cosmosChaindata } = storeToRefs(useBlockchainStore())
const { getValidatorInfo } = useBlockchainStore()

const tableContainer: Ref<typeof ChainContent|undefined> = ref()
const txDialog: Ref<InstanceType<typeof DhTxDialog>|undefined> = ref()

const activeTab = ref('BONDED')

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

const validators = computed(() => {
  return getValidatorInfo(cosmosChainId.value || '')
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
    signedBlocksWindow: parseInt(parsed.params.signedBlocksWindow), 
    minSignedPerWindow: BigInt(window.atob(parsed.params.minSignedPerWindow)), 
    downtimeJailDuration: { 
      seconds: parseInt(parsed.params.downtimeJailDuration.seconds), 
      nanos: parsed.params.downtimeJailDuration.nanos
    }, 
    slashFractionDoubleSign: BigInt(window.atob(parsed.params.slashFractionDoubleSign)), 
    slashFractionDowntime: BigInt(window.atob(parsed.params.slashFractionDowntime))
  }
})

const tableValidators = computed(() => {
  return validatorsToShow.value?.toSorted((a,b) => (parseInt(b?.tokens || '0') - parseInt(a?.tokens || '0')))
    .map((v, i) => {
    return {
        rank: i + 1,
        description: [v?.description.identity, v?.description?.moniker, v?.description?.website, v?.operatorAddress],
        votingPower: numeral(((parseInt(v?.tokens || '0')) / Math.pow(10, 18))).format("0,0"),
        comission: numeral((parseInt(v?.commission.commissionRates.rate || '0')) / Math.pow(10, 18) * 100).format("0,0") + '%',
        action: [() => { console.log(v?.operatorAddress); showDelegateDialog(v?.operatorAddress || '')}, (v?.jailed)]
    }
  })
})

const validatorsToShow = computed(() => {
  return validators.value?.filter(v => (v?.status || '' ) === activeTab.value)
})

// make sure table isnt too big when data is there before mount
const isTableVisible = ref(false)

onMounted(() => {
  isTableVisible.value = true;
})
onUnmounted(() => {
  isTableVisible.value = false;
})

const bConfig: Ref<any> = ref({
  "chain_name": "crossfi testnet",
  "coingecko": "crossfi",
  "chainId": "crossfi-evm-testnet-1",
  "api": ["https://crossfi-testnet-api.itrocket.net:443", "https://crossfitestnetapi.diamondhand.capital"],
  "rpc": ["https://crossfi-testnet-rpc.itrocket.net:443", "https://crossfitestnetrpc.diamondhand.capital"],
  "jsonRpc": [],
  "snapshot_provider": "",
  "sdk_version": "0.46.1",
  "coin_type": "60",
  "min_tx_fee": "800",
  "addr_prefix": "mx",
  "logo": "/logos/crossfi.jpeg",
  "theme_color": "#812cd6",
  "keplr_features": ["eth-address-gen", "eth-key-sign", "ibc-transfer", "ibc-go"],
  "has_evm_features": true,
  "assets": [{
      "base": "xfi",
      "symbol": "XFI",
      "exponent": "18",
      "coingecko_id": "xfi", 
      "logo": "/logos/xfi.jpeg",
      "isFeeAsset": true,
      "isStakingAsset": false,
  },{
      "base": "mpx",
      "symbol": "MPX",
      "exponent": "18",
      "coingecko_id": "xfi_mpx", 
      "logo": "/logos/xfi.jpeg",
      "isFeeAsset": true,
      "isStakingAsset": true,
  },{
      "base": "xft",
      "symbol": "XFT",
      "exponent": "18",
      "coingecko_id": "xft", 
      "logo": "/logos/xfi.jpeg",
      "isFeeAsset": false,
      "isStakingAsset": false,
  }]
})

function showDelegateDialog(validatorAddress: string) {
  txDialog.value?.show('delegate', {
    validator: validatorAddress,
  } as any)
}


</script>
