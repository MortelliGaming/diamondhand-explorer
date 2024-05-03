import { 
    defaultRegistryTypes,
} from '@cosmjs/stargate';

import { Registry, GeneratedType } from '@cosmjs/proto-signing';
import { SoftwareUpgradeProposal, CancelSoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { MsgSoftwareUpgrade, MsgCancelUpgrade } from 'cosmjs-types/cosmos/upgrade/v1beta1/tx';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params';
import { MsgUpdateParams as MsgFeemarketUpdateParams } from '@/lib/proto/ethermint/feemarket/v1/tx'
import { MsgEthereumTx, DynamicFeeTx, LegacyTx } from './proto/ethermint/evm/v1/tx';
import { MsgExecLegacyContent } from './proto/cosmos/gov/v1/tx';
import { CommunityPoolSpendProposal } from './proto/cosmos/distribution/v1beta1/distribution';
import { Proposal } from './proto/cosmos/gov/v1/gov';
import * as ethermint from './proto/ethermint/crypto/v1/ethsecp256k1/keys';
import * as cosmos from './proto/cosmos/crypto/secp256k1/keys';
import * as ed25519 from './proto/cosmos/crypto/ed25519/keys';
// Map message type strings to decoder functions
const _protoRegistry = new  Registry(defaultRegistryTypes)
_protoRegistry.register(CommunityPoolSpendProposal.typeUrl, CommunityPoolSpendProposal as GeneratedType)
_protoRegistry.register(MsgExecLegacyContent.typeUrl, MsgExecLegacyContent as GeneratedType)
_protoRegistry.register(Proposal.typeUrl, Proposal as GeneratedType)
_protoRegistry.register(SoftwareUpgradeProposal.typeUrl, SoftwareUpgradeProposal)
_protoRegistry.register(MsgEthereumTx.typeUrl, MsgEthereumTx as GeneratedType)
_protoRegistry.register(LegacyTx.typeUrl, LegacyTx as GeneratedType)
_protoRegistry.register(ethermint.PubKey.typeUrl, ethermint.PubKey as GeneratedType)
_protoRegistry.register(cosmos.PubKey.typeUrl, cosmos.PubKey as GeneratedType)
_protoRegistry.register(ed25519.PubKey.typeUrl, ed25519.PubKey as GeneratedType)
_protoRegistry.register(DynamicFeeTx.typeUrl, DynamicFeeTx as GeneratedType)
_protoRegistry.register(CancelSoftwareUpgradeProposal.typeUrl, CancelSoftwareUpgradeProposal)
_protoRegistry.register(ParameterChangeProposal.typeUrl, ParameterChangeProposal)
_protoRegistry.register(MsgCancelUpgrade.typeUrl, MsgCancelUpgrade)
_protoRegistry.register(MsgSoftwareUpgrade.typeUrl, MsgSoftwareUpgrade)
_protoRegistry.register(MsgFeemarketUpdateParams.typeUrl, MsgFeemarketUpdateParams as GeneratedType)

export const protoRegistry = _protoRegistry