// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/erc20/v1/erc20.proto (package evmos.erc20.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";
import { Metadata } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/bank/v1beta1/bank_pb.js";

/**
 * Owner enumerates the ownership of a ERC20 contract.
 *
 * @generated from enum evmos.erc20.v1.Owner
 */
export const Owner = /*@__PURE__*/ proto3.makeEnum(
  "evmos.erc20.v1.Owner",
  [
    {no: 0, name: "OWNER_UNSPECIFIED", localName: "UNSPECIFIED"},
    {no: 1, name: "OWNER_MODULE", localName: "MODULE"},
    {no: 2, name: "OWNER_EXTERNAL", localName: "EXTERNAL"},
  ],
);

/**
 * TokenPair defines an instance that records a pairing consisting of a native
 * Cosmos Coin and an ERC20 token address.
 *
 * @generated from message evmos.erc20.v1.TokenPair
 */
export const TokenPair = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.TokenPair",
  () => [
    { no: 1, name: "erc20_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "enabled", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 4, name: "contract_owner", kind: "enum", T: proto3.getEnumType(Owner) },
  ],
);

/**
 * RegisterCoinProposal is a gov Content type to register a token pair for a
 * native Cosmos coin.
 *
 * @generated from message evmos.erc20.v1.RegisterCoinProposal
 */
export const RegisterCoinProposal = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.RegisterCoinProposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "metadata", kind: "message", T: Metadata, repeated: true },
  ],
);

/**
 * RegisterERC20Proposal is a gov Content type to register a token pair for an
 * ERC20 token
 *
 * @generated from message evmos.erc20.v1.RegisterERC20Proposal
 */
export const RegisterERC20Proposal = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.RegisterERC20Proposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "erc20addresses", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);

/**
 * ToggleTokenConversionProposal is a gov Content type to toggle the conversion
 * of a token pair.
 *
 * @generated from message evmos.erc20.v1.ToggleTokenConversionProposal
 */
export const ToggleTokenConversionProposal = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.ToggleTokenConversionProposal",
  () => [
    { no: 1, name: "title", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * ProposalMetadata is used to parse a slice of denom metadata and generate
 * the RegisterCoinProposal content.
 *
 * @generated from message evmos.erc20.v1.ProposalMetadata
 */
export const ProposalMetadata = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.ProposalMetadata",
  () => [
    { no: 1, name: "metadata", kind: "message", T: Metadata, repeated: true },
  ],
);

