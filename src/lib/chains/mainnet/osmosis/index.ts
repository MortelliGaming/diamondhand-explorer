import type { ExplorerChainInfo } from '@/types'
import { keplr } from './keplr'

export const osmosis: ExplorerChainInfo = {
  name: 'osmosis',
  keplr,
  evm: null,
  erc20Contracts: undefined
}