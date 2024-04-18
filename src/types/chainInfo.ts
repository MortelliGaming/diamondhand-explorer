import { Chain } from "viem"
import type {ChainInfo} from '@keplr-wallet/types';

export type ExplorerChainInfo = {
    name: string,
    isTestnet: boolean,
    evm: Chain|null,
    keplr: ChainInfo|null
}