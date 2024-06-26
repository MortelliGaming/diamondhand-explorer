
import type { ChainInfo } from '@keplr-wallet/types'

export const keplr: ChainInfo = {
  "rpc": "https://evmos-rpc.polkachu.com/",
  "rest": "https://evmos-api.polkachu.com/",
  "chainId": "evmos_9001-2",
  "chainName": "Evmos",
  "evm": {
    "chainId": 9001,
    "rpc": "https://evm-evmos.keplr.app"
  },
  "chainSymbolImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/evmos_9001/chain.png",
  "stakeCurrency": {
    "coinDenom": "EVMOS",
    "coinMinimalDenom": "aevmos",
    "coinDecimals": 18,
    "coinGeckoId": "evmos",
    "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/evmos_9001/aevmos.png"
  },
  "walletUrl": "https://wallet.keplr.app/chains/evmos",
  "walletUrlForStaking": "https://wallet.keplr.app/chains/evmos",
  "bip44": {
    "coinType": 60
  },
  "bech32Config": {
    "bech32PrefixAccAddr": "evmos",
    "bech32PrefixAccPub": "evmospub",
    "bech32PrefixValAddr": "evmosvaloper",
    "bech32PrefixValPub": "evmosvaloperpub",
    "bech32PrefixConsAddr": "evmosvalcons",
    "bech32PrefixConsPub": "evmosvalconspub"
  },
  "currencies": [
    {
      "coinDenom": "EVMOS",
      "coinMinimalDenom": "aevmos",
      "coinDecimals": 18,
      "coinGeckoId": "evmos",
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/evmos_9001/aevmos.png"
    }
  ],
  "feeCurrencies": [
    {
      "coinDenom": "EVMOS",
      "coinMinimalDenom": "aevmos",
      "coinDecimals": 18,
      "coinGeckoId": "evmos",
      "coinImageUrl": "https://raw.githubusercontent.com/chainapsis/keplr-chain-registry/main/images/evmos_9001/aevmos.png",
      "gasPriceStep": {
        "low": 80000000000,
        "average": 80000000000,
        "high": 80000000000
      }
    }
  ],
  "features": ["eth-address-gen", "eth-key-sign"]
}