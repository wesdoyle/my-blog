<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-6xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Latest Videos
      </h1>
      <main class="grow text-lg">
        <p class="mb-6">
          My content focuses primarily on software engineering,
          cloud architecture, machine learning, and hands-on tutorials.
        </p>
        <button class="p-2 border border-1" @click="prevPage">
          Previous Page
        </button>
        <button class="p-2 border border-1" @click="nextPage">
          Next Page
        </button>
        {{ page }}
        <YouTubeFeed :feed="currentFeed" />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/reactivity'
import YouTubeFeed from '../../components/youtube/YouTubeFeed'
import IYouTubeVideo from '~/types/YouTubeVideo'
import allVideos from '~/allVideos.json'

const feed: IYouTubeVideo[] = allVideos

const currentPage = ref(1)
const perPage = 3
const maxPages = allVideos.length / perPage

const prevPage = function () {
  if (currentPage.value >= 0) {
    currentPage.value -= 1
  }
}

const nextPage = function () {
  if (currentPage.value <= maxPages) {
    currentPage.value += 1
  }
}

const currentFeed = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = currentPage.value + perPage
  return feed.slice(start, end - 1)
})

</script>
