import { defineStore, storeToRefs } from 'pinia';
import { type Ref, computed, ref, ComputedRef } from 'vue';

import { blockchainConfigs, type Mainnets, type Testnets } from '@/lib/chains'

import { PublicClient, createPublicClient, http } from 'viem';
import { ExplorerChainInfo } from '@/types';
import { useAppStore } from './app';
import { CosmosHelper, CosmosNewBlockheaderEvent, EVMHelper, EVMHelperHelperPublic, EvmTxEvent, type CosmosHelperPublic } from '@/lib/http';
import { type BlockchainResponse} from '@cosmjs/tendermint-rpc';
import type { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';

import { type QueryValidatorsResponse, QueryParamsResponse as QueryStakingParamsResponse } from 'cosmjs-types/cosmos/staking/v1beta1/query';
import { QueryParamsResponse as QuerySlashingParamsResponse } from 'cosmjs-types/cosmos/slashing/v1beta1/query';
import { toBech32, fromBase64, toHex, fromBech32 } from '@cosmjs/encoding';

import { decodePubkey } from '@cosmjs/proto-signing';
import { sha256 } from '@cosmjs/crypto';
import { fetchAvatar } from '@/lib/http/keybase';
import { BondStatus } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import { Pubkey } from '@cosmjs/amino';

(BigInt.prototype as any).toJSON = function () {
    return this.toString();
};

// Define your custom interface for extending the Validator type
interface ValidatorExtension {
    bondStatus: string; 
    operatorAddress: string;
    operatorWallet: string;
    consensusPublicKey: Pubkey;
    consensusAddress: string;
    consensusHexAddress: string;
}

// Combine Validator and ValidatorExtension using interface merging
export interface ExtendedValidator extends Validator, ValidatorExtension {}


export const useBlockchainStore = defineStore('blockchain', () => {
    const isLoading: Ref<string[]> = ref([])
    const selectedChainName: Ref<Mainnets|Testnets|null> = ref(null)
    // viem public client without signer
    const publicEVMClient: Ref<null|PublicClient> = ref(null);

    const cosmosHelper: Ref<CosmosHelperPublic> = ref(new CosmosHelper([]))
    const evmHelper: Ref<EVMHelperHelperPublic> = ref(new EVMHelper([]))

    const cosmosChaindata: Ref<Record<string, { 
        blockchain?: BlockchainResponse|undefined,
        validators?: QueryValidatorsResponse|undefined,
        stakingParams?: QueryStakingParamsResponse|undefined,
        slashingParams?: QuerySlashingParamsResponse|undefined
    }>> = ref({} as Record<string, { 
        blockchain?: BlockchainResponse|undefined,
        validators?: QueryValidatorsResponse|undefined,
        stakingParams?: QueryStakingParamsResponse|undefined,
        slashingParams?: QuerySlashingParamsResponse|undefined
    }>);
    
    const availableChainNames = computed(() => {
        return availableChains.value.map(c => c.name)
    })
    
    const availableChains: ComputedRef<ExplorerChainInfo[]> = computed(() => {
        const { isTestnet } = storeToRefs(useAppStore())
        return Object.values(blockchainConfigs.networks)
            .filter(chainConfig => isTestnet.value 
                ? chainConfig.isTestnet === true 
                : chainConfig.isTestnet === false)
    })

    const availableCosmosChainIds = computed(() => {
        return availableChains.value.map(chain => chain.keplr?.chainId).filter(v => v != undefined) as string[]
    })

    const selectedChain: Ref<null|ExplorerChainInfo> = computed(() => {
        return Object.values(availableChains.value).find(x => x.name == selectedChainName.value) || null
    })

    const latestEVMTransactionHashes = computed(() => {
        return availableCosmosChainIds.value.reduce((acc: {[id: string]: Ref<string[]>}, item) => {
            acc[item] = computed(() => cosmosHelper.value.GetlatestEthTxHashes(item));
            return acc;
        }, {});
    })

    const keybaseAvatars: Ref<Record<string, string>> = ref({})

    function connectCosmosClients() {
        const allCosmosChains = []
        for(const chain of availableChains.value) {
            if(chain.keplr) {
                allCosmosChains.push(chain.keplr)
            }
        }
        cosmosHelper.value = new CosmosHelper(allCosmosChains)
        cosmosHelper.value.addEventListener('evmTx', (event) => {
            const evmTxEvent = event as EvmTxEvent
            evmHelper.value.GetTransaction(evmTxEvent.evmChainId, evmTxEvent.txHash as `0x${string}`).then((evmTx) => {
                // console.log(evmTx)
            })
        })
        // update latest blockheight
        cosmosHelper.value.addEventListener('cosmosNewBlock', (event) => {
            const newBlockEvent = event as CosmosNewBlockheaderEvent
            if(!cosmosChaindata.value[newBlockEvent.chainId]) {
                cosmosChaindata.value[newBlockEvent.chainId] = {}
            }
            if(!cosmosChaindata.value[newBlockEvent.chainId]?.blockchain) {
                cosmosChaindata.value[newBlockEvent.chainId].blockchain = {
                    lastHeight: newBlockEvent.blockHeight,
                    blockMetas: []
                }
            }
            (cosmosChaindata.value[newBlockEvent.chainId]!.blockchain! as any).lastHeight = newBlockEvent.blockHeight
        })
        setTimeout(loadBlockchaindata, 2000)
    }

    function connectEVMClients() {
        const allEVMChains = []
        for(const chain of availableChains.value) {
            if(chain.evm) {
                allEVMChains.push(chain.evm)
            }
        }
        evmHelper.value = new EVMHelper(allEVMChains)
    }

    function connectClients() {
        connectCosmosClients()
        connectEVMClients();
    }

    function selectChain(chainName: Mainnets|Testnets) {
        if(availableChains.value.map(c => c.name).includes(chainName)) {
            selectedChainName.value = chainName as typeof chainName
            if(selectedChainName.value) {
                connectClient()
            }
        }
    }

    function connectClient() {
        if(selectedChain.value?.evm) {
            if(publicEVMClient.value !== null) {
                publicEVMClient.value = null;
            }
            publicEVMClient.value = createPublicClient({
                chain: selectedChain.value.evm,
                transport: http()
            })
        } else {
            publicEVMClient.value = null
        }
    }

    function getValidatorInfo(chainId: string, v: Validator): ExtendedValidator {
        if(!v?.consensusPubkey) {
            return v as ExtendedValidator
        } else {
            const blockChainConfig = availableChains.value.find(c => c.keplr?.chainId === chainId)
            const consensusPubkey = decodePubkey(v.consensusPubkey)
            return Object.assign(v,{
                bondStatus: BondStatus[v.status],
                operatorAddress: v.operatorAddress,
                operatorWallet: toBech32(blockChainConfig?.keplr?.bech32Config.bech32PrefixAccAddr || 'cosmos',fromBech32(v.operatorAddress).data),
                consensusPublicKey: consensusPubkey,
                consensusAddress: toBech32(blockChainConfig?.keplr?.bech32Config.bech32PrefixConsAddr || 'cosmosvalcons', sha256(fromBase64(consensusPubkey.value)).slice(0,20)),
                consensusHexAddress: '0x' + toHex(sha256(fromBase64(consensusPubkey.value)).slice(0,20)).toUpperCase(),
            })  as ExtendedValidator
        }
    }

    async function loadBlockchaindata() {
        const localStorageKeybaseAvatars = localStorage.getItem('validator-avatars')
        if(localStorageKeybaseAvatars) {
            keybaseAvatars.value = JSON.parse(localStorageKeybaseAvatars)
        }
        for(const chain of availableChains.value) {
            if(chain.keplr) {
                isLoading.value.push(chain.name)
                if(!cosmosChaindata.value[chain.keplr.chainId]) {
                    cosmosChaindata.value[chain.keplr.chainId] = {}
                }
                cosmosChaindata.value[chain.keplr.chainId].blockchain = await cosmosHelper.value.GetChainInfo(chain.keplr.chainId)
                cosmosChaindata.value[chain.keplr.chainId].validators = {
                    validators: [
                        ...(await cosmosHelper.value.GetAllValidators(chain.keplr.chainId))?.validators || [],
                        // ...((await cosmosHelper.value.GetBondedValidatorsInfo(chain.keplr.chainId))?.validators || []),
                        // ...((await cosmosHelper.value.GetUnbondedValidatorsInfo(chain.keplr.chainId))?.validators || []),
                        // ...((await cosmosHelper.value.GetUnbondingValidatorsInfo(chain.keplr.chainId))?.validators || []),
                    ]
                }
                for(const val of cosmosChaindata.value[chain.keplr.chainId]?.validators?.validators || []) {
                    if(keybaseAvatars.value[val.description.identity] || !val.description.identity) {
                        continue;
                    }
                    const avatarUrl = await fetchAvatar(val.description.identity)
                    keybaseAvatars.value[val.description.identity] = avatarUrl;
                    await setTimeout(() => { return Promise.resolve(true)}, 500)
                }
                localStorage.setItem('validator-avatars', JSON.stringify(keybaseAvatars.value))
                cosmosChaindata.value[chain.keplr.chainId].stakingParams = await cosmosHelper.value.GetStakingParams(chain.keplr.chainId)
                cosmosChaindata.value[chain.keplr.chainId].slashingParams = await cosmosHelper.value.GetSlashingParams(chain.keplr.chainId)

                const index = isLoading.value.indexOf(chain.name)
                isLoading.value.splice(index, 1)
            }
        }
    }

    return { 
        isLoading,
        keybaseAvatars,
        availableCosmosChainIds,
        availableChains,
        availableChainNames,
        selectedChain,
        selectedChainName,
        latestEVMTransactionHashes,
        cosmosChaindata,
        getValidatorInfo,
        connectClients,
        selectChain,
    }
})