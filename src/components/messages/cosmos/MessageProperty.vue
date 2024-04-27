<template>
    <v-row v-if="displayProp && displayProp[1] && !Array.isArray(displayProp[1])">
        <v-col cols="3">
            <b>{{ displayProp[0] }}</b>
        </v-col>
        <v-col  
            v-if="displayProp && displayProp[1] && typeof displayProp[1] === 'object'"
            cols="9" style="overflow-wrap: break-word;">
            <div class="text-caption" v-for="prop in Object.entries(displayProp[1])" :key="prop[0]">
                <message-property :property="prop" />
            </div>
        </v-col>

        <v-col v-else cols="9" style="overflow-wrap: break-word;" class="d-flex align-center">
            <div>
                {{ displayProp[1] }}
            </div>
        </v-col>
    </v-row>
    <div v-if="displayProp && (typeof displayProp[1] === 'object') && Array.isArray(displayProp[1])">
        <v-row>
            <v-col class="pb-0">
                <b>{{ displayProp[0] }}</b>
            </v-col>
        </v-row>
        <v-row>
            <v-col 
                class="pt-0"
                cols="12" style="overflow-wrap: break-word;">
                <div class="text-caption mt-2 mb-2" v-for="(prop, i) in (displayProp[1] as Array<object>)" :key="i">
                    <v-sheet elevation="24" color="blue-grey-darken-4" class="pa-3">
                            <div class="text-caption" v-for="childProp in Object.entries(prop)" :key="childProp[0]">
                                <message-property :property="childProp" />
                            </div>
                    </v-sheet>
                </div>
            </v-col>
        </v-row>
    </div>
    <v-divider />
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';

const props = defineProps({
    property: {
        type: Object as PropType<[string, string]>,
        regquired: true,
    },
})

const displayProp = computed(() => {
    try {
        const parsed = JSON.parse(props.property?.[1] as string) as Object|Array<string>
        if(typeof parsed === typeof ['']) {
            return [props.property?.[0], parsed as Array<object>]
        } else {
            return [props.property?.[0], parsed as Record<string,string>]
        }
    } catch {
        return [props.property?.[0], props.property?.[1]] as [string, string]
    }
})
</script>
<style>
</style>