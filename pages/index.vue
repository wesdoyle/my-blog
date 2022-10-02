<script lang="ts" setup>
const { data } = await useAsyncData('articles', () => queryContent('articles').sort({ date: -1 }).find())
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto max-w-6xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Blog
      </h1>
      <p class="mb-8">
        I'm interested mostly in using this space to record thoughts about the experience of being an engineer
        and to log explorations of interesting problems. Any thoughts expressed in these posts are my own.
      </p>
      <p class="border-l-4 pl-4 border-slate-200 mb-8 text-slate-400">
        "I see that I am like a wave on the surface of the ocean. I see myself in all the other waves, and I see all the other waves in me. The manifestation or the disappearance of the waves does not lessen the presence of the ocean."
        <span class="italic">- Thich Nhat Hanh</span>
      </p>
      <main>
        <ContentList
          path="/reading"
        >
          <div v-for="article in data" :key="article._path" class="w-full">
            <NuxtLayout
              v-if="article && article.body.children.length"
              name="blog-listing"
            >
              <div class="grid grid-cols-2 gap-4">
                <div class="border-r border-blue-100 bg-slate-100 p-8">
                  <a :href="article._path" class="no-underline hover:underline">
                    <h2 class="mr-3 text-lg font-semibold text-blue-400">
                      {{ article.title }}
                    </h2>
                  </a>
                  <h3 class="mr-3 text-xs text-blue-300 font-normal">
                    {{ new Date(article.date).toDateString() }}
                  </h3>
                </div>
                <div>
                  <ContentRendererMarkdown
                    :key="article._id"
                    :value="article"
                    :excerpt="true"
                    class="text-slate-500"
                  />
                </div>
              </div>
            </NuxtLayout>
          </div>
        </ContentList>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
