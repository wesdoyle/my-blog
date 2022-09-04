<script lang="ts" setup>
const { data } = await useAsyncData('articles', () => queryContent('articles').sort({ date: -1 }).find())
</script>

<template>
  <div class="flex justify-between px-4 py-4 mx-auto max-w-3xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Blog
      </h1>
      <main class="grow mx-auto">
        <ContentList v-slot="{ }" path="/reading">
          <div v-for="article in data" :key="article._path" class="mb-2">
            <NuxtLayout v-if="article && article.body.children.length" name="listing">
              <a :href="article._path" class="no-underline hover:underline">
                <h2 class="mr-3 text-lg font-semibold text-blue-500">
                  {{ article.title }}
                </h2>
              </a>
              <h3 class="mr-3 text-xs text-blue-400 font-normal">
                {{ new Date(article.date).toDateString() }}
              </h3>
              <ContentRenderer :key="article._id" :value="article" :excerpt="true" />
            </NuxtLayout>
          </div>
        </ContentList>
      </main>
    </div>
  </div>
</template>

<style scoped>
</style>
