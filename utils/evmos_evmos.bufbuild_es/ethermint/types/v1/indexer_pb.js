// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file ethermint/types/v1/indexer.proto (package ethermint.types.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * TxResult is the value stored in eth tx indexer
 *
 * @generated from message ethermint.types.v1.TxResult
 */
export const TxResult = /*@__PURE__*/ proto3.makeMessageType(
  "ethermint.types.v1.TxResult",
  () => [
    { no: 1, name: "height", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 2, name: "tx_index", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 3, name: "msg_index", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 4, name: "eth_tx_index", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
    { no: 5, name: "failed", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 6, name: "gas_used", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
    { no: 7, name: "cumulative_gas_used", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);
