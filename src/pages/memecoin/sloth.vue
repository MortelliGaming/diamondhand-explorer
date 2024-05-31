<template>
    <v-container class="d-flex">
        <div class="text-h6">
            {{ $t('module.sloth') }}
            {{ 'on' }}
            <v-avatar size="x-large">
                <v-img src="https://crossfi.org/wp-content/uploads/2024/03/Icon-version-%E2%80%93-Color-CROSSFI-CHAIN.png" />
            </v-avatar>
        </div>
        <div class="text-right flex-grow-1 d-flex align-center justify-end">
            <v-avatar>
                <v-img class="sloth-token" :src="slothTokenImage" />
            </v-avatar>
        </div>
    </v-container>
    <v-container class="pt-0">
        <base-sheet>
            <v-row no-gutters>
                <v-col cols="12" style="max-height: 250px; overflow-y:scroll; overflow-x: hidden;">
                   <pre
                    style="white-space: pre-wrap;"
                    v-html="marked(t('tokenDescription'))"></pre>
                </v-col>
            </v-row>
        </base-sheet>
        <div class="pt-2"></div>
        <base-sheet>
            <v-row no-gutters>
                <v-col class="text-h6 d-flex">
                    <div>
                    {{ $t('sloth.sale')}}
                    </div>
                    <div class="text-right flex-grow-1">
                        <time-formatter :time="{
                            seconds: BigInt(Math.floor(Number(presaleEnddate) / 1000)),
                            nanos: 0
                        }" />
                    </div>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col cols="12">
                   <v-row no-gutters>
                        <v-col>Total Supply</v-col>
                        <v-col>{{ Number(totalTokenSupply) / Math.pow(10, tokenDecimals) }} {{ tokenSymbol }}</v-col>
                   </v-row>
                   <v-row no-gutters>
                        <v-col>Presale Sold Tokens</v-col>
                        <v-col>
                            <asset
                                :balance="{ amount: (Number(presaleSoldTokens || 0) / Math.pow(10, Number(tokenDecimals || 0))).toString(), denom: tokenSymbol}" />
                                / {{ Number(presaleSupply) / Math.pow(10, Number(tokenDecimals)) }}
                        </v-col>
                   </v-row>
                   <v-row no-gutters>
                        <v-col>Current Presale Price</v-col>
                        <v-col>
                            <asset
                                :balance="{ amount: (Number(presaleCurrentPrice)).toString(), denom: tokenChain.nativeCurrency.symbol.toLowerCase()}" />
                        </v-col>
                   </v-row>
                   <v-row no-gutters>
                        <v-col>Total {{ tokenChain.nativeCurrency.symbol }} spent</v-col>
                        <v-col>
                            <asset
                                :balance="{ amount: (Number(presaleCroSpent || 0)).toString(), denom: tokenChain.nativeCurrency.symbol.toLowerCase()}" />
                        </v-col>
                   </v-row>
                   <v-row no-gutters>
                        <v-col>Max Tokens per Tx</v-col>
                        <v-col>
                            <asset
                                :balance="{ amount: (Number(presaleMaxTokensPerTx) / Math.pow(10, Number(tokenDecimals))).toString(), denom: tokenSymbol}" />
                        </v-col>
                   </v-row>
                   <v-row no-gutters class="pt-2">
                        <v-col cols="12">
                            <div class="d-flex align-center">
                                <v-text-field
                                    :min="0"
                                    :max="50"
                                    density="compact"
                                    type="number"
                                    v-model.number="buyAmount"
                                    hide-details="auto"
                                    width="150"
                                ></v-text-field>
                                <div class="pl-1">
                                    <b>{{ tokenSymbol }}</b>
                                </div>
                                <div class="pl-1">
                                    (<asset
                                        :balance="{
                                            amount: (parseInt(croPrice.amount)).toString(),
                                            denom: croPrice.denom
                                        }" />)
                                </div>
                            </div>
                            <v-btn @click="handleTokenBuy">buy</v-btn>
                        </v-col>
                   </v-row>
                </v-col>
            </v-row>
        </base-sheet>
        <div class="pt-2"></div>
        <base-sheet>
            <v-row no-gutters>
                <v-col cols="12">
                    <div class="text-h6">
                    {{ $t('sloth.addresses')}}
                    </div>
                </v-col>
                <v-col cols="12">
                    <v-row no-gutters>
                        <v-col>Sale Contract</v-col>
                        <v-col class="text-right">
                            <a target="_blank" :href="`https://test.xfiscan.com/contracts/${presaleAddress}`">
                                {{ presaleAddress }}
                            </a>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="pt-1">
                        <v-col>Sale Token Contract</v-col>
                        <v-col class="text-right">
                            <a target="_blank" :href="`https://test.xfiscan.com/tokens/${tokenAddress}`">
                                {{ tokenAddress }}
                            </a>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="pt-1">
                        <v-col>Reserve Wallet</v-col>
                        <v-col class="text-right">
                            <a target="_blank" :href="`https://test.xfiscan.com/addresses/${'0x2277a2089C2d90Cd342B1ed3670Ed0eF3030EaE8'}`">
                                {{ '0x2277a2089C2d90Cd342B1ed3670Ed0eF3030EaE8' }}
                            </a>
                        </v-col>
                    </v-row>
                    <v-row no-gutters class="pt-1">
                        <v-col>Dev Wallet</v-col>
                        <v-col class="text-right">
                            <a target="_blank" :href="`https://test.xfiscan.com/addresses/${'0x2277a2089C2d90Cd342B1ed3670Ed0eF3030EaE8'}`">
                                {{ '0x2277a2089C2d90Cd342B1ed3670Ed0eF3030EaE8' }}
                            </a>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </base-sheet>
        <div class="pt-2"></div>
    </v-container>
</template>
<script setup lang="ts">
import { marked } from 'marked';
import BaseSheet from '@/components/BaseSheet.vue';
import TimeFormatter from '@/components/TimeFormatter.vue';
import Asset from '@/components/Asset.vue';
import { messages } from './texts';
// import { cronos } from 'viem/chains'
import { crossfi } from '@/lib/chains/testnet'

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { createPublicClient, createWalletClient, custom, erc20Abi, http } from 'viem';
import { saleContractABI } from './saleContract';

import slothTokenImage from '@/assets/slothToken.webp'

const tokenAddress = '0xeaAc935906F34C0B3ca090E74B48a4EE8C2F9945'
const presaleAddress = '0xe71fEc2Bbb4155E31aA8F6D75De9e5DB8a5e7DFc'

const { t } = useI18n({
    messages
})

const totalTokenSupply = ref(0n)
const tokenDecimals = ref(18)
const tokenSymbol = ref('')

const presaleCurrentPrice = ref(0n)
const presaleSoldTokens = ref(0n)
const presaleSupply = ref(0n)
const presaleCroSpent = ref(0n)
const presaleMaxTokensPerTx = ref(0n)
const presaleEndBlock = ref(0n)
const presaleEnddate = ref(new Date())

const buyAmount = ref(0)
const croPrice = computed(() => {
    return { amount: (buyAmount.value * Number(presaleCurrentPrice.value)).toString(), denom: tokenChain.nativeCurrency.symbol.toLowerCase() }
})

const tokenChain = crossfi.evm!;

async function loadTokenInfo() {
    if(!tokenChain) {
        return;
    }
    const viemClient =  createPublicClient({
        transport: http(),
        chain: tokenChain
    })
    await viemClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'symbol'
    }).then(symbol => {
        
        tokenSymbol.value = symbol
    })

    viemClient.readContract({
        address: tokenAddress,
        abi: erc20Abi,
        functionName: 'totalSupply'
    }).then(totalSupply => {
        
        totalTokenSupply.value = totalSupply
    })
    viemClient.readContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'getCurrentPrice'
    }).then(price  => {
        
        presaleCurrentPrice.value = price as bigint
    })
    viemClient.readContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'tokensSold'
    }).then(tokensSold  => {
        
        presaleSoldTokens.value = tokensSold as bigint
    })
    viemClient.readContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'totalTokens'
    }).then(price  => {
        
        presaleSupply.value = price as bigint
    })
    viemClient.readContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'croSpent'
    }).then(spentCro  => {
        
        presaleCroSpent.value = spentCro as bigint
    })
    viemClient.readContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'maxTokensPerTx'
    }).then(maxTokens  => {
        
        presaleMaxTokensPerTx.value = maxTokens as bigint
    })
    viemClient.readContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'endBlock'
    }).then(endBlock  => {
        
        presaleEndBlock.value = endBlock as bigint
        estimateFutureBlockDate(Number(presaleEndBlock.value)).then(date => {
            
            presaleEnddate.value = date
        })
    })
}

function handleTokenBuy() {
    buyTokens();
}

const BLOCK_TIME_SAMPLE_SIZE = 10;

const publicClient = createPublicClient({
    chain: tokenChain,
    transport: http()
});

async function getAverageBlockTime(): Promise<number> {

  const startBlockNumber = await publicClient.getBlockNumber() - 11n;
  const blockHeaders = await Promise.all(
    Array.from({ length: BLOCK_TIME_SAMPLE_SIZE },async (_, i) =>
        await publicClient.getBlock({
            blockNumber: startBlockNumber + BigInt(i)
        })
    )
  );

  const blockTimes = blockHeaders
    .slice(1)
    .map((header, i) => header.timestamp - blockHeaders[i].timestamp);

  const averageBlockTime = blockTimes.reduce((sum, time) => sum + Number(time), 0) / blockTimes.length;
  return averageBlockTime;
}

/**
 * Estimates the date of a given future block number based on the average block time.
 * @param futureBlockNumber The future block number to estimate the date for.
 * @returns The estimated date of the future block.
 */
async function estimateFutureBlockDate(futureBlockNumber: number): Promise<Date> {
  const currentBlockNumber = await publicClient.getBlockNumber();
  const currentBlockHeader = await publicClient.getBlock({
        blockNumber: currentBlockNumber
    });
    const averageBlockTime = await getAverageBlockTime();

    const blockDifference = futureBlockNumber - Number(currentBlockNumber);
    const estimatedTimeDifference = blockDifference * averageBlockTime;
    const estimatedFutureBlockTimestamp = Number(currentBlockHeader.timestamp) + estimatedTimeDifference;
    
    
    return new Date(estimatedFutureBlockTimestamp * 1000); // Convert from seconds to milliseconds
}

async function buyTokens() {
    if(!window.ethereum) {
        return
    }
    const address = await window.ethereum.request({ method: 'eth_requestAccounts' });
       
    const walletClient = createWalletClient({
        chain: tokenChain,
        transport: custom(window.ethereum),
        account: address[0]
    });
    try {
        await walletClient.switchChain({ id: tokenChain.id })
        
        const gas = await publicClient.estimateContractGas({
            address: presaleAddress,
            abi: saleContractABI,
            account: address[0],
            functionName: 'buyTokens',
            args: [(BigInt(buyAmount.value) * BigInt(Math.pow(10, tokenDecimals.value))).toString().replace('n','')],
            value: BigInt(croPrice.value?.amount || 0n)
        })
       
        await walletClient.writeContract({
            gas,
            account: address[0],
            address: presaleAddress,
            abi: saleContractABI,
            functionName: 'buyTokens',
            args: [(BigInt(buyAmount.value) * BigInt(Math.pow(10, tokenDecimals.value))).toString().replace('n','')],
            value: BigInt(croPrice.value?.amount || 0n)
        })
    } catch (err: any) {
        
        if(!err.toString().includes('User rejected the request')) {
            // only alert when user did not reject
            alert('tx failed:' + err)
        }
    }
    /*
    await walletClient.writeContract({
        address: presaleAddress,
        abi: saleContractABI,
        functionName: 'buyTokens',
        args: [buyAmount.value * Math.pow(10, tokenDecimals.value)],
        value: BigInt(croPrice.value?.amount || 0n)
    })
    */
}
loadTokenInfo()
</script>
<style lang="scss">
.v-row {
    width: 100%;
}

.sloth-token img {
  width: 100%;
  height: 100%;
  border-radius: 50%; /* Makes the image circular */
  animation: rotate3d 3s infinite linear; /* Applies the animation */
}

@keyframes rotate3d {
  0% {
    transform: rotateY(0deg); /* Starts with the front side visible */
  }
  50% {
    transform: rotateY(180deg); /* Flips to the back side */
  }
  100% {
    transform: rotateY(360deg); /* Completes the full rotation */
  }
}
</style>