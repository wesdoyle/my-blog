<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-6xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Latest Videos
      </h1>
      <main class="grow text-lg">
        <p class="mb-4">
          My content focuses primarily on software engineering,
          cloud architecture, machine learning, and hands-on tutorials.
        </p>
        <h2 class="mb-1 font-semibold">
          Video Tags
        </h2>
        <div class="mb-4 sm:flex sm:flex-wrap inline">
          <div
            v-if="currentFilter && currentFilter.length"
            class="text-sm m-1 p-1 bg-neutral-400 text-neutral-200 font-mono inline-block sm:block flex-wrap cursor-pointer"
            @click="clearFilter"
          >
            clear filters
          </div>
          <div
            v-for="tag in allTags"
            :key="tag"
            class="text-sm m-1 p-1 bg-neutral-200 text-neutral-400 font-mono inline-block sm:block flex-wrap cursor-pointer"
            :class="{
              'text-blue-200': isInCurrentFilter(tag),
              'bg-blue-500': isInCurrentFilter(tag),
              'font-bold': isInCurrentFilter(tag),
            }"
            @click="filterBy(tag)"
          >
            {{ tag }}
          </div>
        </div>

        <h2 class="mb-1 font-semibold mt-4">
          Video Feed
        </h2>
        <div class="font-mono text-sm mt-4">
          Page {{ currentPage }} of {{ totalPages }} (Showing {{ startVid+1 }} to {{ endVid }} of {{ totalVids }} videos)
        </div>
        <div class="flex text-sm font-mono sm:w-full justify-between my-2">
          <button
            class="p-2 border border-1 bg-slate-800 text-slate-300"
            @click="prevPage"
          >
            Previous Page
          </button>
          <button
            v-for="pageNumber of pageNumbers"
            :key="pageNumber"
            class="p-1 text-slate-500 hidden md:block"
            @click="goToPage(pageNumber)"
          >
            {{ pageNumber }}
          </button>
          <button
            class="p-2 border border-1 bg-slate-800 text-slate-300"
            @click="nextPage"
          >
            Next Page
          </button>
        </div>
        <hr class="mt-4 mb-2">
        <YouTubeFeed :feed="currentFeed" />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from '@vue/reactivity'
import YouTubeFeed from '../../components/youtube/YouTubeFeed.vue'
import allVideos from '~/allVideos.json'

const feed = ref(allVideos)

const startVid = ref()
const endVid = ref()
const currentFilter = ref([])

const currentPage = ref(1)
const perPage = 10
const totalPages = computed(() => allVideos.length / perPage)

const totalVids = feed.value.length

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

const clearFilter = function () {
  feed.value = allVideos
  currentFilter.value = []
}

const goToPage = function (pageNumber) {
  currentPage.value = pageNumber
}

const filterBy = function (tag) {
  feed.value = allVideos
  if (currentFilter.value.includes(tag)) {
    const index = currentFilter.value.indexOf(tag)
    if (index > -1) {
      currentFilter.value.splice(index, 1)
    }
    if (currentFilter.value.length === 0) {
      feed.value = allVideos
      currentFilter.value = []
      return
    }
  } else {
    currentFilter.value.push(tag)
  }
  feed.value = feed.value.filter(obj => obj.tags.some(t => currentFilter.value.includes(t)))
}

const isInCurrentFilter = function (val) {
  return currentFilter.value.includes(val)
}

const currentFeed = computed(() => {
  startVid.value = (currentPage.value - 1) * perPage
  endVid.value = startVid.value + perPage
  return feed.value.slice(startVid.value, endVid.value)
})

const allTags = computed(() => {
  const tags = allVideos.map(vid => vid.tags)
  return [...new Set(tags.flat(1))]
})

</script>
