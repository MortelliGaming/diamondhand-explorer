<template>
    <div>
        <div>
            <b>{{ title }}</b>
        </div>
        <div>
            {{  displayTime.format('DD.MM.YY HH:mm:ss')  }}
        </div>
        <human-readable-time :time="props.time" />
    </div>
  </template>
  
  <script setup lang="ts">
    import { computed, type PropType } from 'vue';
    import moment from 'moment';

    import { Timestamp } from '@/lib/proto/google/protobuf/timestamp';

    import HumanReadableTime from './HumanReadableTime.vue';

    const props = defineProps({
        title: {
            type: String,
            default: ''
        },
        time: {
            type: Object as PropType<Timestamp|undefined>,
            required: true
        }
    })

    const displayTime = computed(() => {
        return props.time ? moment(parseInt(props.time?.seconds.toString() || '0') * 1000) : moment()
    })
    
  </script>