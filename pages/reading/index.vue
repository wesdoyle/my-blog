<script lang="ts" setup>
const { data } = await useAsyncData('reading', () => queryContent('reading').sort({ date: -1 }).find())
</script>

<template>
  <div class="flex justify-between max-w-3xl px-4 py-4 mx-auto sm:px-8">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Reading List
      </h1>
      <main class="grow mx-auto">
        <ContentList v-slot="{ list }" path="/reading">
          <div v-for="article in list" :key="article._path" class="mb-8">
            <ContentRenderer :value="article">
              <h2 class="text-lg mr-3 pb-1 text-sm border-b border-slate-300 mb-3 font-semibold text-blue-500">
                {{ article.title }}
              </h2>
              <ContentRendererMarkdown :value="article" />
            </ContentRenderer>
          </div>
        </ContentList>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
