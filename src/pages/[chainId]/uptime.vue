<template>
  <chain-content>
    <base-sheet
      :title="$t('module.uptime')"  style="max-height: 80vh; overflow-y: scroll; overflow-x:hidden; width: 100%;">
      <v-row class="pl-2 pr-2">
        <block-validator-signatures
          v-for="(val) in paginatedValidators"
          :key="val.operatorAddress"
          :rank="(sortedActiveValidators.indexOf(val) + 1).toString()"
          :validator="val" />
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-pagination
              v-model="page"
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

// Store
import { useAppStore } from '@/store/app'
import { useValidatorsStore } from '@/store/validators';

// Components
import ChainContent from '@/components/ChainContent.vue'
import BaseSheet from '@/components/BaseSheet.vue';
import BlockValidatorSignatures from '@/components/blocks/BlockValidatorSignatures.vue';

import { BondStatus } from '@/lib/proto/cosmos/staking/v1beta1/staking';
import { computed, ref } from 'vue';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { validators } = storeToRefs(useValidatorsStore())
const { loadCosmosValidators } = useValidatorsStore()

const numPerPage = 16
const page = ref(1)
const numPages = computed(() => {
  const numPagesDecimal = sortedActiveValidators.value?.length / numPerPage;
  return Math.ceil(numPagesDecimal);
})

if(!validators.value[chainIdFromRoute.value || '']) {
  await loadCosmosValidators(chainIdFromRoute.value || '')
}

const sortedActiveValidators = computed(() => validators.value[chainIdFromRoute.value]?.filter((v) => v.status == BondStatus.BOND_STATUS_BONDED).sort((a,b) => Number(b.tokens) - Number(a.tokens)))

const paginatedValidators = computed(() => {
  return sortedActiveValidators.value.slice((page.value - 1) * numPerPage, (page.value - 1) * numPerPage + numPerPage)
})


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
    background-color: blue;
    &.green {
      background-color: green;
    }
    &.red {
      background-color: red;
    }
  }
</style>
