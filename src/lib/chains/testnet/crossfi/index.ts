import type { ExplorerChainInfo } from '@/types'
import { evm } from './evm'
import { keplr } from './keplr'
import { erc20Contracts } from './erc20'

export const crossfi: ExplorerChainInfo = {
  name: 'crossfi',
  evm,
  keplr,
  erc20Contracts,
}