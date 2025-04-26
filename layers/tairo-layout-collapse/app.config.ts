export default defineAppConfig({
  tairo: {
    collapse: {
      toolbar: {
        enabled: true,
        showTitle: true,
        showNavBurger: true,
        tools: [
          { component: 'DemoThemeToggle' },
          { component: 'DemoToolbarLanguage' },
          { component: 'DemoToolbarNotifications' },
          { component: 'DemoToolbarSearch' },
        ],
      },
      navigation: {
        enabled: true,
        header: {
          component: '',
        },
        footer: {
          component: '',
        },
        items: [],
      },
    },
  },
})
