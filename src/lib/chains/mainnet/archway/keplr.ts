
import type { ChainInfo } from '@keplr-wallet/types'

export const keplr: ChainInfo = {
  "bech32Config": {
    "bech32PrefixAccAddr": "archway",
    "bech32PrefixAccPub": "archwaypub",
    "bech32PrefixConsAddr": "archwayvalcons",
    "bech32PrefixConsPub": "archwayvalconspub",
    "bech32PrefixValAddr": "archwayvaloper",
    "bech32PrefixValPub": "archwayvaloperpub"
  },
  "bip44": {
    "coinType": 118
  },
  "chainId": "archway-1",
  "chainName": "Archway",
  "chainSymbolImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/chain.png",
  "currencies": [
    {
      "coinDecimals": 18,
      "coinDenom": "ARCH",
      "coinGeckoId": "archway",
      "coinMinimalDenom": "aarch",
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/aarch.png"
    }
  ],
  "features": ["cosmwasm"],
  "feeCurrencies": [
    {
      "coinDecimals": 18,
      "coinDenom": "ARCH",
      "coinGeckoId": "archway",
      "coinMinimalDenom": "aarch",
      "gasPriceStep": {
        "low": 140000000000,
        "average": 196000000000,
        "high": 225400000000
      },
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/aarch.png"
    }
  ],
  "rest": "https://api.mainnet.archway.io",
  "rpc": "https://rpc.mainnet.archway.io",
  "stakeCurrency": {
    "coinDecimals": 18,
    "coinDenom": "ARCH",
    "coinGeckoId": "archway",
    "coinMinimalDenom": "aarch",
    "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/archway/aarch.png"
  },
  "nodeProvider": {
    "name": "Phi Labs",
    "email": "support@philabs.xyz",
    "website":"https://philabs.xyz"
  }
}