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
    // Amplify sends page routes to the server; bundle the prerendered HTML so it serves
    // those files instead of querying the content database at request time.
    serveStatic: 'inline',
    // Render each page to HTML at build time, so link previews see its meta tags.
    prerender: {
      crawlLinks: true,
      routes: ['/', '/404.html']
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
