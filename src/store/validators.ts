import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import { Pubkey } from '@cosmjs/amino';
import { decodePubkey } from '@cosmjs/proto-signing';
import { sha256 } from '@cosmjs/crypto';
import { BondStatus } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import type { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';


import { fetchAvatar } from '@/lib/http/keybase';
import { useBlockchainStore } from '@/store/blockchain';
import { fromBech32, toBech32, toHex, fromBase64 } from '@cosmjs/encoding';
import { DelegationResponse } from '@/lib/proto/cosmos/staking/v1beta1/staking';
import { BondStatusString } from '@cosmjs/stargate/build/modules/staking/queries';
import { QueryValidatorDelegationsResponse, QueryValidatorsResponse } from '@/lib/proto/cosmos/staking/v1beta1/query';

// Augmented Data For Validators
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

export const useValidatorsStore = defineStore('validators', () => {

    const { cosmosClients } = storeToRefs(useBlockchainStore())

    const validators: Ref<Record<string, Validator[]>> = ref({})
    const validatorDelegations: Ref<Record<string, Record<string, DelegationResponse[]>>> = ref({})

    const keybaseAvatars: Ref<Record<string, string>> = ref({})
    
    const isLoadingValidators: Ref<string[]> = ref([])
    const isLoadingValidatorDelegations: Ref<string[]> = ref([])
    
    async function loadCosmosValidators(chainId: string) {
        if(isLoadingValidators.value.includes(chainId)) {
            return Promise.resolve(true)
        }
        isLoadingValidators.value.push(chainId)

        const response = {
            validators: []
        } as QueryValidatorsResponse
        if(cosmosClients.value[chainId]?.queryClient) {
            for(const bondStatus of ['BOND_STATUS_BONDED','BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING']) {
                try {
                    const validators = await cosmosClients.value[chainId]?.queryClient.extensions.staking.staking.validators(bondStatus as BondStatusString)
                    while (validators.pagination && validators.pagination.nextKey.length > 0) {
                        try {
                            const nextResult = await cosmosClients.value[chainId]?.queryClient.extensions.staking.staking.validators(bondStatus as BondStatusString, validators.pagination.nextKey)
                            validators.validators.push(...nextResult.validators)
                            validators.pagination = nextResult.pagination
                        } catch {
                            validators.pagination = undefined
                        }
                    }
                    response.validators.push(...validators.validators)
                } catch(err) { 
                    console.error('error fetching validator infos: ', err)
                }
            }
        }
        validators.value[chainId] = response.validators
        // dont wait for the avatars
        loadAvatars(chainId);
        // remove chainId from loading
        const isLoadingIndex = isLoadingValidators.value.indexOf(chainId)
        isLoadingValidators.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    async function loadValidatorDelegations(chainId: string, valoperAddress: string) {
        if(isLoadingValidatorDelegations.value.includes(chainId)) {
            return Promise.resolve(true)
        }
        isLoadingValidatorDelegations.value.push(chainId)

        const allDelegations = {
            delegationResponses: []
        } as QueryValidatorDelegationsResponse

        if(cosmosClients.value[chainId]?.queryClient) {
            try {
                const delegations = await cosmosClients.value[chainId]?.queryClient.extensions.staking.staking.validatorDelegations(valoperAddress)
                while (delegations.pagination && delegations.pagination.nextKey.length > 0) {
                    try {
                        const nextResult = await cosmosClients.value[chainId]?.queryClient.extensions.staking.staking.validatorDelegations(valoperAddress, delegations.pagination.nextKey)
                        delegations.delegationResponses.push(...nextResult.delegationResponses)
                        delegations.pagination = nextResult.pagination
                    } catch {
                        delegations.pagination = undefined
                    }
                }
                allDelegations.delegationResponses.push(...delegations.delegationResponses)
            } catch(err) { 
                console.error('error fetching validator infos: ', err)
            }
        }
        if(!validatorDelegations.value[chainId]) {
            validatorDelegations.value[chainId] = {}
        }
        if(!validatorDelegations.value[chainId][valoperAddress]) {
            validatorDelegations.value[chainId][valoperAddress] = []
        }
        validatorDelegations.value[chainId][valoperAddress] = allDelegations.delegationResponses
        
        const isLoadingIndex = isLoadingValidatorDelegations.value.indexOf(chainId)
        isLoadingValidatorDelegations.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    async function loadAvatars(chainId: string) {
        if(Object.keys(keybaseAvatars.value).length == 0) {
            try {
                keybaseAvatars.value = JSON.parse(localStorage.getItem('validator-avatars') || '')
            } catch { /* */ }
        }
        for(const val of validators.value[chainId] || []) {
            if(keybaseAvatars.value[val.description.identity] || !val.description.identity) {
                continue;
            }
            const avatarUrl = await fetchAvatar(val.description.identity)
            keybaseAvatars.value[val.description.identity] = avatarUrl;
            // only load every 500ms
            await setTimeout(() => { return Promise.resolve(true)}, 500)
        }
        localStorage.setItem('validator-avatars', JSON.stringify(keybaseAvatars.value))
        return Promise.resolve(true)
    }

    function getValidatorInfo(chainId: string, v: Validator): ExtendedValidator {
        if(!v?.consensusPubkey) {
            return v as ExtendedValidator
        } else {
            const { availableChains } = storeToRefs(useBlockchainStore())
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

    return {
        isLoadingValidators,
        isLoadingValidatorDelegations,
        validators,
        keybaseAvatars,
        validatorDelegations,
        loadCosmosValidators,
        loadValidatorDelegations,
        getValidatorInfo,
    }
})