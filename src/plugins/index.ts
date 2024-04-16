/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

import { createPinia } from 'pinia'
import { DiamondhandWidgetPlugin } from 'diamondhand-widget'
// Plugins
import vuetify from './vuetify'
import router from '../router'
import i18n from './i18n'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app
    .use(vuetify)
    .use(router)
    .use(createPinia())
    .use(i18n)
    .use(DiamondhandWidgetPlugin)
}
