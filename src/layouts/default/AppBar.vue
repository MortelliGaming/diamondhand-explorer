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
      <div v-if="chainConfig">
        <dh-connect-wallet
          ref="walletConnector"
          :blockchain-config="chainConfig" />
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAppStore } from '@/store/app';
import { useBlockchainStore } from '@/store/blockchain';
import { useRouter } from 'vue-router'

import HeaderBlockchainInfo from './HeaderBlockchainInfo.vue';
import { computed, ref, watch } from 'vue';
import { DhConnectWallet } from 'diamondhand-widget';

const router = useRouter();
const { isNavigationDrawerOpen, chainIdFromRoute } = storeToRefs(useAppStore())
const { availableChains } = storeToRefs(useBlockchainStore())


const walletConnector = ref<InstanceType<typeof DhConnectWallet>>()

const chainConfig = computed(() => {
  return availableChains.value.find(c => c.name == chainIdFromRoute.value)?.keplr
})
// walletConnector.value?.updateBlockchainconfig();
watch(chainConfig, () => {
  //walletConnector.value?.updateBlockchainconfig(chainConfig.value);
  //walletConnector.value?.connectWallet();
})

</script>
