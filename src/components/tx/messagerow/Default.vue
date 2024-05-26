<template>
<v-row no-gutters>
    <v-col
        cols="12"
        class="d-flex">
        <b>
            {{ $t('message.' + displayMessage)?.replace('message.','') }}
        </b>
    </v-col>
</v-row>
</template>
<script lang="ts" setup>
import { PropType, ref } from 'vue';
import { DecodeObject } from '@cosmjs/proto-signing';

const props = defineProps({
    message: {
        type: Object as PropType<DecodeObject>,
        required: true,
    }
})

const displayMessage = ref(props.message.typeUrl.split('.')[props.message.typeUrl.split('.').length -1])
</script>