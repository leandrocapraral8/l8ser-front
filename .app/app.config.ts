export default defineAppConfig({
  tairo: {
    collapse: {
      circularMenu: {
        enabled: true,
        tools: [
          { component: 'DemoThemeToggle' },
          { component: 'DemoToolbarLanguage' },
          { component: 'DemoToolbarNotifications' },
          { component: 'DemoToolbarSearch' },
        ],
      },
      navigation: {
        header: {
          component: 'DemoCollapseNavigationHeader',
        },
        footer: {
          component: 'DemoCollapseNavigationFooter',
        },
        items: [
          {
            name: 'Home',
            icon: { name: 'ph:house-simple', class: 'w-5 h-5' },
            to: '/',
          },
          {
            name: 'Divider',
            divider: true,
          },
          // {
          //   name: 'Users',
          //   icon: { name: 'ph:user', class: 'w-5 h-5' },
          //   to: '/users',
          // },
          // {
          //   name: 'Customers',
          //   icon: { name: 'ph:user-list', class: 'w-5 h-5' },
          //   to: '/customers',
          // },
          // {
          //   name: 'Products',
          //   icon: { name: 'ph:bowl-food', class: 'w-5 h-5' },
          //   children: [
          //     {
          //       name: 'Products',
          //       to: '/products',
          //       icon: { name: 'ph:bowl-food', class: 'w-4 h-4' },
          //     },
          //     {
          //       name: 'Product categories',
          //       to: '/productcategories',
          //       icon: { name: 'ph:bowl-food', class: 'w-4 h-4' },
          //     },
          //   ],
          // },
          {
            name: 'Reports',
            icon: { name: 'ph:file-text', class: 'w-5 h-5' },
            to: '/reports',
          },
          {
            name: 'Communication',
            icon: { name: 'ph:file-text', class: 'w-5 h-5' },
            to: '/communication',
          },
          // {
          //   name: 'Documentation',
          //   icon: { name: 'ph:app-window-duotone', class: 'w-5 h-5' },
          //   activePath: '/',
          //   children: [
          //     {
          //       name: 'Collapse',
          //       to: '/',
          //       icon: { name: 'ph:sidebar-duotone', class: 'w-4 h-4' },
          //     },
          //     {
          //       name: 'Collapse 2 ',
          //       to: '/',
          //       icon: { name: 'ph:sidebar-duotone', class: 'w-4 h-4' },
          //     },
          //   ],
          // },
          // {
          //   name: 'Search',
          //   icon: { name: 'ph:magnifying-glass-duotone', class: 'w-5 h-5' },
          //   click: () => {
          //     const { open } = usePanels()
          //     open('search')
          //   },
          // },
          {
            name: 'Divider',
            divider: true,
          },
          {
            name: 'Settings',
            icon: { name: 'ph:gear-six-duotone', class: 'w-5 h-5' },
            // to: '/settings',
          },
        ],
      },
    },
    panels: [
      {
        name: 'language',
        position: 'right',
        component: 'DemoPanelLanguage',
      },
    ],
  },
})
