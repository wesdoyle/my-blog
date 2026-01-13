export default defineNuxtConfig({
  compatibilityDate: '2025-01-12',

  modules: ['@nuxt/content'],

  nitro: {
    preset: 'aws-amplify'
  },

  content: {
    build: {
      markdown: {
        highlight: false,
        remarkPlugins: {
          'remark-gfm': {}
        },
        rehypePlugins: {
          'rehype-slug': {},
          'rehype-external-links': {}
        }
      }
    },
    experimental: {
      sqliteConnector: 'native'
    }
  },

  css: ['~/assets/css/main.css'],

  hooks: {
    'vite:extendConfig': (config) => {
      config.resolve = config.resolve || {}
      config.resolve.alias = config.resolve.alias || {}
      // @ts-ignore
      config.resolve.alias['@sqlite.org/sqlite-wasm'] = false
    }
  }
})
