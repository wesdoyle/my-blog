import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional(),
        tags: z.union([z.string(), z.array(z.string())]).optional(),
        slug: z.string().optional(),
        // Posts: slugs of books on the shelf to list under "Books nearby".
        nearby: z.array(z.string()).optional()
      })
    })
  }
})
