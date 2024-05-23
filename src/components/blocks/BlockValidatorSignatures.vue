<template>
  <v-col
    cols="6" sm="3" class="pa-1">
    <v-card color="grey-darken-3" style="height: 100%;">
      <v-card-text class="text-caption" style="height: 100%;">
        <v-row  style="height: 100%;">
          <v-col cols="12" class="pa-1 pb-0"  style="height: 100%;">
            <v-row no-gutters>
              <v-col
                class="d-flex align-center">
                  <validator-header :validator="extendedValidator" />
                  <div class="pl-1">#{{ props.rank}}</div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pa-1 pt-0">
            <v-row cols="100" no-gutters class="fill-height" style="margin-right: -2px;"> 
              <block-validator-signature-indicator 
                v-for="(blockIdFlag, i) in latestBlockValidatorSignatures || []"
                :key="latestBlockHeights[i]"
                :blockIdFlag="blockIdFlag"
                :height="latestBlockHeights[i] || 0"
                :validatorConsensusAddress="validatorConsensusAddress"
              />
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
// External
import { storeToRefs } from 'pinia'

// Store
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain';
import { useValidatorsStore } from '@/store/validators';

// Components
import ValidatorHeader from '@/components/ValidatorHeader.vue';
import BlockValidatorSignatureIndicator from './BlockValidatorSignatureIndicator.vue';
import { computed, PropType, ref } from 'vue';

import { fromHex } from '@cosmjs/encoding'
import { Validator } from '@/lib/proto/cosmos/staking/v1beta1/staking';
import { useDisplay } from 'vuetify'

const props = defineProps({
  validator: {
    type: Object as PropType<Validator>,
    required: true,
  },
  rank: String
})

const { smAndUp } = useDisplay()

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())
const { getValidatorInfo } = useValidatorsStore()

const latestBlockValidatorSignatures = computed(() => {
  return latestBlocks.value[chainIdFromRoute.value || '']?.slice(0,smAndUp ? 34 : 25)?.filter(b => b.lastCommit != null)?.map(b => b.lastCommit?.signatures.find(s => s.validatorAddress?.toString() == validatorConsensusAddress.value)?.blockIdFlag || undefined)
})
const latestBlockHeights = computed(() => {
  return latestBlocks.value[chainIdFromRoute.value || '']?.slice(0,smAndUp ? 34 : 25)?.filter(b => b.lastCommit != null)?.map(b => b.lastCommit?.height)
})
const extendedValidator = ref(getValidatorInfo(chainIdFromRoute.value, props.validator))
const validatorConsensusAddress = ref(fromHex(extendedValidator.value?.consensusHexAddress.replace('0x', ''))?.toString())

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

  .signature {
    height: 15px !important;
    width: 3px;
    max-width: 3px;
    margin-top: 2px;
    margin-right: 2px;
    &.green {
      background-color: green;
    }
    &.red {
      background-color: red;
    }
    &.gray {
      background-color: gray;
    }
  }
</style>
