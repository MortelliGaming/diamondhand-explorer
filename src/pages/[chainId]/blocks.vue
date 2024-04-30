<template>
  <chain-content>
    <v-container class="pa-0 text-caption" style="height: 100%;">
      <base-sheet :title="t('blocks.blocks')">
        <div :style="{maxHeight: $vuetify.display.mdAndUp ? '65vh' : '62vh', overflowY: 'scroll'}" class="mt-6">
          <v-row>
            <v-col cols="6" sm="4" md="3" v-for="block in latestChainBlocks" :key="block.header.appHash.toString()" >
              <v-sheet color="blue-grey-darken-4" rounded elevation="12" class="pa-2 fill-height" style="min-height: 96px">
                  <v-row no-gutters class="d-flex flex-row">
                    <v-col class="d-flex justify-center" cols="12"><b>#{{  block.header.height  }}</b></v-col>
                    <v-col cols="6" style="min-height:40px;">{{  getValidator(block.header.proposerAddress)  }}</v-col>
                    <v-col cols="6" class="text-right"> {{ t('block.txs')}}: {{ block.txs.length }}</v-col>
                    <v-col cols="12">{{  moment(block.header.time.toString()).format('DD.MM.YY HH:mm:ss')  }}</v-col>
                    <v-col class="d-flex justify-center" cols="12"><b></b></v-col>
                  </v-row>
              </v-sheet>
            </v-col>
          </v-row>
        </div>
      </base-sheet>
    </v-container>
  </chain-content>
</template>

<script lang="ts" setup>
// External
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n';
import { Buffer } from 'buffer';

// Store
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';

// Components
import ChainContent from '@/components/ChainContent.vue'
import BaseSheet from '@/components/BaseSheet.vue';
import { computed } from 'vue';
import moment from 'moment';

const { t } = useI18n()

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains, latestBlocks } = storeToRefs(useBlockchainStore())
const { validators } = storeToRefs(useValidatorsStore())
const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()

const cosmosChainId = computed(() => {
  return availableChains.value.find(c => c.name === chainIdFromRoute.value)?.keplr?.chainId
})

const latestChainBlocks= computed(() => {
  return latestBlocks.value[cosmosChainId.value || '']
})

function getValidator(proposerAddressBytes: Uint8Array) {
  const hexAddress = '0x' + Buffer.from(proposerAddressBytes).toString('hex')
  return validators.value[cosmosChainId.value || '']?.map(v => getValidatorInfo(cosmosChainId.value || '', v))?.find(v => v.consensusHexAddress.toLowerCase() == hexAddress.toLowerCase())?.description.moniker
}
if(!validators.value[cosmosChainId.value || '']) {
  loadCosmosValidators(cosmosChainId.value || '')
}

</script>
