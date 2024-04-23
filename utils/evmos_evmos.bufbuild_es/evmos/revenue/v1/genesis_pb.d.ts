// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:LGPL-3.0-only

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/revenue/v1/genesis.proto (package evmos.revenue.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
import type { Revenue } from "./revenue_pb.js";

/**
 * GenesisState defines the module's genesis state.
 *
 * @generated from message evmos.revenue.v1.GenesisState
 */
export declare class GenesisState extends Message<GenesisState> {
  /**
   * params are the revenue module parameters
   *
   * @generated from field: evmos.revenue.v1.Params params = 1;
   */
  params?: Params;

  /**
   * revenues is a slice of active registered contracts for fee distribution
   *
   * @generated from field: repeated evmos.revenue.v1.Revenue revenues = 2;
   */
  revenues: Revenue[];

  constructor(data?: PartialMessage<GenesisState>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.GenesisState";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): GenesisState;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): GenesisState;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): GenesisState;

  static equals(a: GenesisState | PlainMessage<GenesisState> | undefined, b: GenesisState | PlainMessage<GenesisState> | undefined): boolean;
}

/**
 * Params defines the revenue module params
 *
 * @generated from message evmos.revenue.v1.Params
 */
export declare class Params extends Message<Params> {
  /**
   * enable_revenue defines a parameter to enable the revenue module
   *
   * @generated from field: bool enable_revenue = 1;
   */
  enableRevenue: boolean;

  /**
   * developer_shares defines the proportion of the transaction fees to be
   * distributed to the registered contract owner
   *
   * @generated from field: string developer_shares = 2;
   */
  developerShares: string;

  /**
   * addr_derivation_cost_create defines the cost of address derivation for
   * verifying the contract deployer at fee registration
   *
   * @generated from field: uint64 addr_derivation_cost_create = 3;
   */
  addrDerivationCostCreate: bigint;

  constructor(data?: PartialMessage<Params>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.revenue.v1.Params";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Params;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Params;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Params;

  static equals(a: Params | PlainMessage<Params> | undefined, b: Params | PlainMessage<Params> | undefined): boolean;
}

