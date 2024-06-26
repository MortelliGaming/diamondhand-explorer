import { de } from './de';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { hr } from './hr'
import { id } from './id';
import { it } from './it';
import { ko } from './ko';
import { pt } from './pt'
import { pt_BR } from './pt_BR'
import { zh } from './zh';

export const messages = {
  de,
  en,
  es,
  fr,
  hr,
  id,
  it,
  ko,
  pt,
  pt_BR,
  zh
}

export const availableLanguages = Object.keys(messages)

import { createI18n } from 'vue-i18n'


let lang = localStorage.getItem('language')
if(!lang) {
  lang = navigator.language.startsWith('pt') ? navigator.language.replace('-', '_') : navigator.language.substring(0,2)
  localStorage.setItem('language', lang)
}
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createI18n({
  locale: lang,
  fallbackLocale: 'en', // set fallback locale
  legacy: false,
  messages,
  // If you need to specify other options, you can set other options
  // ...
})