<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const { open } = usePanels()

const getFlagSrc = () => {
  switch (locale.value) {
    case 'en':
      return '/img/icons/flags/united-states-of-america.svg'
    case 'pt-BR':
      return '/img/icons/flags/brasil.svg'
    default:
      return '/img/icons/flags/brasil.svg'
  }
}
</script>

<template>
  <button
    type="button"
    class="border-muted-200 hover:ring-muted-200 dark:hover:ring-muted-700 dark:border-muted-700 dark:bg-muted-800 dark:ring-offset-muted-900 flex size-9 items-center justify-center rounded-full border bg-white ring-1 ring-transparent transition-all duration-300 hover:ring-offset-4"
    @click="open('language')"
  >
    <img
      class="size-7 rounded-full"
      :src="getFlagSrc()"
      alt="flag icon"
    >
  </button>
</template>
