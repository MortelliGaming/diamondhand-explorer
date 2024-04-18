import type { ExplorerChainInfo } from '@/types'
import * as testnet from './testnet'
import * as mainnet from './mainnet'


export type Testnets = keyof typeof testnet
export type Mainnets = keyof typeof mainnet

export const blockchainConfigs = {
    networks: {
        ...testnet,
        ...mainnet
    }
} as {
    networks: { [id in (Testnets|Mainnets)]: ExplorerChainInfo }
}