import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    'nuxt-icon'
  ],
  // https://content.nuxtjs.org
  content: {
    documentDriven: true,
    highlight: {
      theme: 'vitesse-dark',
      preload: ['csharp', 'cpp', 'java', 'sql', 'python', 'rust', 'lisp', 'shell']
    }
  }
})
