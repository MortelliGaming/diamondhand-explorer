import { ChainRegistryClient } from '@chain-registry/client';
import { type AssetList } from '@chain-registry/types';
import { defineStore, storeToRefs } from 'pinia';
import { type Ref, ref } from 'vue';

import { useBlockchainStore } from './blockchain';
import { erc20Abi } from 'viem';


const supportedChains = ['osmosis', 'cosmoshub', 'archway', 'nibiru', 'axelar', 'agoric', 'umee', 'cronos', 'evmos'];
const ibcPairs = [
    ['archway', 'osmosis'],
    ['archway', 'axelar'],
    ['archway', 'cosmoshub'],
    ['archway', 'umee'],
    ['archway', 'agoric'],
    ['cosmoshub', 'osmosis'],
    ['cosmoshub', 'axelar'],
    ['cosmoshub', 'umee'],
    ['cosmoshub', 'agoric'],
    ['cosmoshub', 'evmos'],
    ['osmosis', 'nibiru'],
    ['osmosis', 'axelar'],
    ['osmosis', 'agoric'],
    ['osmosis', 'umee'],
    ['osmosis', 'evmos'],
];

export const useCoinsStore = defineStore('coins', () => {
    const generatedCosmosAssets = ref({}) as Ref<Record<string, AssetList[]>>
    const isLoadingERC20Tokens:Ref<Record<string, boolean>> = ref({})
    const erc20Assets: Ref<Record<string, {
        contract: `0x${string}`,
        symbol: string,
        decimals: number,
    }[]>> = ref({})

    const chainRegistryClient = ref(new ChainRegistryClient({
        chainNames: supportedChains,
        ibcNamePairs: ibcPairs
    }));

    function getCoin(denom: string) {
        return Object.values(generatedCosmosAssets.value)
            .flatMap(assets => assets.map(a => a.assets)).flatMap(a => a)
            .find(a => a.denom_units.map(d => d.denom).includes(denom) || a.denom_units.flatMap(d => d.aliases).includes(denom))
    }

    async function init() {
        const { availableChains, chainClients } = storeToRefs(useBlockchainStore())
        await chainRegistryClient.value.fetchUrls().catch(() => { /* */});
        supportedChains.forEach(chainName => {
            generatedCosmosAssets.value[chainName] = chainRegistryClient.value.getGeneratedAssetLists(chainName);
        })
        availableChains.value?.forEach(async (chainConfig) => {
            isLoadingERC20Tokens.value[chainConfig.name] = true;
            const viemClient = chainClients.value[chainConfig.name]?.viemClient
            for(const erc20Contract of chainConfig.erc20Contracts || []) {
                const tokenSymbol = await viemClient?.readContract({
                    address: erc20Contract as `0x${string}`,
                    abi: erc20Abi,
                    functionName: 'symbol',
                    args: [],
                })
                const tokenDecimals = await viemClient?.readContract({
                    address: erc20Contract as `0x${string}`,
                    abi: erc20Abi,
                    functionName: 'decimals',
                    args: [],
                })
                if(!erc20Assets.value[chainConfig.name]) {
                    erc20Assets.value[chainConfig.name] = []
                }
                if(tokenSymbol && tokenDecimals) {
                    erc20Assets.value[chainConfig.name].push({
                        contract: erc20Contract as `0x${string}`,
                        decimals: Number(tokenDecimals),
                        symbol: tokenSymbol.toString()
                    })
                }
            }
            isLoadingERC20Tokens.value[chainConfig.name] = false;
        });
    }
    return { 
        isLoadingERC20Tokens,
        erc20Assets,
        getCoin,
        init
    }
})