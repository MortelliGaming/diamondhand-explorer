import { de } from './de';
import { en } from './en';
import { fr } from './fr';
import { id } from './id';
import { it } from './it';
import { ko } from './ko';
import { zh } from './zh';

export const messages = {
  de,
  en,
  fr,
  id,
  it,
  ko,
  zh
}

import { createI18n } from 'vue-i18n'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createI18n({
  locale: 'en', // navigator.language.substring(0,2), // set locale
  fallbackLocale: 'en', // set fallback locale
  legacy: false,
  messages,
  // If you need to specify other options, you can set other options
  // ...
})
