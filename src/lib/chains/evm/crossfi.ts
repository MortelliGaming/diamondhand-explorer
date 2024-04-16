import { defineChain } from 'viem'

export const crossfi = /*#__PURE__*/ defineChain({
  id: 4157,
  name: 'CrossFi Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Crossfi Testnet',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: { http: ['https://evmrpc-crossfi-testnet.diamondhand.capital'] },
  },
  blockExplorers: {
    default: {
      name: 'CrossFi Testnet Explorer',
      url: 'https://explorer.diamondhand.capital',
      apiUrl: '',
    },
  },
  contracts: {
    /*
    * keep as example
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
      blockCreated: 1963112,
    },
    */
  },
})