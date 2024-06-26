<template>
  <chain-content>
    <base-sheet :title="t('blocks.blocks')"  style="max-height: 80vh; overflow-y: scroll; width: 100%;">
      <v-row  style="overflow-y: scroll; overflow-x:hidden;">
        <transition-group name="list">
          <v-col cols="6" sm="4" md="3" v-for="block in paginatedBlocks" :key="block.header.appHash.toString()" >
            <v-sheet
              @click="$router.push('./block/'+block.header.height)"
              role="button"
              color="grey-darken-3" 
              rounded 
              elevation="12" 
              class="pa-2 fill-height" 
              style="min-height: 96px;">
                <v-row no-gutters class="d-flex flex-row">
                  <v-col cols="12"  class="d-flex flex-row">
                    <div class="d-flex justify-center" >
                      <b>#{{  block.header.height  }}</b>
                    </div>
                    <div class="text-right d-flex flex-grow-1 justify-end">
                      <v-chip size="x-small" color="success">
                        {{ block.txs.length }}
                      </v-chip>
                    </div>
                  </v-col>
                  <v-col cols="12" class="d-flex align-center justify-center" style="min-height:40px;">
                    <v-avatar v-if="getValidator(block.header.proposerAddress)" class="mr-2" size="x-small">
                          <v-img 
                              v-if="keybaseAvatars[getValidator(block.header.proposerAddress)!.description.identity]"
                              :src="keybaseAvatars[getValidator(block.header.proposerAddress)!.description.identity]" />
                          <v-icon v-else icon="mdi-account" />
                      </v-avatar>
                  </v-col>
                  <v-col cols="12" class="text-center">
                      <b>{{ getValidator(block.header.proposerAddress)?.description.moniker  }}</b>
                  </v-col>
                  <v-col cols="12" class="text-center">{{  moment(block.header.time.toISOString()).format('DD.MM.YY HH:mm:ss')  }}</v-col>
                </v-row>
            </v-sheet>
          </v-col>
        </transition-group>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
              v-model="pageNum"
              :length="numPages"
              rounded="circle"
          ></v-pagination>
        </v-col>
      </v-row>
      </base-sheet>
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
import { computed, ref } from 'vue';
import moment from 'moment';

const { t } = useI18n()

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())
const { validators, keybaseAvatars } = storeToRefs(useValidatorsStore())
const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()


const numBlockPerPage = 12
const pageNum = ref(1)
const numPages = computed(() => {
    return Math.ceil(latestChainBlocks.value.length / numBlockPerPage)
})

const latestChainBlocks= computed(() => {
  return latestBlocks.value[chainIdFromRoute.value || '']
})

const paginatedBlocks = computed(() => {
    return latestChainBlocks.value.slice((pageNum.value - 1) * numBlockPerPage, ((pageNum.value - 1) * numBlockPerPage) + numBlockPerPage)
})

function getValidator(proposerAddressBytes: Uint8Array) {
  const hexAddress = '0x' + Buffer.from(proposerAddressBytes).toString('hex')
  return validators.value[chainIdFromRoute.value || '']?.map(v => getValidatorInfo(chainIdFromRoute.value || '', v))?.find(v => v.consensusHexAddress.toLowerCase() == hexAddress.toLowerCase())
}
if(!validators.value[chainIdFromRoute.value || '']) {
  await loadCosmosValidators(chainIdFromRoute.value || '')
}

</script>
<style lang="scss" scoped>
  .list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* ensure leaving items are taken out of layout flow so that moving
    animations can be calculated correctly. */
  .list-leave-active {
    position: absolute;
  }
</style>
