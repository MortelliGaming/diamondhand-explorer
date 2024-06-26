import type { ExplorerChainInfo } from '@/types'
import { evm } from './evm'
import { keplr } from './keplr'
import { erc20Contracts } from './erc20'

export const evmos: ExplorerChainInfo = {
  name: 'evmos',
  evm,
  keplr,
  erc20Contracts,
}