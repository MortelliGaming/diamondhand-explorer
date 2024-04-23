// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:ENCL-1.0(https://github.com/evmos/evmos/blob/main/LICENSE)

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/epochs/v1/genesis.proto (package evmos.epochs.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { Duration, proto3, Timestamp } from "@bufbuild/protobuf";

/**
 * EpochInfo defines the message interface containing the relevant informations about
 * an epoch.
 *
 * @generated from message evmos.epochs.v1.EpochInfo
 */
export const EpochInfo = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.epochs.v1.EpochInfo",
  () => [
    { no: 1, name: "identifier", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "start_time", kind: "message", T: Timestamp },
    { no: 3, name: "duration", kind: "message", T: Duration },
    { no: 4, name: "current_epoch", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
    { no: 5, name: "current_epoch_start_time", kind: "message", T: Timestamp },
    { no: 6, name: "epoch_counting_started", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 7, name: "current_epoch_start_height", kind: "scalar", T: 3 /* ScalarType.INT64 */ },
  ],
);

/**
 * GenesisState defines the epochs module's genesis state.
 *
 * @generated from message evmos.epochs.v1.GenesisState
 */
export const GenesisState = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.epochs.v1.GenesisState",
  () => [
    { no: 1, name: "epochs", kind: "message", T: EpochInfo, repeated: true },
  ],
);

