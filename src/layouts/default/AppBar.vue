<template>
  <v-app-bar flat>
    <v-icon
        role="button"
        icon="mdi-menu"
        class="pl-5 hidden-md-and-up"
        @click.stop="() => { isNavigationDrawerOpen = !isNavigationDrawerOpen}"
    ></v-icon>
    <v-app-bar-title>
      <div class="d-flex align-center">
        <div role="button" class="d-flex flex-row align-center" @click="() => router.push('/')">
          <div class="pr-2 hidden-sm-and-down"><v-img src="@/assets/logo.png" height="30" width="30"/></div>
          <div class=" hidden-sm-and-down">{{ $t('appheader.title') }}</div>
        </div>
        <header-blockchain-info />
      </div>
    </v-app-bar-title>
    <template v-slot:append>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app';
import { useRouter } from 'vue-router'

import HeaderBlockchainInfo from './HeaderBlockchainInfo.vue';

const router = useRouter();
const { isNavigationDrawerOpen } = storeToRefs(useAppStore())

</script>
