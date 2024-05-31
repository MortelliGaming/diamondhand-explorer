
import type { ChainInfo } from '@keplr-wallet/types'

export const keplr: ChainInfo = {
  "rpc": "https://crossfitestnetrpc.diamondhand.capital",
  "rest": "https://crossfitestnetapi.diamondhand.capital",
  "chainId": "crossfi-evm-testnet-1",
  "chainName": "CrossFi Testnet",
  "chainSymbolImageUrl": "https://crossfi.org/wp-content/uploads/2024/03/Icon-version-%E2%80%93-Color-CROSSFI-CHAIN.png",
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
  "features": ["eth-address-gen", "eth-key-sign"]
}