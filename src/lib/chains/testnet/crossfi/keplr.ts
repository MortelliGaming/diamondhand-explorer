
import type { ChainInfo } from '@keplr-wallet/types'

export const keplr: ChainInfo = {
  "rpc": "https://tendermint-rpc.testnet.ms/",
  "rest": "https://cosmos-api.testnet.ms/",
  "chainId": "crossfi-evm-testnet-1",
  "chainName": "CrossFi Testnet",
  "chainSymbolImageUrl": "https://media.licdn.com/dms/image/D4E0BAQEs0PUwKhAw9g/company-logo_200_200/0/1699597847512/crossfichain_logo?e=2147483647&v=beta&t=36793GMlIOqcltdR6gIdZhOpT8OpANC52XwQ4gewqmg",
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
      "coinDenom": "MPX",
      "coinMinimalDenom": "mpx",
      "coinDecimals": 18
    },{
      "coinDenom": "XFI",
      "coinMinimalDenom": "xfi",
      "coinDecimals": 18
    },{
      "coinDenom": "XFT",
      "coinMinimalDenom": "xft",
      "coinDecimals": 18
    },{
      "coinDenom": "eMPX",
      "coinMinimalDenom": "empx",
      "coinDecimals": 18
    },{
      "coinDenom": "exe",
      "coinMinimalDenom": "EXE",
      "coinDecimals": 18
    },{
      "coinDenom": "xUSD",
      "coinMinimalDenom": "xusd",
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
  "features": ["eth-address-gen", "eth-key-sign", "ibc-transfer", "ibc-go", "cosmwasm"]
}