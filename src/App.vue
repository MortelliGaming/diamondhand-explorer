<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';

const { mdAndUp } = useDisplay();
const { isNavigationDrawerOpen } = storeToRefs(useAppStore())

onMounted(() => {
  if(mdAndUp.value == true) {
    isNavigationDrawerOpen.value = true;
  }
})
</script>
