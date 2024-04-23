// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/erc20/v1/events.proto (package evmos.erc20.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * EventRegisterPair is an event emitted when a coin is registered.
 *
 * @generated from message evmos.erc20.v1.EventRegisterPair
 */
export const EventRegisterPair = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.EventRegisterPair",
  () => [
    { no: 1, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "erc20_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * EventToggleTokenConversion is an event emitted when a coin's token conversion is toggled.
 *
 * @generated from message evmos.erc20.v1.EventToggleTokenConversion
 */
export const EventToggleTokenConversion = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.EventToggleTokenConversion",
  () => [
    { no: 1, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "erc20_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * EventConvertCoin is an event emitted when a coin is converted.
 *
 * @generated from message evmos.erc20.v1.EventConvertCoin
 */
export const EventConvertCoin = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.EventConvertCoin",
  () => [
    { no: 1, name: "sender", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "receiver", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "amount", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "erc20_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * EventConvertERC20 is an event emitted when an ERC20 is converted.
 *
 * @generated from message evmos.erc20.v1.EventConvertERC20
 */
export const EventConvertERC20 = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.erc20.v1.EventConvertERC20",
  () => [
    { no: 1, name: "sender", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "receiver", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "amount", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "denom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "contract_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

