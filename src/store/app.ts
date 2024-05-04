import { defineStore } from 'pinia';
import { Ref, computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export const useAppStore = defineStore('app', () => {
    const isNavigationDrawerOpen = ref(false)
    const isTestnet = computed(() => {
      return window.location.href.toLowerCase().includes('testnet')
    })

    const route = useRoute()
    const chainIdFromRoute: Ref<string> = computed(() => {
      return (route.params as { chainId: string })?.chainId || '' as string;
    })

    return { 
      isTestnet,
      isNavigationDrawerOpen,
      chainIdFromRoute,
    }
})