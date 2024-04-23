// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/inflation/v1/query.proto (package evmos.inflation.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";
import { DecCoin } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/base/v1beta1/coin_pb.js";
import { Params } from "./genesis_pb.js";

/**
 * QueryPeriodRequest is the request type for the Query/Period RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryPeriodRequest
 */
export const QueryPeriodRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryPeriodRequest",
  [],
);

/**
 * QueryPeriodResponse is the response type for the Query/Period RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryPeriodResponse
 */
export const QueryPeriodResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryPeriodResponse",
  () => [
    { no: 1, name: "period", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * QueryEpochMintProvisionRequest is the request type for the
 * Query/EpochMintProvision RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryEpochMintProvisionRequest
 */
export const QueryEpochMintProvisionRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryEpochMintProvisionRequest",
  [],
);

/**
 * QueryEpochMintProvisionResponse is the response type for the
 * Query/EpochMintProvision RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryEpochMintProvisionResponse
 */
export const QueryEpochMintProvisionResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryEpochMintProvisionResponse",
  () => [
    { no: 1, name: "epoch_mint_provision", kind: "message", T: DecCoin },
  ],
);

/**
 * QuerySkippedEpochsRequest is the request type for the Query/SkippedEpochs RPC
 * method.
 *
 * @generated from message evmos.inflation.v1.QuerySkippedEpochsRequest
 */
export const QuerySkippedEpochsRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QuerySkippedEpochsRequest",
  [],
);

/**
 * QuerySkippedEpochsResponse is the response type for the Query/SkippedEpochs
 * RPC method.
 *
 * @generated from message evmos.inflation.v1.QuerySkippedEpochsResponse
 */
export const QuerySkippedEpochsResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QuerySkippedEpochsResponse",
  () => [
    { no: 1, name: "skipped_epochs", kind: "scalar", T: 4 /* ScalarType.UINT64 */ },
  ],
);

/**
 * QueryCirculatingSupplyRequest is the request type for the
 * Query/CirculatingSupply RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryCirculatingSupplyRequest
 */
export const QueryCirculatingSupplyRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryCirculatingSupplyRequest",
  [],
);

/**
 * QueryCirculatingSupplyResponse is the response type for the
 * Query/CirculatingSupply RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryCirculatingSupplyResponse
 */
export const QueryCirculatingSupplyResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryCirculatingSupplyResponse",
  () => [
    { no: 1, name: "circulating_supply", kind: "message", T: DecCoin },
  ],
);

/**
 * QueryInflationRateRequest is the request type for the Query/InflationRate RPC
 * method.
 *
 * @generated from message evmos.inflation.v1.QueryInflationRateRequest
 */
export const QueryInflationRateRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryInflationRateRequest",
  [],
);

/**
 * QueryInflationRateResponse is the response type for the Query/InflationRate
 * RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryInflationRateResponse
 */
export const QueryInflationRateResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryInflationRateResponse",
  () => [
    { no: 1, name: "inflation_rate", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * QueryParamsRequest is the request type for the Query/Params RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryParamsRequest
 */
export const QueryParamsRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryParamsRequest",
  [],
);

/**
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 *
 * @generated from message evmos.inflation.v1.QueryParamsResponse
 */
export const QueryParamsResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.inflation.v1.QueryParamsResponse",
  () => [
    { no: 1, name: "params", kind: "message", T: Params },
  ],
);

