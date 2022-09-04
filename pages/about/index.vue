<template>
  <div class="flex justify-between max-w-3xl px-4 py-4 mx-auto sm:px-8">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1>
        About
      </h1>
      <main class="grow max-w-6xl mx-auto">
        <section class="relative max-w-xl px-4 py-12 mx-auto lg:max-w-screen-xl sm:py-16 lg:py-24 sm:px-12 md:max-w-3xl lg:px-8">
          <div class="w-full lg:grid lg:gap-8 xl:gap-12 lg:grid-cols-3">
            <div class="col-span-2">
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index.vue',
  components: {
  },
  async asyncData ({ $content, params }) {
    const reading = await $content('reading', params.slug)
      .only([
        'title',
        'excerpt',
        'image',
        'slug',
        'tags',
        'date',
        'description',
        'author'
      ])
      .sortBy('date', 'desc')
      .fetch()
    return {
      reading
    }
  },
  methods: {
    formatDate (date) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  }
}
</script>

<style scoped>
</style>
