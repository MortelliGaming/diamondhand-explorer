<template>
    <v-row class="text-caption">
       <v-col>
        <v-row>
            <v-col cols="3">
                {{ t('proposal.name') }}:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.plan.name }}
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                {{ t('proposal.binaries') }}:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;" v-for="binary in Object.entries(binaries)" :key="binary[0]">
                <div class="d-flex flex-column">
                    <div>
                        <b>{{ binary[0] }}</b>
                    </div>
                    <div>
                        {{ binary[1] }}
                    </div>
                </div>
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                {{ t('proposal.height') }}:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                <div class="d-flex flex-column flex-sm-row">
                    <div class="pr-2">
                        {{ decodedMessage?.plan.height }}
                    </div>
                    <div class="d-flex flex-row">
                        {{ '(' }}
                        <div class="pr-1">
                            {{ t('proposal.around') }}
                        </div>
                        <human-readable-time v-if="upgradeHeightTime" :time="{ seconds: BigInt((upgradeHeightTime / 1000).toFixed(0)), nanos: 0 }" />
                        {{ ')' }}
                    </div>
                </div>                
            </v-col>
        </v-row>
        <v-divider />
        <v-row>
            <v-col cols="3">
                {{ t('proposal.authority') }}:
            </v-col>
            <v-col cols="9" style="overflow-wrap: break-word;">
                {{ decodedMessage?.authority}}
            </v-col>
        </v-row>
        <v-divider />
        <div>
        </div>
       </v-col>
    </v-row>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { Ref, computed, onMounted, ref, type PropType } from 'vue';
import type { DecodeObject } from '@cosmjs/proto-signing'

import { useBlockchainStore } from '@/store/blockchain';
import { protoRegistry } from '@/lib/http';
import { MsgSoftwareUpgrade } from '@/lib/proto/cosmos/upgrade/v1beta1/tx';

import HumanReadableTime from '@/components/HumanReadableTime.vue';
import { storeToRefs } from 'pinia';
import { Block } from '@cosmjs/stargate';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        required: true,
    },
    chainId: {
        type: String,
        required: true,
    },
})
const { t } = useI18n();
const { cosmosHelper } = storeToRefs(useBlockchainStore())

const decodedMessage = computed(() => {
    try {
        if(props.message) {
            const messageType = protoRegistry.lookupType(props.message?.typeUrl)
            if(messageType) {
                return protoRegistry.decode(props.message) as MsgSoftwareUpgrade
            }
        }
        return undefined
    } catch(err) {
        console.warn('cannot decode message type ' + props.message?.typeUrl)
        return undefined
    }
})

const binaries = computed(() => {
    try {
        return JSON.parse(decodedMessage.value?.plan.info || '{}')?.binaries || []
    } catch {
        return []
    }
})

const upgradeHeightTime = computed(() => {

    const blockDifference = Number(decodedMessage.value?.plan.height || 0n) - (last3Blocks.value[0]?.header.height || 0)
    const blocktime = (Date.parse(last3Blocks.value[0]?.header.time || '') - Date.parse(last3Blocks.value[2]?.header.time || '')) / 3
    return Date.now() + (blockDifference * blocktime)
})
const last3Blocks: Ref<(Block|undefined)[]> = ref([])

onMounted(async () => {
    try {
        last3Blocks.value.push(await cosmosHelper.value.GetBlock(props.chainId))
        last3Blocks.value.push(await cosmosHelper.value.GetBlock(props.chainId, (last3Blocks.value[0]?.header.height || 0)-1))
        last3Blocks.value.push(await cosmosHelper.value.GetBlock(props.chainId, (last3Blocks.value[0]?.header.height || 0)-2))
    } catch {
    // 
    }
})

</script>
<style>
</style>