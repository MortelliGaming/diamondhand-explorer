import type { ExplorerChainInfo } from '@/types'
import * as testnet from './testnet'
import * as mainnet from './mainnet'


export type Testnets = keyof typeof testnet
export type Mainnets = keyof typeof mainnet

// Augment isTestnet to the networks
const mainnets = Object.keys(mainnet).reduce((acc: {[id: string]: ExplorerChainInfo}, item) => {
    const key = item as (Mainnets)
    if(key) {
        acc[item] = {
            isTestnet: false,
            ...mainnet[key]
        }
    }
    return acc;
}, {} as {[id: string]: ExplorerChainInfo});

const testnets = Object.keys(testnet).reduce((acc: {[id: string]: ExplorerChainInfo}, item) => {
    const key = item as (Testnets)
    if(key) {
        acc[item] = {
            isTestnet: true,
            ...testnet[key]
        }
    }
    return acc;
}, {} as {[id: string]: ExplorerChainInfo});

export const blockchainConfigs = {
    networks: {
        ...testnets,
        ...mainnets
    }
} as {
    networks: { [id in (Testnets|Mainnets)]: ExplorerChainInfo }
}