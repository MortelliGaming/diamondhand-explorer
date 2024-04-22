import { type Block, type Chain, type PublicClient, type Transaction, createPublicClient, http } from "viem"

export type EVMHelperHelperPublic = {
    ConnectClients: (keplrConfigs: Chain[]) => void
    GetBlock: (chainId: string, height?: number) => Promise<Block|undefined>
    GetTransaction: (chainId: string, txHash: `0x${string}`) => Promise<Transaction|undefined>
}

export class EVMHelper {
    private viemClients: {
        [id: string]: PublicClient
    }

    constructor(evmConfigs: Chain[]) {
        this.viemClients = {}
        this.ConnectClients(evmConfigs)
    }

    public async ConnectClients(evmConfigs: Chain[]) {
        for(const chainInfo of evmConfigs){
            try {
                if(this.viemClients[chainInfo.id]) {
                    delete this.viemClients[chainInfo.id]
                }
                this.viemClients[chainInfo.id] = createPublicClient({
                    chain: chainInfo,
                    transport: http()
                })
                console.log('evm client created' + chainInfo.id)
            } catch(err) { 
                console.error('error connection EVM ' + chainInfo.id + ': ' + err)
            }
        }
    }

    public async GetBlock(chainId: string, height?: number) {
        if(this.viemClients[chainId]) {
            return this.viemClients[chainId].getBlock({blockNumber: BigInt(height || 0)});
        }
    }
    public async GetTransaction(chainId: string, txHash: `0x${string}`) {
        if(this.viemClients[chainId]) {
            return this.viemClients[chainId].getTransaction({hash: txHash});
        }
    }
}