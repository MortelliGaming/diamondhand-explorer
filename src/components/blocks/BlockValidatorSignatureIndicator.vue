<template>
  <v-tooltip
    :text="(props.height).toString()">
    <template v-slot:activator="{ props }">
      <v-col
        v-bind="props"
        cols="1"
        class="pa-0 signature">
        <div
          v-if="blockIdFlag"
          :class="'signature ' + ((blockIdFlag == BlockIdFlag.Commit || blockIdFlag == BlockIdFlag.Nil) ? 'green' : 'light-blue')">
        </div>
        <div
          v-else
          :class="'signature red'">
        </div>
      </v-col>
    </template>
  </v-tooltip>
</template>

<script lang="ts" setup>
import { BlockIdFlag } from '@cosmjs/tendermint-rpc';

const props = defineProps({
  blockIdFlag: {
    type: Number,
    required: false,
  },
  height: {
    type: Number,
    required: true,
  }
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
