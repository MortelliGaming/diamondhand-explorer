/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */
import { createPinia } from 'pinia'
import VueApexCharts from "vue3-apexcharts";
import { DiamondhandWidgetPlugin } from 'dh-widget'
import 'dh-widget/dist/style.css'
// Plugins
import vuetify from './vuetify'
import router from '../router'
import i18n from './i18n'

// Types
import type { App } from 'vue'

const pinia = createPinia();

export function registerPlugins (app: App) {
  app
    .use(VueApexCharts)
    .use(vuetify)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(DiamondhandWidgetPlugin)
}