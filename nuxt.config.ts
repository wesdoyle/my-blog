export default defineNuxtConfig({
  compatibilityDate: '2025-01-12',

  modules: ['@nuxt/content'],

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
    worker: {
      format: 'es'
    },
    optimizeDeps: {
      exclude: ['@sqlite.org/sqlite-wasm', 'sqlite3', 'better-sqlite3']
    },
    build: {
      rollupOptions: {
        external: ['@sqlite.org/sqlite-wasm']
      }
    }
  }
})
