import type { ExplorerChainInfo } from '@/types'
import * as testnet from './testnet'

export const blockchainConfigs = {
    testnet,
    mainnet: {}
} as {
    testnet: {[id: string]: ExplorerChainInfo},
    mainnet: {[id: string]: ExplorerChainInfo}
}