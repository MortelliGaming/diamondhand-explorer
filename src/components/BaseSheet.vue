<template>
    <v-sheet class="text-caption pa-3">
        <v-container class="pt-0 pb-0">
            <v-row>
                <v-col cols="12">
                    <div class="d-flex flex-row">
                        <div class="text-h6 text-left" style="overflow-wrap: break-word; max-width: 75%;">{{ props.title }}</div>
                        <div class="text-right flex-grow-1">
                            <slot name="appendTitle"></slot>
                        </div>
                    </div>
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
  