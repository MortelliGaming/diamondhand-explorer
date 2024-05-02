import { computeAddress } from "@ethersproject/transactions";
import { protoRegistry } from "./protoRegistry";
import { toHex } from '@cosmjs/encoding';
import { sha256 } from '@cosmjs/crypto'
import secp256k1 from 'secp256k1';

import * as ethermint from './proto/ethermint/crypto/v1/ethsecp256k1/keys';
import * as cosmos from './proto/cosmos/crypto/secp256k1/keys';
import * as ed25519 from './proto/cosmos/crypto/ed25519/keys';

import { rawEd25519PubkeyToRawAddress, rawSecp256k1PubkeyToRawAddress } from "@cosmjs/tendermint-rpc";

function _u8aToHexString(u8arr: Uint8Array): string {
    return "0x" + Buffer.from(u8arr).toString("hex");
}

function ethPublicKeyToAddress(hexPublicKey: string): {
    error?: string;
    success: boolean;
    hex?: string;
    rawAddress?: Uint8Array;
    pubKeyBytes?: Uint8Array
} {
    //Validation: Must be hexadecimal, with length of 40, 66, or 130
    if (!/^[0-9A-Fa-f]+$/.test(hexPublicKey)) {
        return { error: "(not a valid input, expected hexadecimal)", success: false };
    }
    const isEthAddress = hexPublicKey.length === 40;
    const isPublicKey = [66, 130].includes(hexPublicKey.length);
    if (isEthAddress) {
        return { 
            error: 'Hex string is Address not Pubkey',
            success: true, 
            hex: "0x" + hexPublicKey ,
            rawAddress: Buffer.from(hexPublicKey, 'hex')
        };
    } else if (isPublicKey) {
        try {
        //Re-encode public key
        const publicKeyBytes = Buffer.from(hexPublicKey, "hex");
        /* const publicKeyHexUncompressed = _u8aToHexString(
            secp256k1.publicKeyConvert(publicKeyBytes, false)
        ); */
        const publicKeyHexCompressed = _u8aToHexString(
            secp256k1.publicKeyConvert(publicKeyBytes)
        );
        const ethAddress = computeAddress(publicKeyHexCompressed);
        
        return {
            error: '',
            success: true,
            hex: ethAddress,
            rawAddress: Buffer.from(ethAddress.replace('0x',''), 'hex'),
        };
        } catch (error) {
            console.error(error);
            return { error: "(not a valid input, invalid public key)", success: false };
        }
    }
    return {
        success: false,
        error:
        "not a valid input, incorrect length (expected 40, 66, or 130 hexadecimal characters)"
    };
}
function cosmosKeyToAddress(pubKey: {typeUrl: string, value: Uint8Array}) {
    const decodedPublickey = protoRegistry.decode(pubKey).key
    // read the public from base64 bytes and get hex string
    const publicKeyBytes = Buffer.from(decodedPublickey, 'base64')

    const rawAddress = 
        pubKey.typeUrl == ed25519.PubKey.typeUrl 
            ? rawEd25519PubkeyToRawAddress(publicKeyBytes)
            : rawSecp256k1PubkeyToRawAddress(publicKeyBytes)

    const hash =  sha256(publicKeyBytes).slice(0,20)
    return {
        pubKeyBytes: publicKeyBytes,
        rawAddress: rawAddress,
        hex: toHex(hash),
    }
}

export function getAddressForPublicKey(pubKey: {typeUrl: string, value: Uint8Array} ) {
    let result: {
        error: string;
        success?: boolean;
        hex?: string;
        rawAddress?: Uint8Array;
        publicKeyBytes?: Uint8Array;
    } = {
        error: '',
        success: false,
    }
    if([cosmos.PubKey.typeUrl, ed25519.PubKey.typeUrl].includes(pubKey.typeUrl)) {
        result = {
            success: true,
            error: '',
            ...cosmosKeyToAddress(pubKey)
        }
    } else if (ethermint.PubKey.typeUrl == pubKey.typeUrl) {
        const decodedPublickey = protoRegistry.decode(pubKey).key
        const hexKey = Buffer.from(decodedPublickey, 'base64').toString('hex')
        result = {
            error: '',
            ...ethPublicKeyToAddress(hexKey)
        }
    }
    if(result.error) {
        console.log(result.error)
    }
    return result;
}