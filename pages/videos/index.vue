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
        <div class="flex text-sm font-mono w-full justify-between my-2">
          <button
            class="p-3 border border-1 bg-slate-800 text-slate-300"
            @click="prevPage"
          >
            Previous Page
          </button>
          <button
            v-for="pageNumber of pageNumbers"
            :key="pageNumber"
            class="p-1 text-slate-500"
            @click="goToPage(pageNumber)"
          >
            {{ pageNumber }}
          </button>
          <button
            class="p-3 border border-1 bg-slate-800 text-slate-300"
            @click="nextPage"
          >
            Next Page
          </button>
        </div>
        <div class="font-mono text-sm mt-4">
          Page {{ currentPage }} of {{ totalPages }} (Showing videos {{ startVid+1 }} to {{ endVid }} of {{ totalVids }})
        </div>
        <hr class="mt-4 mb-2"/>
        <YouTubeFeed :feed="currentFeed" />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/reactivity'
import YouTubeFeed from '../../components/youtube/YouTubeFeed.vue'
import IYouTubeVideo from '~/types/YouTubeVideo'
import allVideos from '~/allVideos.json'

const feed: IYouTubeVideo[] = allVideos

const startVid = ref()
const endVid = ref()

const currentPage = ref(1)
const perPage = 8
const totalPages = computed(() => allVideos.length / perPage)

const totalVids = feed.length

const pageNumbers = computed(() => {
  const pageNumbers: Array<number> = []
  for (let i = 0; i < totalPages.value; i++) {
    pageNumbers.push(i + 1)
  }
  return pageNumbers
})

const prevPage = function () {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const nextPage = function () {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const goToPage = function (pageNumber) {
  currentPage.value = pageNumber
}

const currentFeed = computed(() => {
  startVid.value = (currentPage.value - 1) * perPage
  endVid.value = startVid.value + perPage
  return feed.slice(startVid.value, endVid.value)
})

</script>
