import { ChainRegistryClient } from '@chain-registry/client';
import { type Asset } from '@chain-registry/types';
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

const ibcPairs = [
    ['8ball','osmosis'],
    ['acrechain','axelar'],
    ['acrechain','cosmoshub'],
    ['acrechain','evmos'],
    ['acrechain','gravitybridge'],
    ['acrechain','kujira'],
    ['acrechain','oraichain'],
    ['acrechain','osmosis'],
    ['acrechain','stargaze'],
    ['acrechain','stride'],
    ['acrechain','terra'],
    ['acrechain','terra2'],
    ['agoric','archway'],
    ['agoric','axelar'],
    ['agoric','composable'],
    ['agoric','cosmoshub'],
    ['agoric','crescent'],
    ['agoric','evmos'],
    ['agoric','gravitybridge'],
    ['agoric','kujira'],
    ['agoric','noble'],
    ['agoric','omniflixhub'],
    ['agoric','osmosis'],
    ['agoric','persistence'],
    ['agoric','secretnetwork'],
    ['agoric','stride'],
    ['agoric','umee'],
    ['aioz','cosmoshub'],
    ['aioz','osmosis'],
    ['akash','archway'],
    ['akash','cosmoshub'],
    ['akash','crescent'],
    ['akash','cryptoorgchain'],
    ['akash','doravota'],
    ['akash','irisnet'],
    ['akash','juno'],
    ['akash','kujira'],
    ['akash','omniflixhub'],
    ['akash','osmosis'],
    ['akash','persistence'],
    ['akash','regen'],
    ['akash','secretnetwork'],
    ['akash','sentinel'],
    ['akash','sifchain'],
    ['akash','starname'],
    ['akash','terra2'],
    ['andromeda','archway'],
    ['andromeda','injective'],
    ['andromeda','kujira'],
    ['andromeda','secretnetwork'],
    ['andromeda','terra2'],
    ['archway','axelar'],
    ['archway','bitcanna'],
    ['archway','bitsong'],
    ['archway','cosmoshub'],
    ['archway','decentr'],
    ['archway','doravota'],
    ['archway','dymension'],
    ['archway','gravitybridge'],
    ['archway','jackal'],
    ['archway','juno'],
    ['archway','kujira'],
    ['archway','neutron'],
    ['archway','noble'],
    ['archway','nois'],
    ['archway','omniflixhub'],
    ['archway','osmosis'],
    ['archway','planq'],
    ['archway','quicksilver'],
    ['archway','qwoyn'],
    ['archway','secretnetwork'],
    ['archway','terra2'],
    ['archway','umee'],
    ['archway','vidulum'],
    ['arkh','osmosis'],
    ['assetmantle','juno'],
    ['assetmantle','kujira'],
    ['assetmantle','okexchain'],
    ['assetmantle','osmosis'],
    ['aura','axelar'],
    ['aura','cosmoshub'],
    ['aura','kava'],
    ['aura','noble'],
    ['aura','nois'],
    ['aura','osmosis'],
    ['aura','stargaze'],
    ['axelar','bitsong'],
    ['axelar','celestia'],
    ['axelar','chain4energy'],
    ['axelar','composable'],
    ['axelar','coreum'],
    ['axelar','cosmoshub'],
    ['axelar','crescent'],
    ['axelar','dymension'],
    ['axelar','empowerchain'],
    ['axelar','evmos'],
    ['axelar','fxcore'],
    ['axelar','haqq'],
    ['axelar','impacthub'],
    ['axelar','injective'],
    ['axelar','jackal'],
    ['axelar','juno'],
    ['axelar','kujira'],
    ['axelar','kyve'],
    ['axelar','migaloo'],
    ['axelar','neutron'],
    ['axelar','nibiru'],
    ['axelar','odin'],
    ['axelar','omniflixhub'],
    ['axelar','osmosis'],
    ['axelar','provenance'],
    ['axelar','saga'],
    ['axelar','secretnetwork'],
    ['axelar','sei'],
    ['axelar','shido'],
    ['axelar','sommelier'],
    ['axelar','stride'],
    ['axelar','terra2'],
    ['axelar','umee'],
    ['bandchain','comdex'],
    ['bandchain','coreum'],
    ['bandchain','osmosis'],
    ['beezee','osmosis'],
    ['bitcanna','bitsong'],
    ['bitcanna','cosmoshub'],
    ['bitcanna','juno'],
    ['bitcanna','osmosis'],
    ['bitsong','cosmoshub'],
    ['bitsong','juno'],
    ['bitsong','osmosis'],
    ['bluzelle','osmosis'],
    ['bostrom','osmosis'],
    ['canto','carbon'],
    ['canto','composable'],
    ['canto','osmosis'],
    ['carbon','cosmoshub'],
    ['carbon','evmos'],
    ['carbon','irisnet'],
    ['carbon','kujira'],
    ['carbon','osmosis'],
    ['carbon','stargaze'],
    ['carbon','stride'],
    ['carbon','terra2'],
    ['celestia','composable'],
    ['celestia','dymension'],
    ['celestia','evmos'],
    ['celestia','injective'],
    ['celestia','kava'],
    ['celestia','neutron'],
    ['celestia','osmosis'],
    ['celestia','pryzm'],
    ['celestia','secretnetwork'],
    ['celestia','stargaze'],
    ['celestia','stride'],
    ['celestia','terra2'],
    ['celestia','umee'],
    ['cerberus','osmosis'],
    ['chain4energy','osmosis'],
    ['cheqd','gravitybridge'],
    ['cheqd','osmosis'],
    ['cheqd','secretnetwork'],
    ['cheqd','terra2'],
    ['chihuahua','juno'],
    ['chihuahua','migaloo'],
    ['chihuahua','neutron'],
    ['chihuahua','okexchain'],
    ['chihuahua','osmosis'],
    ['chihuahua','persistence'],
    ['chihuahua','secretnetwork'],
    ['chihuahua','stafihub'],
    ['cifer','cosmoshub'],
    ['cifer','osmosis'],
    ['comdex','crescent'],
    ['comdex','juno'],
    ['comdex','kujira'],
    ['comdex','migaloo'],
    ['comdex','osmosis'],
    ['comdex','persistence'],
    ['comdex','secretnetwork'],
    ['comdex','stride'],
    ['comdex','terra2'],
    ['composable','cosmoshub'],
    ['composable','crescent'],
    ['composable','evmos'],
    ['composable','injective'],
    ['composable','juno'],
    ['composable','kujira'],
    ['composable','neutron'],
    ['composable','osmosis'],
    ['composable','quicksilver'],
    ['composable','secretnetwork'],
    ['composable','stargaze'],
    ['composable','stride'],
    ['conscious','osmosis'],
    ['coreum','cosmoshub'],
    ['coreum','doravota'],
    ['coreum','dydx'],
    ['coreum','evmos'],
    ['coreum','gravitybridge'],
    ['coreum','kava'],
    ['coreum','kujira'],
    ['coreum','noble'],
    ['coreum','osmosis'],
    ['coreum','secretnetwork'],
    ['cosmoshub','crescent'],
    ['cosmoshub','cryptoorgchain'],
    ['cosmoshub','doravota'],
    ['cosmoshub','dymension'],
    ['cosmoshub','emoney'],
    ['cosmoshub','empowerchain'],
    ['cosmoshub','evmos'],
    ['cosmoshub','fxcore'],
    ['cosmoshub','haqq'],
    ['cosmoshub','impacthub'],
    ['cosmoshub','injective'],
    ['cosmoshub','irisnet'],
    ['cosmoshub','juno'],
    ['cosmoshub','kava'],
    ['cosmoshub','kichain'],
    ['cosmoshub','kujira'],
    ['cosmoshub','likecoin'],
    ['cosmoshub','lumnetwork'],
    ['cosmoshub','neutron'],
    ['cosmoshub','noble'],
    ['cosmoshub','omniflixhub'],
    ['cosmoshub','oraichain'],
    ['cosmoshub','osmosis'],
    ['cosmoshub','persistence'],
    ['cosmoshub','planq'],
    ['cosmoshub','point'],
    ['cosmoshub','pryzm'],
    ['cosmoshub','quicksilver'],
    ['cosmoshub','realio'],
    ['cosmoshub','regen'],
    ['cosmoshub','secretnetwork'],
    ['cosmoshub','sei'],
    ['cosmoshub','sentinel'],
    ['cosmoshub','sifchain'],
    ['cosmoshub','stafihub'],
    ['cosmoshub','stargaze'],
    ['cosmoshub','starname'],
    ['cosmoshub','stride'],
    ['cosmoshub','teritori'],
    ['cosmoshub','terra2'],
    ['cosmoshub','umee'],
    ['cosmoshub','uptick'],
    ['crescent','cryptoorgchain'],
    ['crescent','evmos'],
    ['crescent','gravitybridge'],
    ['crescent','injective'],
    ['crescent','irisnet'],
    ['crescent','jackal'],
    ['crescent','juno'],
    ['crescent','kujira'],
    ['crescent','mars'],
    ['crescent','noble'],
    ['crescent','okexchain'],
    ['crescent','osmosis'],
    ['crescent','persistence'],
    ['crescent','secretnetwork'],
    ['crescent','stargaze'],
    ['crescent','stride'],
    ['crescent','terra'],
    ['crescent','terra2'],
    ['crescent','umee'],
    ['cronos','kava'],
    ['cryptoorgchain','evmos'],
    ['cryptoorgchain','irisnet'],
    ['cryptoorgchain','osmosis'],
    ['cryptoorgchain','persistence'],
    ['cryptoorgchain','regen'],
    ['cryptoorgchain','sentinel'],
    ['cryptoorgchain','sifchain'],
    ['cryptoorgchain','starname'],
    ['cudos','osmosis'],
    ['decentr','osmosis'],
    ['decentr','sentinel'],
    ['decentr','terra2'],
    ['desmos','osmosis'],
    ['dhealth','osmosis'],
    ['dig','juno'],
    ['dig','osmosis'],
    ['doravota','dydx'],
    ['doravota','injective'],
    ['doravota','nolus'],
    ['doravota','osmosis'],
    ['doravota','sei'],
    ['dydx','evmos'],
    ['dydx','kava'],
    ['dydx','kujira'],
    ['dydx','neutron'],
    ['dydx','noble'],
    ['dydx','osmosis'],
    ['dydx','persistence'],
    ['dydx','stride'],
    ['dydx','terra2'],
    ['dydx','umee'],
    ['dymension','evmos'],
    ['dymension','kava'],
    ['dymension','kujira'],
    ['dymension','neutron'],
    ['dymension','nim'],
    ['dymension','noble'],
    ['dymension','osmosis'],
    ['dymension','secretnetwork'],
    ['dymension','stride'],
    ['dyson','osmosis'],
    ['echelon','osmosis'],
    ['emoney','irisnet'],
    ['emoney','juno'],
    ['emoney','osmosis'],
    ['empowerchain','osmosis'],
    ['evmos','gateway'],
    ['evmos','gravitybridge'],
    ['evmos','injective'],
    ['evmos','kava'],
    ['evmos','kujira'],
    ['evmos','noble'],
    ['evmos','osmosis'],
    ['evmos','secretnetwork'],
    ['evmos','stargaze'],
    ['evmos','stride'],
    ['evmos','tgrade'],
    ['fetchhub','osmosis'],
    ['furya','juno'],
    ['furya','kujira'],
    ['furya','noble'],
    ['furya','osmosis'],
    ['furya','terra2'],
    ['fxcore','osmosis'],
    ['fxcore','pundix'],
    ['galaxy','osmosis'],
    ['gateway','injective'],
    ['gateway','kujira'],
    ['gateway','osmosis'],
    ['gateway','stargaze'],
    ['genesisl1','osmosis'],
    ['gitopia','osmosis'],
    ['gravitybridge','haqq'],
    ['gravitybridge','kujira'],
    ['gravitybridge','nyx'],
    ['gravitybridge','osmosis'],
    ['gravitybridge','persistence'],
    ['gravitybridge','planq'],
    ['gravitybridge','secretnetwork'],
    ['gravitybridge','unification'],
    ['haqq','kava'],
    ['haqq','noble'],
    ['haqq','osmosis'],
    ['humans','osmosis'],
    ['impacthub','noble'],
    ['impacthub','osmosis'],
    ['impacthub','sifchain'],
    ['imversed','osmosis'],
    ['injective','kava'],
    ['injective','kujira'],
    ['injective','migaloo'],
    ['injective','neutron'],
    ['injective','noble'],
    ['injective','nois'],
    ['injective','odin'],
    ['injective','oraichain'],
    ['injective','osmosis'],
    ['injective','persistence'],
    ['injective','pryzm'],
    ['injective','secretnetwork'],
    ['injective','sommelier'],
    ['injective','stride'],
    ['injective','terra2'],
    ['injective','umee'],
    ['injective','xpla'],
    ['irisnet','osmosis'],
    ['irisnet','persistence'],
    ['irisnet','regen'],
    ['irisnet','sentinel'],
    ['irisnet','sifchain'],
    ['irisnet','stafihub'],
    ['irisnet','starname'],
    ['irisnet','uptick'],
    ['jackal','kujira'],
    ['jackal','osmosis'],
    ['jackal','secretnetwork'],
    ['juno','kujira'],
    ['juno','mars'],
    ['juno','migaloo'],
    ['juno','neutron'],
    ['juno','noble'],
    ['juno','nois'],
    ['juno','okexchain'],
    ['juno','osmosis'],
    ['juno','persistence'],
    ['juno','quicksilver'],
    ['juno','secretnetwork'],
    ['juno','sifchain'],
    ['juno','stargaze'],
    ['juno','stride'],
    ['juno','terra'],
    ['juno','terra2'],
    ['kava','kujira'],
    ['kava','migaloo'],
    ['kava','neutron'],
    ['kava','onex'],
    ['kava','osmosis'],
    ['kava','persistence'],
    ['kava','sei'],
    ['kava','terra2'],
    ['kava','umee'],
    ['kichain','osmosis'],
    ['konstellation','osmosis'],
    ['kujira','mars'],
    ['kujira','migaloo'],
    ['kujira','neutron'],
    ['kujira','noble'],
    ['kujira','nomic'],
    ['kujira','odin'],
    ['kujira','omniflixhub'],
    ['kujira','osmosis'],
    ['kujira','persistence'],
    ['kujira','planq'],
    ['kujira','realio'],
    ['kujira','regen'],
    ['kujira','secretnetwork'],
    ['kujira','sommelier'],
    ['kujira','stafihub'],
    ['kujira','stargaze'],
    ['kujira','stride'],
    ['kujira','teritori'],
    ['kujira','terra2'],
    ['kyve','osmosis'],
    ['lambda','osmosis'],
    ['likecoin','osmosis'],
    ['lumenx','osmosis'],
    ['lumnetwork','osmosis'],
    ['mars','neutron'],
    ['mars','osmosis'],
    ['mars','terra2'],
    ['medasdigital','osmosis'],
    ['medasdigital','sentinel'],
    ['meme','osmosis'],
    ['microtick','osmosis'],
    ['migaloo','noble'],
    ['migaloo','osmosis'],
    ['migaloo','secretnetwork'],
    ['migaloo','sei'],
    ['migaloo','stargaze'],
    ['migaloo','terra'],
    ['migaloo','terra2'],
    ['migaloo','umee'],
    ['neutron','noble'],
    ['neutron','nois'],
    ['neutron','nolus'],
    ['neutron','nomic'],
    ['neutron','osmosis'],
    ['neutron','persistence'],
    ['neutron','pryzm'],
    ['neutron','saga'],
    ['neutron','secretnetwork'],
    ['neutron','sei'],
    ['neutron','stargaze'],
    ['neutron','stride'],
    ['neutron','terra2'],
    ['nibiru','noble'],
    ['nibiru','osmosis'],
    ['noble','omniflixhub'],
    ['noble','onex'],
    ['noble','oraichain'],
    ['noble','osmosis'],
    ['noble','persistence'],
    ['noble','provenance'],
    ['noble','pryzm'],
    ['noble','secretnetwork'],
    ['noble','sei'],
    ['noble','stargaze'],
    ['noble','teritori'],
    ['noble','terra2'],
    ['noble','umee'],
    ['nois','osmosis'],
    ['nois','sei'],
    ['nois','stargaze'],
    ['nolus','osmosis'],
    ['nolus','secretnetwork'],
    ['nomic','osmosis'],
    ['nyx','osmosis'],
    ['odin','osmosis'],
    ['okexchain','vidulum'],
    ['omniflixhub','osmosis'],
    ['onex','osmosis'],
    ['onomy','osmosis'],
    ['oraichain','osmosis'],
    ['oraichain','secretnetwork'],
    ['osmosis','panacea'],
    ['osmosis','passage'],
    ['osmosis','persistence'],
    ['osmosis','planq'],
    ['osmosis','provenance'],
    ['osmosis','pryzm'],
    ['osmosis','pundix'],
    ['osmosis','pylons'],
    ['osmosis','quasar'],
    ['osmosis','quicksilver'],
    ['osmosis','qwoyn'],
    ['osmosis','realio'],
    ['osmosis','rebus'],
    ['osmosis','regen'],
    ['osmosis','rizon'],
    ['osmosis','saga'],
    ['osmosis','scorum'],
    ['osmosis','secretnetwork'],
    ['osmosis','seda'],
    ['osmosis','sei'],
    ['osmosis','sentinel'],
    ['osmosis','sge'],
    ['osmosis','shareledger'],
    ['osmosis','shentu'],
    ['osmosis','shido'],
    ['osmosis','sifchain'],
    ['osmosis','sommelier'],
    ['osmosis','source'],
    ['osmosis','stafihub'],
    ['osmosis','stargaze'],
    ['osmosis','starname'],
    ['osmosis','stride'],
    ['osmosis','teritori'],
    ['osmosis','terra'],
    ['osmosis','terra2'],
    ['osmosis','tgrade'],
    ['osmosis','umee'],
    ['osmosis','unification'],
    ['osmosis','vidulum'],
    ['osmosis','xpla'],
    ['persistence','quicksilver'],
    ['persistence','regen']
];

const supportedChains = Array.from(new Set(ibcPairs.flatMap(a => a)))

export const useCoinsStore = defineStore('coins', () => {
    const generatedCosmosAssets = ref([]) as Ref<Asset[]>
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
        return generatedCosmosAssets.value
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
            const displayDenom = coinDef.symbol
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
    async function generateCosmosChainregistryAssets() {
        try {
            await chainRegistryClient.value.fetchUrls();
        } catch { /** */}
        generatedCosmosAssets.value = []
        const { availableChainNames } = storeToRefs(useBlockchainStore())
        supportedChains.forEach(chainName => {
            if(!availableChainNames.value.includes(chainName)) {
                return;
            }
            const assets = chainRegistryClient.value.getGeneratedAssetLists(chainName).flatMap(a => a.assets)
            // const assets2 = chainRegistryClient.value.getChainAssetList(chainName)?.assets || []
            generatedCosmosAssets.value = generatedCosmosAssets.value.concat(assets);
        })
        return true;
    }

    async function init() {
        await generateCosmosChainregistryAssets();
        const { availableChains, chainClients } = storeToRefs(useBlockchainStore())
        availableChains.value?.forEach(async (chainConfig) => {
            isLoadingERC20Tokens.value[chainConfig.name] = true;
            const viemClient = chainClients.value[chainConfig.name]?.viemClient
            for(const erc20Contract of chainConfig.erc20Contracts || []) {
                try {
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
                } catch {
                    console.log('err fetching token info: ' + erc20Contract)
                }
            }
            isLoadingERC20Tokens.value[chainConfig.name] = false;
        });
        return true
    }
    return { 
        isLoadingERC20Tokens,
        erc20Assets,
        generatedCosmosAssets,
        getCoin,
        findAssetInCosmosAssets,
        findAssetInDenomsMetadata,
        findAssetInChainconfig,
        explorerAssetFromBalance,
        findAsset,
        init,
        generateCosmosChainregistryAssets,
    }
})