<script setup lang="ts">
import { FocusTrap } from '@headlessui/vue'

const { close } = usePanels()
const { locale, setLocale } = useI18n()
onKeyStroke('Escape', close)

// Usando v-model para controlar a seleção do idioma
const selectedLanguage = ref(locale.value)
watch(selectedLanguage, (newValue) => {
  setLocale(newValue)
})
</script>

<template>
  <div class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 border bg-white">
    <FocusTrap>
      <div class="flex h-16 w-full items-center justify-between px-10">
        <h2
          class="font-heading text-muted-700 text-lg font-semibold dark:text-white"
        >
          Select language
        </h2>
        <button
          type="button"
          class="text-muted-400 nui-focus hover:bg-muted-100 focus:bg-muted-100 hover:text-muted-600 focus:text-muted-600 dark:hover:bg-muted-700 dark:focus:bg-muted-700 flex size-10 items-center justify-center rounded-full transition-colors duration-300 dark:hover:text-white dark:focus:text-white"
          @click="close"
        >
          <Icon name="feather:chevron-right" class="size-6" />
        </button>
      </div>

      <div class="relative h-[calc(100dvh_-_64px)] w-full px-10">
        <div class="grid grid-cols-3 py-6">
          <!-- Radio box for English -->
          <div class="relative my-4 flex items-center justify-center">
            <div class="nui-focus relative rounded-full" @click="selectedLanguage = 'en'">
              <input
                type="radio"
                name="language_selection"
                class="peer absolute start-0 top-0 z-20 size-full cursor-pointer opacity-0"
                v-model="selectedLanguage"
                value="en"
              >
              <div
                class="border-muted-200 peer-checked:border-primary-500 dark:border-muted-600 flex size-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300"
              >
                <img
                  class="size-10 rounded-full"
                  src="/img/icons/flags/united-states-of-america.svg"
                  alt="flag icon"
                >
              </div>
              <div
                class="bg-primary-500 dark:border-muted-800 absolute -end-1 -top-1 hidden size-7 items-center justify-center rounded-full border-4 border-white text-white peer-checked:flex"
              >
                <Icon name="feather:check" class="size-3" />
              </div>
            </div>
          </div>
          <!-- Radio box for Brazilian Portuguese -->
          <div class="relative my-4 flex items-center justify-center">
            <div class="nui-focus relative rounded-full" @click="selectedLanguage = 'pt-BR'">
              <input
                type="radio"
                name="language_selection"
                class="peer absolute start-0 top-0 z-20 size-full cursor-pointer opacity-0"
                v-model="selectedLanguage"
                value="pt-BR"
              >
              <div
                class="border-muted-200 peer-checked:border-primary-500 dark:border-muted-600 flex size-14 items-center justify-center rounded-full border-2 shadow-lg transition-all duration-300"
              >
                <img
                  class="size-10 rounded-full"
                  src="/img/icons/flags/brasil.svg"
                  alt="flag icon"
                >
              </div>
              <div
                class="bg-primary-500 dark:border-muted-800 absolute -end-1 -top-1 hidden size-7 items-center justify-center rounded-full border-4 border-white text-white peer-checked:flex"
              >
                <Icon name="feather:check" class="size-3" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <img
            src="/img/illustrations/translation.svg"
            class="mx-auto w-full max-w-[280px] dark:hidden"
            alt="illustration"
          >
          <img
            src="/img/illustrations/translation-dark.svg"
            class="mx-auto hidden w-full max-w-[280px] dark:block"
            alt="illustration"
          >
        </div>
      </div>
    </FocusTrap>
  </div>
</template>
