// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:LGPL-3.0-only

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/revenue/v1/query.proto (package evmos.revenue.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import type { PageRequest, PageResponse } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/base/query/v1beta1/pagination_pb.js";
import type { Revenue } from "./revenue_pb.js";
import type { Params } from "./genesis_pb.js";

/**
 * QueryRevenuesRequest is the request type for the Query/Revenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenuesRequest
 */
export declare class QueryRevenuesRequest extends Message<QueryRevenuesRequest> {
  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 1;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryRevenuesRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryRevenuesRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRevenuesRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRevenuesRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRevenuesRequest;

  static equals(a: QueryRevenuesRequest | PlainMessage<QueryRevenuesRequest> | undefined, b: QueryRevenuesRequest | PlainMessage<QueryRevenuesRequest> | undefined): boolean;
}

/**
 * QueryRevenuesResponse is the response type for the Query/Revenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenuesResponse
 */
export declare class QueryRevenuesResponse extends Message<QueryRevenuesResponse> {
  /**
   * revenues is a slice of all stored Reveneue
   *
   * @generated from field: repeated evmos.revenue.v1.Revenue revenues = 1;
   */
  revenues: Revenue[];

  /**
   * pagination defines the pagination in the response.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryRevenuesResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryRevenuesResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRevenuesResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRevenuesResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRevenuesResponse;

  static equals(a: QueryRevenuesResponse | PlainMessage<QueryRevenuesResponse> | undefined, b: QueryRevenuesResponse | PlainMessage<QueryRevenuesResponse> | undefined): boolean;
}

/**
 * QueryRevenueRequest is the request type for the Query/Revenue RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenueRequest
 */
export declare class QueryRevenueRequest extends Message<QueryRevenueRequest> {
  /**
   * contract_address of a registered contract in hex format
   *
   * @generated from field: string contract_address = 1;
   */
  contractAddress: string;

  constructor(data?: PartialMessage<QueryRevenueRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryRevenueRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRevenueRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRevenueRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRevenueRequest;

  static equals(a: QueryRevenueRequest | PlainMessage<QueryRevenueRequest> | undefined, b: QueryRevenueRequest | PlainMessage<QueryRevenueRequest> | undefined): boolean;
}

/**
 * QueryRevenueResponse is the response type for the Query/Revenue RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryRevenueResponse
 */
export declare class QueryRevenueResponse extends Message<QueryRevenueResponse> {
  /**
   * revenue is a stored Reveneue for the queried contract
   *
   * @generated from field: evmos.revenue.v1.Revenue revenue = 1;
   */
  revenue?: Revenue;

  constructor(data?: PartialMessage<QueryRevenueResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryRevenueResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryRevenueResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryRevenueResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryRevenueResponse;

  static equals(a: QueryRevenueResponse | PlainMessage<QueryRevenueResponse> | undefined, b: QueryRevenueResponse | PlainMessage<QueryRevenueResponse> | undefined): boolean;
}

/**
 * QueryParamsRequest is the request type for the Query/Params RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryParamsRequest
 */
export declare class QueryParamsRequest extends Message<QueryParamsRequest> {
  constructor(data?: PartialMessage<QueryParamsRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryParamsRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryParamsRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryParamsRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryParamsRequest;

  static equals(a: QueryParamsRequest | PlainMessage<QueryParamsRequest> | undefined, b: QueryParamsRequest | PlainMessage<QueryParamsRequest> | undefined): boolean;
}

/**
 * QueryParamsResponse is the response type for the Query/Params RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryParamsResponse
 */
export declare class QueryParamsResponse extends Message<QueryParamsResponse> {
  /**
   * params is the returned revenue parameter
   *
   * @generated from field: evmos.revenue.v1.Params params = 1;
   */
  params?: Params;

  constructor(data?: PartialMessage<QueryParamsResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryParamsResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryParamsResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryParamsResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryParamsResponse;

  static equals(a: QueryParamsResponse | PlainMessage<QueryParamsResponse> | undefined, b: QueryParamsResponse | PlainMessage<QueryParamsResponse> | undefined): boolean;
}

/**
 * QueryDeployerRevenuesRequest is the request type for the
 * Query/DeployerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryDeployerRevenuesRequest
 */
export declare class QueryDeployerRevenuesRequest extends Message<QueryDeployerRevenuesRequest> {
  /**
   * deployer_address in bech32 format
   *
   * @generated from field: string deployer_address = 1;
   */
  deployerAddress: string;

  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 2;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryDeployerRevenuesRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryDeployerRevenuesRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryDeployerRevenuesRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryDeployerRevenuesRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryDeployerRevenuesRequest;

  static equals(a: QueryDeployerRevenuesRequest | PlainMessage<QueryDeployerRevenuesRequest> | undefined, b: QueryDeployerRevenuesRequest | PlainMessage<QueryDeployerRevenuesRequest> | undefined): boolean;
}

/**
 * QueryDeployerRevenuesResponse is the response type for the
 * Query/DeployerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryDeployerRevenuesResponse
 */
export declare class QueryDeployerRevenuesResponse extends Message<QueryDeployerRevenuesResponse> {
  /**
   * contract_addresses is the slice of registered contract addresses for a deployer
   *
   * @generated from field: repeated string contract_addresses = 1;
   */
  contractAddresses: string[];

  /**
   * pagination defines the pagination in the response.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryDeployerRevenuesResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryDeployerRevenuesResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryDeployerRevenuesResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryDeployerRevenuesResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryDeployerRevenuesResponse;

  static equals(a: QueryDeployerRevenuesResponse | PlainMessage<QueryDeployerRevenuesResponse> | undefined, b: QueryDeployerRevenuesResponse | PlainMessage<QueryDeployerRevenuesResponse> | undefined): boolean;
}

/**
 * QueryWithdrawerRevenuesRequest is the request type for the
 * Query/WithdrawerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryWithdrawerRevenuesRequest
 */
export declare class QueryWithdrawerRevenuesRequest extends Message<QueryWithdrawerRevenuesRequest> {
  /**
   * withdrawer_address in bech32 format
   *
   * @generated from field: string withdrawer_address = 1;
   */
  withdrawerAddress: string;

  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 2;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryWithdrawerRevenuesRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryWithdrawerRevenuesRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryWithdrawerRevenuesRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryWithdrawerRevenuesRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryWithdrawerRevenuesRequest;

  static equals(a: QueryWithdrawerRevenuesRequest | PlainMessage<QueryWithdrawerRevenuesRequest> | undefined, b: QueryWithdrawerRevenuesRequest | PlainMessage<QueryWithdrawerRevenuesRequest> | undefined): boolean;
}

/**
 * QueryWithdrawerRevenuesResponse is the response type for the
 * Query/WithdrawerRevenues RPC method.
 *
 * @generated from message evmos.revenue.v1.QueryWithdrawerRevenuesResponse
 */
export declare class QueryWithdrawerRevenuesResponse extends Message<QueryWithdrawerRevenuesResponse> {
  /**
   * contract_addresses is the slice of registered contract addresses for a withdrawer
   *
   * @generated from field: repeated string contract_addresses = 1;
   */
  contractAddresses: string[];

  /**
   * pagination defines the pagination in the response.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryWithdrawerRevenuesResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.QueryWithdrawerRevenuesResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryWithdrawerRevenuesResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryWithdrawerRevenuesResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryWithdrawerRevenuesResponse;

  static equals(a: QueryWithdrawerRevenuesResponse | PlainMessage<QueryWithdrawerRevenuesResponse> | undefined, b: QueryWithdrawerRevenuesResponse | PlainMessage<QueryWithdrawerRevenuesResponse> | undefined): boolean;
}

