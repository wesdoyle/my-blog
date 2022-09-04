<script lang="ts" setup>
const { data } = await useAsyncData('articles', () => queryContent('articles').sort({ date: -1 }).find())
</script>

<template>
  <div class="flex justify-between max-w-3xl px-4 py-4 mx-auto sm:px-8">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Blog
      </h1>
      <main class="grow mx-auto">
        <div v-for="article of data" :key="article.title" class="mb-12">
          <div class="flex justify-between border-b border-slate-300 mb-2">
            <span class="text-lg mr-3 pb-1">
              {{ article.title }}
            </span>
            <span class="text-sm text-slate-400">
              {{ new Date(article.date).toDateString() }}
            </span>
          </div>
          <div class="text-slate-400 text-sm">
            {{ article.excerpt.children[0].children[0].value }}
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
