import { createI18n } from 'vue-i18n'
// import { messages } from './messages'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createI18n({
  locale: navigator.language.substring(0,2), // set locale
  fallbackLocale: 'en', // set fallback locale
  legacy: false,
  messages: {
      de: {
          'hello': 'hello'
      }
  },
  // If you need to specify other options, you can set other options
  // ...
})

