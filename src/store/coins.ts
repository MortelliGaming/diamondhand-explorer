import { ChainRegistryClient } from '@chain-registry/client';
import { type AssetList } from '@chain-registry/types';
import { defineStore } from 'pinia';
import { type Ref, ref } from 'vue';


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
    
    const coins = ref([])
    const generatedCosmosAssets = ref({}) as Ref<Record<string, AssetList[]>>

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
        await chainRegistryClient.value.fetchUrls().catch(() => { /* */});
        supportedChains.forEach(chainName => {
            generatedCosmosAssets.value[chainName] = chainRegistryClient.value.getGeneratedAssetLists(chainName);
        })
    }
    return { 
        coins,
        getCoin,
        init
    }
})