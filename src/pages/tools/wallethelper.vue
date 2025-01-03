<template>
  <v-container>
    <base-sheet :title="$t('module.wallethelper')">
      <v-row no-gutters
        class="d-flex align-center pt-2"
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
            <v-dialog max-width="500">
              <template v-slot:activator="{ props: activatorProps }">
                <v-btn
                  flat
                  v-bind="activatorProps"
                  icon="mdi-eye-outline"
                ></v-btn>
              </template>

              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-card-title>
                    <div class="d-flex pl-5 align-center">
                      <div>{{ chain.name }}</div>
                      <v-spacer></v-spacer>
                      <v-btn
                        :icon="'mdi-close'"
                        flat
                        @click="isActive.value = false"
                      ></v-btn>
                    </div>
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <div v-if="chain.keplr">
                        <div class="d-flex align-center">
                          <div class="pr-2"><b>{{ 'Keplr' }}</b></div>
                          <v-btn
                            flat v-if="chain.keplr"
                            @click="() =>suggestKeplrchain(chain.keplr!)">
                            <v-img
                              style="height: 25px;width: 25px;"
                              src="https://assets-global.website-files.com/63eb7ddf41cf5b1c8fdfbc74/63fc1eaf76d6a3bd547b017c_Keplr_icon_ver.1.3_2.svg" />
                              <div class="pl-1">{{ $t('walletHelper.add') }}</div>
                          </v-btn>
                        </div>
                        <div style="max-height: 150px; overflow-y: scroll;">
                          <pre class="text-caption">
                            {{ '\n' + JSON.stringify(chain.keplr, null, 2) }}
                          </pre>
                        </div>
                      </div>
                      <div v-if="chain.evm" class="pt-1">
                        <v-divider class="pt-1 pb-1" />
                        <div class="d-flex align-center">
                          <div class="pr-2"><b>{{ 'Metamask' }}</b></div>
                          <v-btn flat v-if="chain.evm"
                            @click="() =>suggestMetaMaskChain(chain.evm!)">
                            <v-img
                              style="height: 25px;width: 25px;"
                              src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/2048px-MetaMask_Fox.svg.png" />
                               <div class="pl-1">{{ $t('walletHelper.add') }}</div>
                          </v-btn>
                        </div>
                        <div style="max-height: 150px; overflow-y: scroll;">
                          <pre class="text-caption">
                            {{ '\n' + JSON.stringify(chain.evm, null, 2) }}
                          </pre>
                        </div>
                      </div>
                    </v-container>
                  </v-card-text>
                </v-card>
              </template>
            </v-dialog>
          </v-responsive>
        </v-col>
        <v-col cols="12">
          <v-divider />
          <h1>Ledger Address Viewer</h1>
          <div @click="connectLedger">Connect Ledger</div>
          <h2>Cosmos Address (118):</h2>
          <p id="cosmos-address"></p>
          <h2>Ethereum Address (60):</h2>
          <p id="eth-address"></p>
        </v-col>
      </v-row>
    </base-sheet>
  </v-container>
</template>

<script lang="ts" setup>
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import CosmosApp from "@ledgerhq/hw-app-cosmos";
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
    console.log({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: '0x' + evmChainConfig.id.toString(16),
        rpcUrls: evmChainConfig.rpcUrls.default.http,
        chainName: evmChainConfig.name,
        nativeCurrency: evmChainConfig.nativeCurrency,
        blockExplorerUrls: [evmChainConfig.blockExplorers?.default.url],
        iconUrls: ['https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/crossfi-mainnet/chain.png'],
      }]
    })
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: '0x' + evmChainConfig.id.toString(16),
        rpcUrls: evmChainConfig.rpcUrls.default.http,
        chainName: evmChainConfig.name,
        nativeCurrency: evmChainConfig.nativeCurrency,
        blockExplorerUrls: [evmChainConfig.blockExplorers?.default.url],
        iconUrls: ['https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/crossfi-mainnet/chain.png'],
      }]
    });
  }
}

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
};

async function connectLedger() {
  try {

    let transport = await TransportWebUSB.create();
    const app = new CosmosApp(transport);
    console.log(app)
    // Get Cosmos address (118)
    
    await sleep(1000)
    await app.getAddress("44'/118/0/0/0", "mx", true).then(o => console.log(o.address))
    // console.log(cosmosResult)
    // console.log(cosmosResult.publicKey)
    // document.getElementById("cosmos-address").textContent = cosmosResult.address;

    // Get Ethereum address (60)
    // const ethResult = await app.getAddress("44'/60/0'/0/0", 'cosmos');
    // console.log(ethResult.address)
    // document.getElementById("eth-address").textContent = ethResult.address;

  } catch (error) {
    console.error("Error connecting to Ledger:", error);
  }
}
</script>
