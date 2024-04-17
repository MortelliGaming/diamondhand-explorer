<template>
  <v-app>
    <default-bar />
    <default-view />
    <default-footer />
    <default-navigation-drawer />
  </v-app>
</template>

<script lang="ts" setup>
  import DefaultBar from './default/AppBar.vue'
  import DefaultView from './default/View.vue'
  import DefaultFooter from './default/AppFooter.vue'
  import DefaultNavigationDrawer from './default/NavigationDrawer.vue'
</script>
