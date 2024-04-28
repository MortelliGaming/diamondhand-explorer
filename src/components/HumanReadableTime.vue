<template>
    <div v-html="formatString(humanReadableTime)">
    </div>
</template>
  
<script setup lang="ts">
    import { onUnmounted, ref, type PropType } from 'vue';
    import { Timestamp } from '@/lib/proto/google/protobuf/timestamp';
    import { formatDuration } from '@/lib/utils';

    const props = defineProps({
        time: {
            type: Object as PropType<Timestamp|undefined>,
            required: true
        }
    })

    const humanReadableTime = ref('');
    
    function setHumanReadableTime() {
        humanReadableTime.value = formatDuration(parseInt(props.time?.seconds.toString() || '0') * 1000)
    }
    setHumanReadableTime()
    const interval = setInterval(setHumanReadableTime, 1000)

    function formatString(inputString: string): string {
        return inputString
            .replace(/(\d+)(?= days?)/, '<span class="text-orange-darken-3">$1</span>')
            .replace(/(?:^|\s)(\d+:\d+:\d+)(?=\s|$)/g, '<span class="text-orange-darken-3">$1</span>');
    }

    onUnmounted(() => {
        clearInterval(interval)
    })

</script>