<template>
    <div>
        <div>
            <b>{{ title }}</b>
        </div>
        <div>
            {{  displayTime.format('DD.MM.yy HH:mm:ss')  }}
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, type PropType } from 'vue';
  import moment from 'moment';

  const props = defineProps({
    title: {
        type: String,
        default: ''
    },
    time: {
        type: Object as PropType<{ "seconds": string, "nanos": number }>,
        required: true
    }
  })

  const displayTime = computed(() => {
    return props.time ? moment(parseInt(props.time?.seconds || '0') * 1000) : moment()
  })
  </script>