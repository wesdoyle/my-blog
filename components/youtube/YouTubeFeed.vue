<template>
  <div class="grid gap-1 grid-cols-1">
    <div v-for="video in feed" :key="video.id" class="m-4">
      <YouTubeVideo
        :video-id="video.id"
        :title="video.title"
        :tags="video.tags"
        :description="video.description"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import YouTubeVideo from './YouTubeVideo'
import IYouTubeVideo from '~/types/YouTubeVideo'
defineProps<{
  feed: IYouTubeVideo[]
}>()
</script>

<style scoped>
</style>
