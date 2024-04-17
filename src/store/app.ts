import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useAppStore = defineStore('app', () => {
    const isTestnet = computed(() => {
      return window.location.href.toLowerCase().includes('testnet')
    })
    const isNavigationDrawerOpen = ref(false)

    return { 
      isTestnet,
      isNavigationDrawerOpen
    }
})