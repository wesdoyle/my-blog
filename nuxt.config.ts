export default defineNuxtConfig({
  compatibilityDate: '2025-01-12',

  ssr: false,

  modules: ['@nuxt/content'],

  app: {
    head: {
      script: [
        {
          // Apply a pinned theme before first paint to avoid a flash.
          innerHTML: "try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}"
        }
      ]
    }
  },

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

  vite: {
    optimizeDeps: {
      exclude: ['@sqlite.org/sqlite-wasm']
    },
    worker: {
      format: 'es'
    }
  }
})
