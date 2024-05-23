import { defineChain } from 'viem'

export const evm = defineChain({
  id: 9_001,
  name: 'Evmos',
  nativeCurrency: {
    decimals: 18,
    name: 'Evmos',
    symbol: 'EVMOS',
  },
  rpcUrls: {
    default: { http: ['https://evmos-evm-rpc.publicnode.com'] },
  },
  blockExplorers: {
    default: {
      name: 'Evmos Block Explorer',
      url: 'https://escan.live',
    },
  },
})

// https://evmos-evm-rpc.publicnode.com