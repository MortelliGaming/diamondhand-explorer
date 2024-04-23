// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file ethermint/feemarket/v1/events.proto (package ethermint.feemarket.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * EventFeeMarket is the event type for the fee market module
 *
 * @generated from message ethermint.feemarket.v1.EventFeeMarket
 */
export const EventFeeMarket = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.feemarket.v1.EventFeeMarket",
  () => [
    { no: 1, name: "base_fee", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * EventBlockGas defines an Ethereum block gas event
 *
 * @generated from message ethermint.feemarket.v1.EventBlockGas
 */
export const EventBlockGas = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.feemarket.v1.EventBlockGas",
  () => [
    { no: 1, name: "height", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "amount", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

