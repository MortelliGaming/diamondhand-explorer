// Copyright Tharsis Labs Ltd.(Evmos)
// SPDX-License-Identifier:LGPL-3.0-only

// @generated by protoc-gen-es v1.9.0
// @generated from file evmos/revenue/v1/revenue.proto (package evmos.revenue.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import { proto3 } from "@bufbuild/protobuf";

/**
 * Revenue defines an instance that organizes fee distribution conditions for
 * the owner of a given smart contract
 *
 * @generated from message evmos.revenue.v1.Revenue
 */
export const Revenue = /*@__PURE__*/ proto3.makeMessageType(
  "evmos.revenue.v1.Revenue",
  () => [
    { no: 1, name: "contract_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "deployer_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "withdrawer_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ],
);

