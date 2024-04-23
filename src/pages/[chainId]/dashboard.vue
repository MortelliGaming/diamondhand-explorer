<template>
  <chain-content>
    {{ chainIdFromRoute }}
    dashboard
    {{ latestEVMTransactionHashes }}

    {{ cosmosChaindata['crossfi-evm-testnet-1']?.blockchain?.blockMetas[0].header.chainId }}
    {{ cosmosChaindata['crossfi-evm-testnet-1']?.blockchain?.lastHeight }}
    {{ cosmosChaindata['crossfi-evm-testnet-1']?.stakingParams?.params.bondDenom }}
    


  </chain-content>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import ChainContent from '@/components/ChainContent.vue'
import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain'


const { chainIdFromRoute } = storeToRefs(useAppStore())
const { latestEVMTransactionHashes, cosmosChaindata } = storeToRefs(useBlockchainStore())
</script>
