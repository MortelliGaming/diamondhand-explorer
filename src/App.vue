<template>
  <router-view />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useDisplay } from 'vuetify';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { useBlockchainStore } from '@/store/blockchain';

const { mdAndUp } = useDisplay();
const { isNavigationDrawerOpen } = storeToRefs(useAppStore())
const { connectClients } = useBlockchainStore()

onMounted(() => {
  if(mdAndUp.value == true) {
    isNavigationDrawerOpen.value = true;
  }
  connectClients()
})
</script>
