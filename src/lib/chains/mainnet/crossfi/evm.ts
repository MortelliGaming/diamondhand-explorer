import { Chain, defineChain } from 'viem'

export const evm: Chain = defineChain({
  id: 4158,
  name: 'Crossfi Mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Crossfi Mainnet',
    symbol: 'XFI',
  },
  rpcUrls: {
    default: { http: ['https://rpc.mainnet.ms'] },
  },
  blockExplorers: {
    default: {
      name: 'CrossFi Explorer',
      url: 'https://xfiscan.com',
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