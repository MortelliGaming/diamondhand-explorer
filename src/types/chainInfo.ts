import { Chain } from "viem"
import type {ChainInfo} from '@keplr-wallet/types';

export type ExplorerChainInfo = {
    evm: Chain|null,
    keplr: ChainInfo|null
}