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
    import { computed, onUnmounted, ref, type PropType } from 'vue';
    import moment from 'moment';

    import { Timestamp } from '@/lib/proto/google/protobuf/timestamp';
    import { formatDuration } from '@/lib/utils';

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

    const humanReadableTime = ref(formatDuration(parseInt(props.time?.seconds.toString() || '0') * 1000));

    const displayTime = computed(() => {
        return props.time ? moment(parseInt(props.time?.seconds.toString() || '0') * 1000) : moment()
    })

    const interval = setInterval(() => {
        humanReadableTime.value = formatDuration(parseInt(props.time?.seconds.toString() || '0') * 1000)
    }, 1000)

    function formatString(inputString: string): string {
        return inputString
            .replace(/(\d+)(?= days?)/, '<span class="text-orange-darken-3">$1</span>')
            .replace(/(?:^|\s)(\d+:\d+:\d+)(?=\s|$)/g, '<span class="text-orange-darken-3">$1</span>');
    }

    onUnmounted(() => {
        clearInterval(interval)
    })

  </script>