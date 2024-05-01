<template>
  <v-app>
    <default-bar />
    <suspense>
      <default-view />
      <template #fallback>
        <loading />
      </template>
    </suspense>
    <default-footer />
    <default-navigation-drawer />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './default/AppBar.vue'
  import DefaultView from './default/View.vue'
  import DefaultFooter from './default/AppFooter.vue'
  import DefaultNavigationDrawer from './default/NavigationDrawer.vue'
  import Loading from '@/components/Loading.vue'
</script>
