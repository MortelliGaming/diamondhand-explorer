<template>
  <v-navigation-drawer
    absolute
    left
    class="blue lighten-5 px-3 py-3"
    v-model="isNavigationDrawerOpen"
    :permanent="$vuetify.display.mdAndUp"
  >
    <v-list dense class="pt-0" v-model:opened="open">
      <v-list-item class="hidden-md-and-up" @click="router.push('/')">
        <div class="d-flex flex-row align-center">
          <div class="pr-2"><v-img src="@/assets/logo.png" height="30" width="30"/></div>
          <div >{{ $t('appheader.title') }}</div>
        </div>
      </v-list-item>
      <v-divider class="hidden-md-and-up" />
      <v-list-item>
        <div class="d-flex flex-row align-center">
          <search-component />
        </div>
      </v-list-item>
      <v-divider />
      <!--<v-list-group :value="'wallet'">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="'Wallet'"
            :prepend-icon="'mdi-wallet'"
          ></v-list-item>
        </template>
        <v-list-item class="link-item" role="button" :active="'/wallet/dashboard' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-home">
          <router-link class="routerlink" :to="'/wallet/dashboard'">
            {{ $t('module.dashboard')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/wallet/transactions' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-bank-transfer">
          <router-link class="routerlink" :to="'/wallet/transactions'">
            {{ $t('module.transactions')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/wallet/staking' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-piggy-bank">
          <router-link class="routerlink" :to="'/wallet/staking'">
            {{ $t('module.staking')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/wallet/collectables' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-panorama-variant">
          <router-link class="routerlink" :to="'/wallet/collectables'">
            {{ $t('module.collectables')}}
          </router-link>
        </v-list-item>
      </v-list-group>
      <v-divider />
      -->
      <v-list-group :value="chainName" v-for="chainName in availableChainNames" :key="chainName">
        <template v-slot:activator="{ props }">
          <v-list-item
            style="padding-left: 8px;"
            v-bind="props"
            :title="chainName"
            :prepend-avatar="availableChains.find(x => x.name == chainName)?.keplr?.chainSymbolImageUrl"
          ></v-list-item>
        </template>

        <!-- 
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/dashboard' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-home">
          <router-link class="routerlink" :to="'/' + chainName + '/dashboard'">
            {{ $t('module.dashboard')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/parameters' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-cog">
          <router-link class="routerlink" :to="'/' + chainName + '/parameters'">
            {{ $t('module.parameters')}}
          </router-link>
        </v-list-item>
        -->
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/staking' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-piggy-bank">
          <router-link class="routerlink" :to="'/' + chainName + '/staking'">
            {{ $t('module.staking')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/governance' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-gavel">
          <router-link class="routerlink" :to="'/' + chainName + '/governance'">
            {{ $t('module.governance')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/transactions' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-receipt-text">
          <router-link class="routerlink" :to="'/' + chainName + '/transactions'">
            {{ $t('module.transactions')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/blocks' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-vector-square">
          <router-link class="routerlink" :to="'/' + chainName + '/blocks'">
            {{ $t('module.blocks')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/uptime' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-connection">
          <router-link class="routerlink" :to="'/' + chainName + '/uptime'">
            {{ $t('module.uptime')}}
          </router-link>
        </v-list-item>
      </v-list-group>
        <!--
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/supply' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-hand-coin">
          <router-link class="routerlink" :to="'/' + chainName + '/supply'">
            {{ $t('module.supply')}}
          </router-link>
        </v-list-item>
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/ibc' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-leak">
          <router-link class="routerlink" :to="'/' + chainName + '/ibc'">
            {{ $t('module.ibc')}}
          </router-link>
        </v-list-item>
        <v-divider />
        <v-list-item class="link-item" role="button" :active="'/' + chainName + '/consensus' === router.currentRoute.value.fullPath" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-resistor-nodes">
          <router-link class="routerlink" :to="'/' + chainName + '/consensus'">
            {{ $t('module.consensus')}}
          </router-link>
        </v-list-item>
      </v-list-group>
      <v-divider />
    -->
      <v-divider />
      <v-list-group :value="'tools'">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="'Tools'"
            :prepend-icon="'mdi-tools'"
          ></v-list-item>
        </template>
        <v-list-item class="link-item" role="button" :active="router.currentRoute.value.path == '/tools/wallethelper'" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-tools">
          <router-link class="routerlink" :to="'/tools/wallethelper'">
            {{ $t('module.wallethelper')}}
          </router-link>
        </v-list-item>
      </v-list-group>
      <v-divider />
      <v-list-group :value="'links'">
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            :title="'Links'"
            :prepend-icon="'mdi-link'"
          ></v-list-item>
        </template>
        <v-list-item class="link-item" role="button" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-earth">
          <a href="https://diamondhand.capital" target="_blank">
            {{ $t('module.website')}}
          </a>
        </v-list-item>
        <v-list-item class="link-item" role="button" style="padding-left: 25px !important; font-size: small;" prepend-icon="mdi-bird">
          <a href="https://x.com/diamondhandHQ" target="_blank">
            {{ $t('module.twitter')}}
          </a>
        </v-list-item>
      </v-list-group>
      <v-list-item>
        <language-selector />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'
import { ref } from 'vue';

import { useAppStore } from '@/store/app'
import { useBlockchainStore } from '@/store/blockchain';
import LanguageSelector from '@/components/LanguageSelector.vue';
import SearchComponent from './SearchComponent.vue';

const router = useRouter();

const { isNavigationDrawerOpen } = storeToRefs(useAppStore())
const { availableChains, availableChainNames } = storeToRefs(useBlockchainStore())

const open = ref(['wallet'])
</script>
<style lang="scss" scoped>
.routerlink {
  text-decoration: none;
  color: unset;
}
a {
  text-decoration: none;
  color: unset;
}
.link-item {
  &:hover {
    background-color: rgba($color: rgb(80,80,80), $alpha: 0.3)
  }
}
</style>
