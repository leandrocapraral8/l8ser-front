export default defineNuxtConfig({
  extends: [
    '../layers/tairo-layout-collapse',
    '../layers/tairo',
  ],
  modules: ['@nuxtjs/i18n', ],
  i18n: {
    lazy: true,
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pt-BR', name: 'Português (Brasil)', file: 'pt-BR.json' },
    ],
    defaultLocale: 'pt-BR',
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false
    }
  },
  experimental: {
    scanPageMeta: true,
  },
  compatibilityDate: '2025-04-09',
})
