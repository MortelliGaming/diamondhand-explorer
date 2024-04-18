import type { ExplorerChainInfo } from '@/types'
import { evm } from './evm'
import { keplr } from './keplr'

export const crossfi: ExplorerChainInfo = {
  name: 'crossfi',
  isTestnet: true,
  evm,
  keplr
}