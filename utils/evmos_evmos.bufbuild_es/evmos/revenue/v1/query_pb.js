// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:LGPL-3.0-only

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/revenue/v1/query.proto (package evmos.revenue.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";
import { PageRequest, PageResponse } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/base/query/v1beta1/pagination_pb.js";
import { Revenue } from "./revenue_pb.js";
import { Params } from "./genesis_pb.js";

/**
 * QueryRevenuesRequest is the request type for the Query/Revenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenuesRequest
 */
export const QueryRevenuesRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryRevenuesRequest",
  () => [
    { no: 1, name: "pagination", kind: "message", T: PageRequest },
  ],
);

/**
 * QueryRevenuesResponse is the response type for the Query/Revenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenuesResponse
 */
export const QueryRevenuesResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryRevenuesResponse",
  () => [
    { no: 1, name: "revenues", kind: "message", T: Revenue, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ],
);

/**
 * QueryRevenueRequest is the request type for the Query/Revenue RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenueRequest
 */
export const QueryRevenueRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryRevenueRequest",
  () => [
    { no: 1, name: "contract_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

/**
 * QueryRevenueResponse is the response type for the Query/Revenue RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenueResponse
 */
export const QueryRevenueResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryRevenueResponse",
  () => [
    { no: 1, name: "revenue", kind: "message", T: Revenue },
  ],
);

/**
 * QueryParamsRequest is the request type for the Query/Params RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryParamsRequest
 */
export const QueryParamsRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryParamsRequest",
  [],
);

/**
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryParamsResponse
 */
export const QueryParamsResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryParamsResponse",
  () => [
    { no: 1, name: "params", kind: "message", T: Params },
  ],
);

/**
 * QueryDeployerRevenuesRequest is the request type for the
 * Query/DeployerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryDeployerRevenuesRequest
 */
export const QueryDeployerRevenuesRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryDeployerRevenuesRequest",
  () => [
    { no: 1, name: "deployer_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "pagination", kind: "message", T: PageRequest },
  ],
);

/**
 * QueryDeployerRevenuesResponse is the response type for the
 * Query/DeployerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryDeployerRevenuesResponse
 */
export const QueryDeployerRevenuesResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryDeployerRevenuesResponse",
  () => [
    { no: 1, name: "contract_addresses", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ],
);

/**
 * QueryWithdrawerRevenuesRequest is the request type for the
 * Query/WithdrawerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryWithdrawerRevenuesRequest
 */
export const QueryWithdrawerRevenuesRequest = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryWithdrawerRevenuesRequest",
  () => [
    { no: 1, name: "withdrawer_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "pagination", kind: "message", T: PageRequest },
  ],
);

/**
 * QueryWithdrawerRevenuesResponse is the response type for the
 * Query/WithdrawerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryWithdrawerRevenuesResponse
 */
export const QueryWithdrawerRevenuesResponse = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.QueryWithdrawerRevenuesResponse",
  () => [
    { no: 1, name: "contract_addresses", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 2, name: "pagination", kind: "message", T: PageResponse },
  ],
);

