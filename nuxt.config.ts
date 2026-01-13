export default defineNuxtConfig({
  compatibilityDate: '2025-01-12',

  modules: ['@nuxt/content'],

  nitro: {
    preset: 'static'
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
    }
  },

  css: ['~/assets/css/main.css'],

  vite: {
    optimizeDeps: {
      exclude: ['sqlite3', 'better-sqlite3']
    }
  }
})
