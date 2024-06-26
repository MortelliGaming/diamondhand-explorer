/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

/// <reference types="unplugin-vue-router/client" />

import type {
  // type safe route locations
  RouteLocationTypedList,
  RouteLocationResolvedTypedList,
  RouteLocationNormalizedTypedList,
  RouteLocationNormalizedLoadedTypedList,
  RouteLocationAsString,
  RouteLocationAsRelativeTypedList,
  RouteLocationAsPathTypedList,

  // helper types
  // route definitions
  RouteRecordInfo,
  ParamValue,
  ParamValueOneOrMore,
  ParamValueZeroOrMore,
  ParamValueZeroOrOne,

  // vue-router extensions
  _RouterTyped,
  RouterLinkTyped,
  RouterLinkPropsTyped,
  NavigationGuard,
  UseLinkFnTyped,

  // data fetching
  _DataLoader,
  _DefineLoaderOptions,
} from 'unplugin-vue-router/types'

declare module 'vue-router/auto/routes' {
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/[...all]': RouteRecordInfo<'/[...all]', '/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/[chainId]/[...all]': RouteRecordInfo<'/[chainId]/[...all]', '/:chainId/:all(.*)', { chainId: ParamValue<true>, all: ParamValue<true> }, { chainId: ParamValue<false>, all: ParamValue<false> }>,
    '/[chainId]/account/[address]': RouteRecordInfo<'/[chainId]/account/[address]', '/:chainId/account/:address', { chainId: ParamValue<true>, address: ParamValue<true> }, { chainId: ParamValue<false>, address: ParamValue<false> }>,
    '/[chainId]/account/AccountTransactions': RouteRecordInfo<'/[chainId]/account/AccountTransactions', '/:chainId/account/AccountTransactions', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/block/[blockHeight]': RouteRecordInfo<'/[chainId]/block/[blockHeight]', '/:chainId/block/:blockHeight', { chainId: ParamValue<true>, blockHeight: ParamValue<true> }, { chainId: ParamValue<false>, blockHeight: ParamValue<false> }>,
    '/[chainId]/blocks': RouteRecordInfo<'/[chainId]/blocks', '/:chainId/blocks', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/consensus': RouteRecordInfo<'/[chainId]/consensus', '/:chainId/consensus', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/dashboard': RouteRecordInfo<'/[chainId]/dashboard', '/:chainId/dashboard', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/governance': RouteRecordInfo<'/[chainId]/governance', '/:chainId/governance', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/ibc': RouteRecordInfo<'/[chainId]/ibc', '/:chainId/ibc', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/parameters': RouteRecordInfo<'/[chainId]/parameters', '/:chainId/parameters', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/proposal/[proposalId]': RouteRecordInfo<'/[chainId]/proposal/[proposalId]', '/:chainId/proposal/:proposalId', { chainId: ParamValue<true>, proposalId: ParamValue<true> }, { chainId: ParamValue<false>, proposalId: ParamValue<false> }>,
    '/[chainId]/staking': RouteRecordInfo<'/[chainId]/staking', '/:chainId/staking', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/supply': RouteRecordInfo<'/[chainId]/supply', '/:chainId/supply', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transaction/[txHash]': RouteRecordInfo<'/[chainId]/transaction/[txHash]', '/:chainId/transaction/:txHash', { chainId: ParamValue<true>, txHash: ParamValue<true> }, { chainId: ParamValue<false>, txHash: ParamValue<false> }>,
    '/[chainId]/transaction/cosmos/CosmosTx': RouteRecordInfo<'/[chainId]/transaction/cosmos/CosmosTx', '/:chainId/transaction/cosmos/CosmosTx', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transaction/cosmos/TxInfoSheet': RouteRecordInfo<'/[chainId]/transaction/cosmos/TxInfoSheet', '/:chainId/transaction/cosmos/TxInfoSheet', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transaction/cosmos/TxMessagesSheetCosmos': RouteRecordInfo<'/[chainId]/transaction/cosmos/TxMessagesSheetCosmos', '/:chainId/transaction/cosmos/TxMessagesSheetCosmos', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transaction/evm/EvmTx': RouteRecordInfo<'/[chainId]/transaction/evm/EvmTx', '/:chainId/transaction/evm/EvmTx', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transaction/evm/EvmTxContent': RouteRecordInfo<'/[chainId]/transaction/evm/EvmTxContent', '/:chainId/transaction/evm/EvmTxContent', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transaction/evm/TxInfoSheet': RouteRecordInfo<'/[chainId]/transaction/evm/TxInfoSheet', '/:chainId/transaction/evm/TxInfoSheet', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/transactions': RouteRecordInfo<'/[chainId]/transactions', '/:chainId/transactions', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/uptime': RouteRecordInfo<'/[chainId]/uptime', '/:chainId/uptime', { chainId: ParamValue<true> }, { chainId: ParamValue<false> }>,
    '/[chainId]/validator/[valoper]': RouteRecordInfo<'/[chainId]/validator/[valoper]', '/:chainId/validator/:valoper', { chainId: ParamValue<true>, valoper: ParamValue<true> }, { chainId: ParamValue<false>, valoper: ParamValue<false> }>,
    '/memecoin/sloth': RouteRecordInfo<'/memecoin/sloth', '/memecoin/sloth', Record<never, never>, Record<never, never>>,
    '/tools/[...all]': RouteRecordInfo<'/tools/[...all]', '/tools/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/tools/wallethelper': RouteRecordInfo<'/tools/wallethelper', '/tools/wallethelper', Record<never, never>, Record<never, never>>,
    '/wallet/[...all]': RouteRecordInfo<'/wallet/[...all]', '/wallet/:all(.*)', { all: ParamValue<true> }, { all: ParamValue<false> }>,
    '/wallet/collectables': RouteRecordInfo<'/wallet/collectables', '/wallet/collectables', Record<never, never>, Record<never, never>>,
    '/wallet/dashboard': RouteRecordInfo<'/wallet/dashboard', '/wallet/dashboard', Record<never, never>, Record<never, never>>,
    '/wallet/staking': RouteRecordInfo<'/wallet/staking', '/wallet/staking', Record<never, never>, Record<never, never>>,
    '/wallet/transactions': RouteRecordInfo<'/wallet/transactions', '/wallet/transactions', Record<never, never>, Record<never, never>>,
  }
}

declare module 'vue-router/auto' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export type RouterTyped = _RouterTyped<RouteNamedMap>

  /**
   * Type safe version of `RouteLocationNormalized` (the type of `to` and `from` in navigation guards).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalized<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationNormalizedLoaded` (the return type of `useRoute()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationNormalizedLoaded<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationResolved` (the returned route of `router.resolve()`).
   * Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationResolved<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationResolvedTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocation` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocation<Name extends keyof RouteNamedMap = keyof RouteNamedMap> = RouteLocationTypedList<RouteNamedMap>[Name]

  /**
   * Type safe version of `RouteLocationRaw` . Allows passing the name of the route to be passed as a generic.
   */
  export type RouteLocationRaw<Name extends keyof RouteNamedMap = keyof RouteNamedMap> =
    | RouteLocationAsString<RouteNamedMap>
    | RouteLocationAsRelativeTypedList<RouteNamedMap>[Name]
    | RouteLocationAsPathTypedList<RouteNamedMap>[Name]

  /**
   * Generate a type safe params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParams<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['params']
  /**
   * Generate a type safe raw params for a route location. Requires the name of the route to be passed as a generic.
   */
  export type RouteParamsRaw<Name extends keyof RouteNamedMap> = RouteNamedMap[Name]['paramsRaw']

  export function useRouter(): RouterTyped
  export function useRoute<Name extends keyof RouteNamedMap = keyof RouteNamedMap>(name?: Name): RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[Name]

  export const useLink: UseLinkFnTyped<RouteNamedMap>

  export function onBeforeRouteLeave(guard: NavigationGuard<RouteNamedMap>): void
  export function onBeforeRouteUpdate(guard: NavigationGuard<RouteNamedMap>): void

  export const RouterLink: RouterLinkTyped<RouteNamedMap>
  export const RouterLinkProps: RouterLinkPropsTyped<RouteNamedMap>

  // Experimental Data Fetching

  export function defineLoader<
    P extends Promise<any>,
    Name extends keyof RouteNamedMap = keyof RouteNamedMap,
    isLazy extends boolean = false,
  >(
    name: Name,
    loader: (route: RouteLocationNormalizedLoaded<Name>) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>
  export function defineLoader<
    P extends Promise<any>,
    isLazy extends boolean = false,
  >(
    loader: (route: RouteLocationNormalizedLoaded) => P,
    options?: _DefineLoaderOptions<isLazy>,
  ): _DataLoader<Awaited<P>, isLazy>

  export {
    _definePage as definePage,
    _HasDataLoaderMeta as HasDataLoaderMeta,
    _setupDataFetchingGuard as setupDataFetchingGuard,
    _stopDataFetchingScope as stopDataFetchingScope,
  } from 'unplugin-vue-router/runtime'
}

declare module 'vue-router' {
  import type { RouteNamedMap } from 'vue-router/auto/routes'

  export interface TypesConfig {
    beforeRouteUpdate: NavigationGuard<RouteNamedMap>
    beforeRouteLeave: NavigationGuard<RouteNamedMap>

    $route: RouteLocationNormalizedLoadedTypedList<RouteNamedMap>[keyof RouteNamedMap]
    $router: _RouterTyped<RouteNamedMap>

    RouterLink: RouterLinkTyped<RouteNamedMap>
  }
}
