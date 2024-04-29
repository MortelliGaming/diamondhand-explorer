<template>
  <div class="locale-changer">
    <v-select
      density="compact"
      v-model="locale"
      :label="t('message.language')"
      :items="langs.map(l => ({
        value: l,
        title:  getLanguageName(l) + ' - ' +  languageFlag[l],
      }))"
    ></v-select>
  </div>
</template>

<script setup lang="ts">
import { availableLanguages } from '@/plugins/i18n';
import { watch } from 'vue';
import { Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n()

const languageFlag: Ref<{[language: string]: string}> = ref({
  'de': '🇩🇪',
  'en': '🇬🇧',
  'it': '🇮🇹',
  'zh': '🇨🇳',
  'ko': '🇰🇷',
  'id': '🇮🇩',
  'fr': '🇫🇷',
  'pt': '🇵🇹',
  'es': '🇪🇸',
  'pt_BR': '🇧🇷',
})

function getLanguageName(language: string) {
  return t('language.' + language)
}

watch(locale, () => {
  localStorage.setItem('language', locale.value)
})

const langs = availableLanguages
</script>