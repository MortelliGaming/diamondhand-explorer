<template>
    <v-sheet class="text-caption pa-3 fill-height">
        <v-container class="pt-0">
            <v-row>
                <v-col cols="8" class="pb-0" style="overflow-wrap: break-word;">
                    <div class="text-h6 text-left">{{ props.title }}</div>
                </v-col>
                <v-col cols="4" class="pb-0 text-right" style="overflow-wrap: break-word;">
                    <slot name="appendTitle"></slot>
                </v-col>
            </v-row>
            <slot></slot>
        </v-container>
    </v-sheet>
</template>

<script lang="ts" setup>

const props = defineProps({
    title: String
})
</script>
<style>
</style>
  