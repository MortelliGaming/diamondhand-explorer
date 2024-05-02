import { defineStore, storeToRefs } from 'pinia';
import { Ref, ref } from 'vue';
import { Pubkey } from '@cosmjs/amino';
import { BondStatus } from "cosmjs-types/cosmos/staking/v1beta1/staking";
import type { Validator } from 'cosmjs-types/cosmos/staking/v1beta1/staking';


import { fetchAvatar } from '@/lib/http/keybase';
import { useBlockchainStore } from '@/store/blockchain';
import { fromBech32, toBech32 } from '@cosmjs/encoding';
import { DelegationResponse } from '@/lib/proto/cosmos/staking/v1beta1/staking';
import { BondStatusString } from '@cosmjs/stargate/build/modules/staking/queries';
import { QueryValidatorDelegationsResponse, QueryValidatorsResponse } from '@/lib/proto/cosmos/staking/v1beta1/query';
import { protoRegistry } from '@/lib/protoRegistry';
import { getAddressForPublicKey } from '@/lib/keyhelper';

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

    const { chainClients, availableChains } = storeToRefs(useBlockchainStore())

    const validators: Ref<Record<string, Validator[]>> = ref({})
    const validatorDelegations: Ref<Record<string, Record<string, DelegationResponse[]>>> = ref({})

    const keybaseAvatars: Ref<Record<string, string>> = ref({})
    
    const isLoadingValidators: Ref<string[]> = ref([])
    const isLoadingValidatorDelegations: Ref<string[]> = ref([])
    
    async function loadCosmosValidators(chainName: string) {
        if(isLoadingValidators.value.includes(chainName)) {
            return Promise.resolve(true)
        }
        isLoadingValidators.value.push(chainName)

        const response = {
            validators: []
        } as QueryValidatorsResponse
        if(chainClients.value[chainName]?.cosmosClients?.queryClient) {
            for(const bondStatus of ['BOND_STATUS_BONDED','BOND_STATUS_UNBONDED', 'BOND_STATUS_UNBONDING']) {
                try {
                    const validators = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.staking.staking.validators(bondStatus as BondStatusString)
                    while (validators.pagination && validators.pagination.nextKey.length > 0) {
                        try {
                            const nextResult = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.staking.staking.validators(bondStatus as BondStatusString, validators.pagination.nextKey)
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
        validators.value[chainName] = response.validators
        // dont wait for the avatars
        loadAvatars(chainName);
        // remove chainId from loading
        const isLoadingIndex = isLoadingValidators.value.indexOf(chainName)
        isLoadingValidators.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    async function loadValidatorDelegations(chainName: string, valoperAddress: string) {
        if(isLoadingValidatorDelegations.value.includes(chainName)) {
            return Promise.resolve(true)
        }
        isLoadingValidatorDelegations.value.push(chainName)

        const allDelegations = {
            delegationResponses: []
        } as QueryValidatorDelegationsResponse

        if(chainClients.value[chainName]?.cosmosClients?.queryClient) {
            try {
                const delegations = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.staking.staking.validatorDelegations(valoperAddress)
                while (delegations.pagination && delegations.pagination.nextKey.length > 0) {
                    try {
                        const nextResult = await chainClients.value[chainName].cosmosClients!.queryClient.extensions.staking.staking.validatorDelegations(valoperAddress, delegations.pagination.nextKey)
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
        if(!validatorDelegations.value[chainName]) {
            validatorDelegations.value[chainName] = {}
        }
        if(!validatorDelegations.value[chainName][valoperAddress]) {
            validatorDelegations.value[chainName][valoperAddress] = []
        }
        validatorDelegations.value[chainName][valoperAddress] = allDelegations.delegationResponses
        
        const isLoadingIndex = isLoadingValidatorDelegations.value.indexOf(chainName)
        isLoadingValidatorDelegations.value.splice(isLoadingIndex, 1)
        return Promise.resolve(true)
    }

    async function loadAvatars(chainName: string) {
        if(Object.keys(keybaseAvatars.value).length == 0) {
            try {
                keybaseAvatars.value = JSON.parse(localStorage.getItem('validator-avatars') || '')
            } catch { /* */ }
        }
        for(const val of validators.value[chainName] || []) {
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

    function getValidatorInfo(chainName: string, v: Validator): ExtendedValidator {
        if(!v?.consensusPubkey) {
            return v as ExtendedValidator
        } else {
            const blockChainConfig = availableChains.value.find(c => c.name === chainName)
            const consensusPubkey = protoRegistry.decode(v.consensusPubkey)
            const consensusAddresses = getAddressForPublicKey(v.consensusPubkey)
            return Object.assign(v,{
                bondStatus: BondStatus[v.status],
                operatorAddress: v.operatorAddress,
                operatorWallet: toBech32(blockChainConfig?.keplr?.bech32Config.bech32PrefixAccAddr || 'cosmos',fromBech32(v.operatorAddress).data),
                consensusPublicKey: {
                    type: v.consensusPubkey.typeUrl,
                    value: Buffer.from(consensusPubkey.key).toString('base64')
                },
                consensusAddress: toBech32(blockChainConfig?.keplr?.bech32Config.bech32PrefixConsAddr || 'cosmosvalcons', consensusAddresses.rawAddress!),
                consensusHexAddress: consensusAddresses.hex,
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