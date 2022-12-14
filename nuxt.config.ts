import { defineNuxtConfig } from 'nuxt'
import remarkEmoji from 'remark-emoji'
import rehypeSlug from 'rehype-slug'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import rehypeExternalLinks from 'rehype-external-links'
import remarkGfm from 'remark-gfm'
import rehypeSortAttributeValues from 'rehype-sort-attribute-values'
import rehypeSortAttributes from 'rehype-sort-attributes'
import rehypeRaw from 'rehype-raw'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  ssr: true,
  target: 'static',
  head: {
    // link: [
    //   {
    //     rel: 'stylesheet',
    //     href: 'https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;500;700&family=Roboto+Slab&family=Rubik:wght@300;400&display=swap'
    //   }
    // ]
  },
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
    },
    markdown: {
      remarkPlugins: {
        'remark-emoji': {
          instance: remarkEmoji
        },
        'remark-squeeze-paragraphs': {
          instance: remarkSqueezeParagraphs
        },
        'remark-gfm': {
          instance: remarkGfm
        }
      },
      rehypePlugins: {
        'rehype-slug': {
          instance: rehypeSlug
        },
        'rehype-external-links': {
          instance: rehypeExternalLinks
        },
        'rehype-sort-attribute-values': {
          instance: rehypeSortAttributeValues
        },
        'rehype-sort-attributes': {
          instance: rehypeSortAttributes
        },
        'rehype-raw': {
          instance: rehypeRaw,
          passThrough: ['element']
        }
      }
    }
  }
})
