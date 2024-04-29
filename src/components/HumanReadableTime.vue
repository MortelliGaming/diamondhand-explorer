<template>
    <div v-html="formatString(humanReadableTime)">
    </div>
</template>
  
<script setup lang="ts">
    import { onUnmounted, ref, type PropType } from 'vue';
    import { useI18n } from 'vue-i18n';
    import { Timestamp } from '@/lib/proto/google/protobuf/timestamp';
    import { formatDuration } from '@/lib/timeUtils';

    const props = defineProps({
        time: {
            type: Object as PropType<Timestamp|undefined>,
            required: true
        }
    })
    const { t } = useI18n()
    const humanReadableTime = ref('');
    
    function setHumanReadableTime() {
        humanReadableTime.value = formatDuration(parseInt(props.time?.seconds.toString() || '0') * 1000)
    }
    setHumanReadableTime()
    const interval = setInterval(setHumanReadableTime, 1000)

    function formatString(inputString: string): string {
        // Define the regex pattern to match the time (HH:mm:ss)
        const timeRegex = /(?:^|\s)(\d+:\d+:\d+)(?=\s|$)/g;
        // Apply HTML styling to numbers and the time (HH:mm:ss)
        let formattedString = inputString.replace(/(\d+)/g, `<span class="text-orange-darken-4">$1</span>`);
        formattedString = formattedString.replace(timeRegex, `<span class="text-orange-darken-4">$1</span>`);
        formattedString = formattedString.replace('ago', t('time.ago'))
        formattedString = formattedString.replace('in',  t('time.in'))
        formattedString = formattedString.replace('days',  t(((Number(props.time?.seconds) * 1000) < Date.now() ? 'time.daysAgo' : 'time.daysToGo')))

        return formattedString;
    }

    onUnmounted(() => {
        clearInterval(interval)
    })

</script>