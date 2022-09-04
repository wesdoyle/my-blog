import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/markdownit',
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  // https://content.nuxtjs.org
  content: {
    documentDriven: true,
    highlight: {
      // See the available themes on https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-theme
      theme: 'material-default'
    },
    markdown: {
      remarkPlugins: {
        'remark-emoji': {
          emoticon: true
        },
        'remark-gfm': false,
        'remark-oembed': {
          // Options
        }
      },
      // Array syntax can be used to add plugins
      rehypePlugins: ['rehype-figure']
    }
  }
})
