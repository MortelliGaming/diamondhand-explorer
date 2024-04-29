<template>
  <v-app class="fill-height" v-if="isConnecting">
    <v-container class="fill-height">
      <loading/>
    </v-container>
  </v-app>
  <router-view v-else />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useAppStore } from '@/store/app';
import { storeToRefs } from 'pinia';
import { useBlockchainStore } from '@/store/blockchain';
import Loading from './components/Loading.vue';

const { mdAndUp } = useDisplay();
const { isNavigationDrawerOpen } = storeToRefs(useAppStore())
const { connectClients } = useBlockchainStore()

const isConnecting = ref(true)

onMounted(() => {
  if(mdAndUp.value == true) {
    isNavigationDrawerOpen.value = true;
  }
  connectClients().then(() => {
    isConnecting.value = false;
  })
})
</script>
