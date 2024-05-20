import { ChainRegistryClient } from '@chain-registry/client';
import { type AssetList } from '@chain-registry/types';
import { defineStore, storeToRefs } from 'pinia';
import { type Ref, ref } from 'vue';

import { useBlockchainStore } from './blockchain';
import { erc20Abi } from 'viem';

export type ExplorerAsset = {
    name: string|undefined,
    description: string|undefined,
    coingeckoId: string|undefined,
    baseAmount: number
    baseDenom: string
    displayAmount: number,
    displayDenom: string,
    interChain: boolean,
    erc20: boolean,
}


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
            .flatMap(assets => assets?.map(a => a.assets)).flatMap(a => a)
            .find(a => a.denom_units.map(d => d.denom).includes(denom) || a.denom_units.flatMap(d => d.aliases).includes(denom))
    }

    function findAssetInCosmosAssets(balance: { amount: string, denom: string}) {
        // find the denom
        const coinDef = getCoin(balance.denom)
        const baseDenomDef = coinDef?.denom_units
            .find(d => d.denom == balance.denom || d.aliases?.includes(balance.denom))
        const displayDenomDef = coinDef?.denom_units
            .find(d => d.denom == coinDef.display || d.aliases?.includes(coinDef.display))

        if(coinDef && baseDenomDef && displayDenomDef) {
            const baseAmount = Number(balance.amount) / Number(Math.pow(10, baseDenomDef.exponent))
            const baseDenom = baseDenomDef.denom
            const displayAmount = baseAmount  / Number(Math.pow(10, displayDenomDef.exponent))
            const displayDenom = displayDenomDef.denom.toUpperCase()
            const interChain: boolean = balance.denom.startsWith('ibc') || false
            const displayCoin = {
                name: coinDef.name,
                description: coinDef.description,
                coingeckoId: coinDef.coingecko_id,
                baseAmount,
                baseDenom,
                displayAmount,
                displayDenom,
                interChain,
                erc20: false,
            } as ExplorerAsset
            return displayCoin
        }
        return undefined;
    }

    function findAssetInChainconfig(balance: { amount: string, denom: string}) {
        const { availableChains } = storeToRefs(useBlockchainStore())
        const denomsMetadata = availableChains.value.flatMap(c => c.keplr?.currencies).filter(c => c != undefined)
            .find(c => c!.coinDenom == balance.denom || c!.coinMinimalDenom == balance.denom)
        if(denomsMetadata) {
            const displayDecimals = denomsMetadata.coinMinimalDenom == balance.denom ? denomsMetadata.coinDecimals : 0
            const baseDecimals = denomsMetadata.coinMinimalDenom == balance.denom ? 0 : denomsMetadata.coinDecimals
            
            const baseAmount = parseFloat(balance.amount) * Math.pow(10, baseDecimals)
            const baseDenom = denomsMetadata.coinMinimalDenom
            const displayAmount = baseAmount  / Number(Math.pow(10, displayDecimals))
            const displayDenom = denomsMetadata.coinDenom.toUpperCase()
            const interChain: boolean = balance.denom.startsWith('ibc') || false

            const displayCoin = {
                name: denomsMetadata.coinDenom,
                description: undefined,
                coingeckoId: denomsMetadata.coinGeckoId,
                baseAmount,
                baseDenom,
                displayAmount,
                displayDenom,
                interChain,
                erc20: false,
            } as ExplorerAsset
            return displayCoin
        }
        return undefined
    }

    function explorerAssetFromBalance(balance: { amount: string, denom: string}) {
        const displayCoin = {
            name: undefined,
            description: undefined,
            coingeckoId: undefined,
            baseAmount: Number(balance.amount),
            baseDenom: balance.denom,
            displayAmount: Number(balance.amount),
            displayDenom: balance.denom,
            interChain: balance.denom.startsWith('ibc'),
            erc20: false
        } as ExplorerAsset
        return displayCoin
    }

    async function findAssetInDenomsMetadata(chainName: string, balance: { amount: string, denom: string}) {
        const { chainClients } = storeToRefs(useBlockchainStore())
        const denomsMetadata = await chainClients.value[chainName]?.cosmosClients?.queryClient.extensions.bank.bank.denomsMetadata()
        const denomDef = denomsMetadata?.find(d => d.denomUnits.map(du => du.denom).includes(balance.denom))
        if(denomDef) {
            const baseAmount = Number(balance.amount) / Number(Math.pow(10, denomDef.denomUnits.find(u => u.denom == denomDef.base)!.exponent))
            const baseDenom = denomDef.base
            const displayAmount = baseAmount  / Number(Math.pow(10, denomDef.denomUnits.find(u => u.denom == denomDef.display)!.exponent))
            const displayDenom = denomDef.display.toUpperCase()
            const interChain: boolean = balance.denom.startsWith('ibc') || false
            const displayCoin = {
                name: denomDef.name,
                description: denomDef.description,
                coingeckoId: undefined,
                baseAmount,
                baseDenom,
                displayAmount,
                displayDenom,
                interChain,
                erc20: false,
            } as ExplorerAsset
            return displayCoin
        }
        return undefined
    }

    async function findAsset(balance: {amount: string, denom: string}, chainName: string) {
        let result: ExplorerAsset|undefined = undefined;
        let displayCoin = findAssetInCosmosAssets(balance)
        if(displayCoin) {
            result = displayCoin
        } else {
            displayCoin = findAssetInChainconfig(balance)
            // if still not found
            // denom info from chainconfig
            if(displayCoin) {
                result = displayCoin
            } else {
                displayCoin = await findAssetInDenomsMetadata(chainName, balance)
                if(displayCoin) {
                    result = displayCoin
                } else {
                    // if still not found use denom and amount
                    const displayCoin = explorerAssetFromBalance(balance);
                    result = displayCoin
                }
            }
        }
        return result
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
        findAssetInCosmosAssets,
        findAssetInDenomsMetadata,
        findAssetInChainconfig,
        explorerAssetFromBalance,
        findAsset,
        init
    }
})