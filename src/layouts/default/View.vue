<template>
    <v-main>
      <Suspense>
        <router-view />
        <template #fallback>
            <loading />
        </template>
      </Suspense>
    </v-main>
</template>

<script lang="ts" setup>
import Loading from '@/components/Loading.vue';
import { useBlockchainStore } from '@/store/blockchain';

const { connectClients } = useBlockchainStore()
await connectClients()
</script>
