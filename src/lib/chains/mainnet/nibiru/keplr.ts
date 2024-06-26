
import type { ChainInfo } from '@keplr-wallet/types'

export const keplr: ChainInfo = {
  "chainId": "cataclysm-1",
  "chainName": "Nibiru",
  "chainSymbolImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cataclysm/chain.png",
  "rpc": "https://nibiru.rpc.kjnodes.com",
  "rest": "https://nibiru.api.kjnodes.com",
  "nodeProvider": {
    "name": "Nibiru Team",
    "email": "dev@nibiru.org",
    "website": "https://nibiru.fi"
  },
  "bip44": {
    "coinType": 118
  },
  "bech32Config": {
    "bech32PrefixAccAddr": "nibi",
    "bech32PrefixAccPub": "nibipub",
    "bech32PrefixValAddr": "nibivaloper",
    "bech32PrefixValPub": "nibivaloperpub",
    "bech32PrefixConsAddr": "nibivalcons",
    "bech32PrefixConsPub": "nibivalconspub"
  },
  "currencies": [
    {
      "coinDenom": "NIBI",
      "coinMinimalDenom": "unibi",
      "coinDecimals": 6,
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cataclysm/chain.png"
    }
  ],
  "feeCurrencies": [
    {
      "coinDenom": "NIBI",
      "coinMinimalDenom": "unibi",
      "coinDecimals": 6,
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cataclysm/chain.png",
      "gasPriceStep": {
        "low": 0.025,
        "average": 0.05,
        "high": 0.1
      }
    }
  ],
  "stakeCurrency": {
    "coinDenom": "NIBI",
    "coinMinimalDenom": "unibi",
    "coinDecimals": 6,
    "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/cataclysm/chain.png"
  },
  "features": [
    "cosmwasm"
  ]
}