<template>
  <v-col
    cols="12" sm="3" class="pa-1">
    <v-card color="grey-darken-3">
      <v-card-text class="text-caption">
        <v-row>
          <v-col cols="12" class="pa-1">
            <v-row no-gutters>
              <v-col
                class="d-flex align-center">
                  <validator-header :validator="validator" />
                  <div class="pl-1">#{{ props.rank}}</div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" class="pa-1">
            <v-row cols="100" no-gutters>
              <v-tooltip
                v-for="(block, i) in latest100Blocks || []"
                :key="(block?.header.appHash.toString() || '' + i)"
                :text="block?.header.height.toString()">
                <template v-slot:activator="{ props }">
                  <v-col
                    v-bind="props"
                    cols="1"
                    class="pa-0 signature">
                    <div
                      v-if="block"
                      :class="'signature ' + (block.lastCommit!.signatures.find(s => s.validatorAddress?.toString() || '' == validatorConsensusAddress) ? 'green' : 'red')">
                    </div>
                    <div
                      v-else
                      :class="'signature gray'">
                    </div>
                  </v-col>
                </template>
              </v-tooltip>
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

// Components
import ValidatorHeader from '@/components/ValidatorHeader.vue';
import { computed, PropType, ref } from 'vue';
import { ExtendedValidator } from '../../store/validators';

import { fromHex } from '@cosmjs/encoding'

const props = defineProps({
  validator: {
    type: Object as PropType<ExtendedValidator>,
    required: true,
  },
  rank: String
})

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestBlocks } = storeToRefs(useBlockchainStore())

const latestChainBlocks= computed(() => {
  return latestBlocks.value[chainIdFromRoute.value || '']
})

const latest100Blocks = computed(() => {
  return latestChainBlocks.value?.filter(b => b.lastCommit != null).splice(0,100)
})
const validatorConsensusAddress = ref(fromHex(props.validator.consensusHexAddress.replace('0x', ''))?.toString())

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
    margin-right: 2px;
    margin-top: 2px;
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
