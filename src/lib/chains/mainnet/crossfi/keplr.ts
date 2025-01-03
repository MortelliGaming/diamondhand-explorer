
import type { ChainInfo } from '@keplr-wallet/types'

export const keplr: ChainInfo = {
  "rpc": "https://crossfi-mainnet-rpc.itrocket.net",
  "rest": "https://crossfi-mainnet-api.itrocket.net",
  "chainId": "crossfi-mainnet-1",
  "chainName": "Crossfi Mainnet",
  "chainSymbolImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/crossfi-mainnet/chain.png",
  "nodeProvider": {
    "name": "CrossFi Foundation",
    "website":"https://crossfi.org/",
    "email": "info@crossfi.org"
  },
  "stakeCurrency": {
    "coinDenom": "MPX",
    "coinMinimalDenom": "mpx",
    "coinDecimals": 18
  },
  "bip44": {
    "coinType": 60
  },
  "bech32Config": {
    "bech32PrefixAccAddr": "mx",
    "bech32PrefixAccPub": "mxpub",
    "bech32PrefixValAddr": "mxvaloper",
    "bech32PrefixValPub": "mxvaloperpub",
    "bech32PrefixConsAddr": "mxvalcons",
    "bech32PrefixConsPub": "mxvalconspub"
  },
  "currencies": [
    {
      "coinDenom": "XFI",
      "coinMinimalDenom": "xfi",
      "coinDecimals": 18
    },
    {
      "coinDenom": "MPX",
      "coinMinimalDenom": "mpx",
      "coinDecimals": 18
    }
  ],
  "feeCurrencies": [
    {
      "coinDenom": "XFI",
      "coinMinimalDenom": "xfi",
      "coinDecimals": 18,
      "gasPriceStep": {
        "low": 10000000000,
        "average": 15000000000,
        "high": 20000000000
      }
    },
    {
      "coinDenom": "MPX",
      "coinMinimalDenom": "mpx",
      "coinDecimals": 18,
      "gasPriceStep": {
        "low": 10000000000,
        "average": 15000000000,
        "high": 20000000000
      }
    }
  ],
  "beta":false,
  "features": ["eth-address-gen", "eth-key-sign"]
}