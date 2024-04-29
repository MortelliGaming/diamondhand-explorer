import { 
    defaultRegistryTypes,
} from '@cosmjs/stargate';

import { Registry, GeneratedType } from '@cosmjs/proto-signing';
import { SoftwareUpgradeProposal, CancelSoftwareUpgradeProposal } from 'cosmjs-types/cosmos/upgrade/v1beta1/upgrade';
import { MsgSoftwareUpgrade, MsgCancelUpgrade } from 'cosmjs-types/cosmos/upgrade/v1beta1/tx';
import { ParameterChangeProposal } from 'cosmjs-types/cosmos/params/v1beta1/params';
import { MsgUpdateParams as MsgFeemarketUpdateParams } from '@/lib/proto/ethermint/feemarket/v1/tx'

// Map message type strings to decoder functions
const _protoRegistry = new  Registry(defaultRegistryTypes)

_protoRegistry.register(SoftwareUpgradeProposal.typeUrl, SoftwareUpgradeProposal)
_protoRegistry.register(CancelSoftwareUpgradeProposal.typeUrl, CancelSoftwareUpgradeProposal)
_protoRegistry.register(ParameterChangeProposal.typeUrl, ParameterChangeProposal)
_protoRegistry.register(MsgCancelUpgrade.typeUrl, MsgCancelUpgrade)
_protoRegistry.register(MsgSoftwareUpgrade.typeUrl, MsgSoftwareUpgrade)
_protoRegistry.register(MsgFeemarketUpdateParams.typeUrl, MsgFeemarketUpdateParams as GeneratedType)

export const protoRegistry = _protoRegistry