// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/epochs/v1/query.proto (package evmos.epochs.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import type { PageRequest, PageResponse } from "@buf/cosmos_cosmos-sdk.bufbuild_es/cosmos/base/query/v1beta1/pagination_pb.js";
import type { EpochInfo } from "./genesis_pb.js";

/**
 * QueryEpochsInfoRequest is the request type for the Query/EpochInfos RPC
 * method.
 *
 * @generated from message evmos.epochs.v1.QueryEpochsInfoRequest
 */
export declare class QueryEpochsInfoRequest extends Message<QueryEpochsInfoRequest> {
  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageRequest pagination = 1;
   */
  pagination?: PageRequest;

  constructor(data?: PartialMessage<QueryEpochsInfoRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.epochs.v1.QueryEpochsInfoRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryEpochsInfoRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryEpochsInfoRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryEpochsInfoRequest;

  static equals(a: QueryEpochsInfoRequest | PlainMessage<QueryEpochsInfoRequest> | undefined, b: QueryEpochsInfoRequest | PlainMessage<QueryEpochsInfoRequest> | undefined): boolean;
}

/**
 * QueryEpochsInfoResponse is the response type for the Query/EpochInfos RPC
 * method.
 *
 * @generated from message evmos.epochs.v1.QueryEpochsInfoResponse
 */
export declare class QueryEpochsInfoResponse extends Message<QueryEpochsInfoResponse> {
  /**
   * epochs is a slice of all EpochInfos
   *
   * @generated from field: repeated evmos.epochs.v1.EpochInfo epochs = 1;
   */
  epochs: EpochInfo[];

  /**
   * pagination defines an optional pagination for the request.
   *
   * @generated from field: cosmos.base.query.v1beta1.PageResponse pagination = 2;
   */
  pagination?: PageResponse;

  constructor(data?: PartialMessage<QueryEpochsInfoResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.epochs.v1.QueryEpochsInfoResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryEpochsInfoResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryEpochsInfoResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryEpochsInfoResponse;

  static equals(a: QueryEpochsInfoResponse | PlainMessage<QueryEpochsInfoResponse> | undefined, b: QueryEpochsInfoResponse | PlainMessage<QueryEpochsInfoResponse> | undefined): boolean;
}

/**
 * QueryCurrentEpochRequest is the request type for the Query/EpochInfos RPC
 * method.
 *
 * @generated from message evmos.epochs.v1.QueryCurrentEpochRequest
 */
export declare class QueryCurrentEpochRequest extends Message<QueryCurrentEpochRequest> {
  /**
   * identifier of the current epoch
   *
   * @generated from field: string identifier = 1;
   */
  identifier: string;

  constructor(data?: PartialMessage<QueryCurrentEpochRequest>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.epochs.v1.QueryCurrentEpochRequest";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryCurrentEpochRequest;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryCurrentEpochRequest;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryCurrentEpochRequest;

  static equals(a: QueryCurrentEpochRequest | PlainMessage<QueryCurrentEpochRequest> | undefined, b: QueryCurrentEpochRequest | PlainMessage<QueryCurrentEpochRequest> | undefined): boolean;
}

/**
 * QueryCurrentEpochResponse is the response type for the Query/EpochInfos RPC
 * method.
 *
 * @generated from message evmos.epochs.v1.QueryCurrentEpochResponse
 */
export declare class QueryCurrentEpochResponse extends Message<QueryCurrentEpochResponse> {
  /**
   * current_epoch is the number of the current epoch
   *
   * @generated from field: int64 current_epoch = 1;
   */
  currentEpoch: bigint;

  constructor(data?: PartialMessage<QueryCurrentEpochResponse>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.epochs.v1.QueryCurrentEpochResponse";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): QueryCurrentEpochResponse;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): QueryCurrentEpochResponse;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): QueryCurrentEpochResponse;

  static equals(a: QueryCurrentEpochResponse | PlainMessage<QueryCurrentEpochResponse> | undefined, b: QueryCurrentEpochResponse | PlainMessage<QueryCurrentEpochResponse> | undefined): boolean;
}

