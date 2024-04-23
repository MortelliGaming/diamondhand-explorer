// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/inflation/v1/inflation.proto (package evmos.inflation.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * InflationDistribution defines the distribution in which inflation is
 * allocated through minting on each epoch (staking, incentives, community). It
 * excludes the team vesting distribution, as this is minted once at genesis.
 * The initial InflationDistribution can be calculated from the Evmos Token
 * Model like this:
 * mintDistribution1 = distribution1 / (1 - teamVestingDistribution)
 * 0.5333333         = 40%           / (1 - 25%)
 *
 * @generated from message evmos.inflation.v1.InflationDistribution
 */
export declare class InflationDistribution extends Message<InflationDistribution> {
  /**
   * staking_rewards defines the proportion of the minted minted_denom that is
   * to be allocated as staking rewards
   *
   * @generated from field: string staking_rewards = 1;
   */
  stakingRewards: string;

  /**
   * Deprecated: usage_incentives defines the proportion of the minted minted_denom that is
   * to be allocated to the incentives module address
   *
   * @generated from field: string usage_incentives = 2 [deprecated = true];
   * @deprecated
   */
  usageIncentives: string;

  /**
   * community_pool defines the proportion of the minted minted_denom that is to
   * be allocated to the community pool
   *
   * @generated from field: string community_pool = 3;
   */
  communityPool: string;

  constructor(data?: PartialMessage<InflationDistribution>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.inflation.v1.InflationDistribution";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InflationDistribution;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InflationDistribution;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InflationDistribution;

  static equals(a: InflationDistribution | PlainMessage<InflationDistribution> | undefined, b: InflationDistribution | PlainMessage<InflationDistribution> | undefined): boolean;
}

/**
 * ExponentialCalculation holds factors to calculate exponential inflation on
 * each period. Calculation reference:
 * periodProvision = exponentialDecay       *  bondingIncentive
 * f(x)            = (a * (1 - r) ^ x + c)  *  (1 + max_variance - bondedRatio *
 * (max_variance / bonding_target))
 *
 * @generated from message evmos.inflation.v1.ExponentialCalculation
 */
export declare class ExponentialCalculation extends Message<ExponentialCalculation> {
  /**
   * a defines the initial value
   *
   * @generated from field: string a = 1;
   */
  a: string;

  /**
   * r defines the reduction factor
   *
   * @generated from field: string r = 2;
   */
  r: string;

  /**
   * c defines the parameter for long term inflation
   *
   * @generated from field: string c = 3;
   */
  c: string;

  /**
   * bonding_target
   *
   * @generated from field: string bonding_target = 4;
   */
  bondingTarget: string;

  /**
   * max_variance
   *
   * @generated from field: string max_variance = 5;
   */
  maxVariance: string;

  constructor(data?: PartialMessage<ExponentialCalculation>);

  static readonly runtime: typeof proto3;
  static readonly typeName = "evmos.inflation.v1.ExponentialCalculation";
  static readonly fields: FieldList;

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ExponentialCalculation;

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ExponentialCalculation;

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ExponentialCalculation;

  static equals(a: ExponentialCalculation | PlainMessage<ExponentialCalculation> | undefined, b: ExponentialCalculation | PlainMessage<ExponentialCalculation> | undefined): boolean;
}

