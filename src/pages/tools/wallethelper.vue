<template>
  <v-container>
    <base-sheet>
      <v-row no-gutters
        class="d-flex align-center"
        v-for="chain in availableChains"
        :key="chain.name">
        <v-col cols="4">
            <v-avatar size="small">
              <v-img v-if="chain.keplr?.chainSymbolImageUrl" :src="chain.keplr?.chainSymbolImageUrl" />
              <v-icon v-else icon="mdi-questionmark" />
            </v-avatar>
            {{ chain.name }}
        </v-col>
        <v-col cols="8">
          <v-responsive class="text-right">
            <v-btn flat v-if="chain.evm"
              @click="() =>suggestMetaMaskChain(chain.evm!)">
              <v-img
                style="height: 25px;width: 25px;"
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png" />
            </v-btn>
            <v-btn
              flat v-if="chain.keplr"
              @click="() =>suggestKeplrchain(chain.keplr!)">
              <v-img
                style="height: 25px;width: 25px;"
                src="https://assets-global.website-files.com/63eb7ddf41cf5b1c8fdfbc74/63fc1eaf76d6a3bd547b017c_Keplr_icon_ver.1.3_2.svg" />
            </v-btn>
            <v-btn flat :icon="'mdi-eye'"></v-btn>
          </v-responsive>
        </v-col>
        <v-col cols="12">
          <v-divider />
        </v-col>
      </v-row>
    </base-sheet>
  </v-container>
</template>

<script lang="ts" setup>
import { type Window as KeplrWindow, type ChainInfo } from "@keplr-wallet/types";
import type { Chain } from 'viem'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {
    ethereum?: import('ethers').Eip1193Provider;
  }
}

import BaseSheet from '@/components/BaseSheet.vue';
import { useBlockchainStore } from '@/store/blockchain';
import { storeToRefs } from 'pinia';
const { availableChains } = storeToRefs(useBlockchainStore())

function suggestKeplrchain(chainConfig: ChainInfo) {
  if(window.keplr) {
    window.keplr.experimentalSuggestChain(chainConfig)
  }
}

function suggestMetaMaskChain(evmChainConfig: Chain) {
  if(window.ethereum) {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: '0x' + evmChainConfig.id.toString(16),
        rpcUrls: [evmChainConfig.rpcUrls.default.http],
        chainName: evmChainConfig.name,
        nativeCurrency: evmChainConfig.nativeCurrency,
        blockExplorerUrls: [evmChainConfig.blockExplorers?.default.url]
      }]
    });
  }
}
</script>
