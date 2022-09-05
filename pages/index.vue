<script lang="ts" setup>
const { data } = await useAsyncData('articles', () => queryContent('articles').sort({ date: -1 }).find())
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto max-w-3xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Blog
      </h1>
      <p class="mb-8">
        This is my blog. I'm interested mostly in using this space to record thoughts about the experience of being an engineer.
        Any thoughts expressed in these posts are my own.
      </p>
      <p class="border-l-8 pl-4 border-slate-200 mb-8 text-slate-400">
        "I see that I am like a wave on the surface of the ocean. I see myself in all the other waves, and I see all the other waves in me. The manifestation or the disappearance of the waves does not lessen the presence of the ocean."
        <span class="italic">- Thich Nhat Hanh</span>
      </p>
      <main class="grow mx-auto">
        <ContentList
          v-slot="{ }"
          path="/reading"
        >
          <div v-for="article in data" :key="article._path">
            <NuxtLayout
              v-if="article && article.body.children.length"
              name="listing"
            >
              <a :href="article._path" class="no-underline hover:underline">
                <h2 class="mr-3 text-lg font-semibold text-blue-500">
                  {{ article.title }}
                </h2>
              </a>
              <h3 class="mr-3 text-xs text-blue-400 font-normal">
                {{ new Date(article.date).toDateString() }}
              </h3>
              <ContentRenderer
                :key="article._id"
                :value="article"
                :excerpt="true"
              />
            </NuxtLayout>
          </div>
        </ContentList>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
