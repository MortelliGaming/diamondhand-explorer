// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file ethermint/evm/v1/events.proto (package ethermint.evm.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * EventEthereumTx defines the event for an Ethereum transaction
 *
 * @generated from message ethermint.evm.v1.EventEthereumTx
 */
export const EventEthereumTx = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.evm.v1.EventEthereumTx",
  () => [
    { no: 1, name: "amount", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "eth_hash", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "index", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "gas_used", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 5, name: "hash", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 6, name: "recipient", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 7, name: "eth_tx_failed", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * EventTxLog defines the event for an Ethereum transaction log
 *
 * @generated from message ethermint.evm.v1.EventTxLog
 */
export const EventTxLog = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.evm.v1.EventTxLog",
  () => [
    { no: 1, name: "tx_logs", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
  ],
);

/**
 * EventMessage
 *
 * @generated from message ethermint.evm.v1.EventMessage
 */
export const EventMessage = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.evm.v1.EventMessage",
  () => [
    { no: 1, name: "module", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "sender", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "tx_type", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * EventBlockBloom defines an Ethereum block bloom filter event
 *
 * @generated from message ethermint.evm.v1.EventBlockBloom
 */
export const EventBlockBloom = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.evm.v1.EventBlockBloom",
  () => [
    { no: 1, name: "bloom", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

