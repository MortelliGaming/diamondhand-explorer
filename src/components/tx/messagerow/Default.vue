<template>
<v-row no-gutters>
    <v-col
        cols="12"
        class="d-flex">
        <b>
            {{ props.message.typeUrl.split('.')[message.typeUrl.split('.').length -1]}}
        </b>
    </v-col>
</v-row>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import { DecodeObject } from '@cosmjs/proto-signing';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        required: true,
    }
})
</script>