<template>
  <div>
    <div v-for="video in feed" :key="video.url">
      <div>
        {{ video.title }}
      </div>
      <div v-if="video.tags && video.tags.length">
        <span v-for="tag in video.tags" :key="tag">
          {{ tag }}
        </span>
      </div>
      <YouTubeVideo
        :url="video.url"
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
