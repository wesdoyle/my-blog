<template>
  <div class="sm:grid sm:grid-cols-2 pb-4 border-b border-neutral-200">
    <div class="sm:flex">
      <iframe
        :src="`https://www.youtube.com/embed/${videoId}`"
        :title="`YouTube video player: ${videoId}`"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>
    <div class="sm:grow">
      <div class="sm:flex mt-1 sm:w-full underline">
        <h2 class="pb-1">
          <a :href="`https://youtube.com/watch?v=${videoId}`" target="_blank">
            {{ title }}
          </a>
        </h2>
      </div>
      <div class="mb-2">
        <span class="text-sm">
          {{ description }}
        </span>
      </div>
      <div class="mb-2 sm:flex sm:flex-wrap inline">
        <div
          v-for="tag in tags"
          :key="tag"
          class="text-sm m-1 p-1 bg-neutral-200 text-neutral-400 font-mono inline-block sm:block flex-wrap"
        >
          {{ tag }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  videoId?: string
  tags?: string[]
  description?: string
}>()
</script>

<style scoped>
</style>
