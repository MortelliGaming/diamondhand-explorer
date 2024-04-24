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

    const validators: Ref<Record<string, Validator[]>> = ref({})
    const keybaseAvatars: Ref<Record<string, string>> = ref({})
    
    const isLoading: Ref<string[]> = ref([])

    async function loadCosmosValidators(chainId: string) {
        if(isLoading.value.includes(chainId)) {
            return Promise.resolve(true)
        }
        isLoading.value.push(chainId)
        const { cosmosHelper } = storeToRefs(useBlockchainStore())
        validators.value[chainId] =  ((await cosmosHelper.value.GetAllValidators(chainId))?.validators || [])
        // dont wait for the avatars
        loadAvatars(chainId);
        const isLoadingIndex = isLoading.value.indexOf(chainId)
        isLoading.value.splice(isLoadingIndex, 1)
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
        isLoading,
        validators,
        keybaseAvatars,
        loadCosmosValidators,
        getValidatorInfo
    }
})