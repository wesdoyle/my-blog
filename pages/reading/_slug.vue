<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <main class="grow">
      <article class="pb-12 sm:pb-16 lg:pb-24 bg-gray-50">
        <div class="pt-10 pb-8 mx-auto mb-8 text-lg border-b">
          <NuxtContent
            class="prose prose-sm sm:prose lg:prose-md xl:prose-md"
            :document="reading"
          />
        </div>
      </article>
    </main>
    <Footer />
  </div>
</template>

<script>
export default {
  components: {
  },
  async asyncData ({ $content, params }) {
    const reading = await $content('reading', params.slug).fetch()
    return { reading }
  }
}
</script>
