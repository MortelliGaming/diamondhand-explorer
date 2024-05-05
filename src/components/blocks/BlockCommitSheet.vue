<template>
    <v-sheet
        color="grey-darken-3" rounded elevation="12" class="pa-2 fill-height">
        <v-row no-gutters class="d-flex flex-row">
            <v-col v-if="props.signature.validatorAddress" cols="12" class="d-flex justify-center">
                <v-avatar v-if="validator" class="mr-2" size="x-small">
                    <v-img 
                        v-if="keybaseAvatars[validator.description.identity]"
                        :src="keybaseAvatars[validator.description.identity]" />
                    <v-icon v-else icon="mdi-account" />
                </v-avatar>
                {{ validator?.description.moniker  }}
            </v-col>
            <v-col class="d-flex justify-center pt-1" cols="12"><b>{{ BlockIdFlag[props.signature.blockIdFlag] }}</b></v-col>
        </v-row>
    </v-sheet>
</template>
<script lang="ts" setup>
import { PropType, computed } from 'vue';
import { BlockIdFlag, CommitSignature } from '@cosmjs/tendermint-rpc';
import { useValidatorsStore } from '@/store/validators';
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app';

const props = defineProps({
    signature: {
        type: Object as PropType<CommitSignature>,
        required: true,
    },
})
const { chainIdFromRoute } = storeToRefs(useAppStore())
const { keybaseAvatars, validators } = storeToRefs(useValidatorsStore())
const { getValidatorInfo } = useValidatorsStore()


const validator = computed(() => {
    if(!props.signature.validatorAddress) {
        return undefined
    } else {
    const hexAddress = '0x' + Buffer.from(props.signature.validatorAddress).toString('hex')
        return validators.value[chainIdFromRoute.value || '']?.find(
                    v => getValidatorInfo(chainIdFromRoute.value || '', v)?.consensusHexAddress.toLowerCase() === hexAddress.toLowerCase())
    }
})
</script>