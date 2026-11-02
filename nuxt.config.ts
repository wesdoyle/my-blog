export default defineNuxtConfig({
  compatibilityDate: '2025-01-12',

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

  runtimeConfig: {
    public: {
      siteUrl: 'https://wesdoyle.net'
    }
  },

  nitro: {
    preset: 'aws-amplify',
    // Match the Node 22 build: Nuxt Content picks node:sqlite, which Node 20 lacks.
    // Amplify accepts nodejs22.x; Nitro's type has not caught up.
    awsAmplify: { runtime: 'nodejs22.x' as 'nodejs20.x' },
    // Render each page to HTML at build time, so link previews see its meta tags.
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
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
