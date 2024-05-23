<template>
    <div class="d-flex align-center">
        <div class="pt-1 pb-1">
            <v-avatar size="x-small">
                <v-img
                    v-if="validator?.description.identity"
                    :src="keybaseAvatars[validator?.description.identity]" />
                <v-icon icon="mdi-account" v-else />
            </v-avatar>
        </div>
        <div class="pl-1">
            {{ validator?.description.moniker }}
        </div>
    </div>
</template>
<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app';
import { useValidatorsStore } from '@/store/validators';
import { Validator } from '@/lib/proto/cosmos/staking/v1beta1/staking';

export type Coin = {
    amount: string
    balance: string
}
const props = defineProps({
    validator: {
        type: Object as PropType<Validator>,
        required: false
    }
})

const { getValidatorInfo } = useValidatorsStore()
const { keybaseAvatars } = storeToRefs(useValidatorsStore())
const { chainIdFromRoute } = storeToRefs(useAppStore())

const validator = computed(() => {
    return props.validator ? getValidatorInfo(chainIdFromRoute.value, props.validator) : undefined
})

</script>