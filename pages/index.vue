<script lang="ts" setup>
const { data } = await useAsyncData('articles', () => queryContent('articles').sort({ date: -1 }).find())
</script>

<template>
  <div class="flex justify-between max-w-prose px-4 py-4 mx-auto sm:px-8">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Blog
      </h1>
      <main class="grow mx-auto">
        <div v-for="article of data" :key="article.title" class="mb-12">
          <div class="mb-2 pb-2 border-b">
            <NuxtLink :to="`${article.slug}`">
              <h2 class="text-lg mr-3 text-sm font-semibold text-blue-500">
                <NuxtLink :to="article._path">
                  {{ article.title }}
                </NuxtLink>
              </h2>
            </NuxtLink>
            <div class="text-sm text-blue-300">
              {{ new Date(article.date).toDateString() }}
            </div>
          </div>
          <div class="text-slate-400 text-sm">
            {{ article.excerpt.children[0].children[0].value }} ...
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
