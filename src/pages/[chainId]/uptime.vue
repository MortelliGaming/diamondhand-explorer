<template>
  <chain-content>
    <v-row class="pl-2 pr-2">
      <block-validator-signatures
        v-for="(val, i) in validators[chainIdFromRoute]?.filter((v) => v.status == BondStatus.BOND_STATUS_BONDED).sort((a,b) => Number(b.tokens) - Number(a.tokens))"
        :key="val.operatorAddress"
        :rank="(i + 1).toString()"
        :validator="getValidatorInfo(chainIdFromRoute, val)" />
    </v-row>
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
import BlockValidatorSignatures from '@/components/blocks/BlockValidatorSignatures.vue';

import { BondStatus } from '@/lib/proto/cosmos/staking/v1beta1/staking';

const { chainIdFromRoute } = storeToRefs(useAppStore())
const { validators } = storeToRefs(useValidatorsStore())
const { getValidatorInfo, loadCosmosValidators } = useValidatorsStore()

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
  }
</style>
