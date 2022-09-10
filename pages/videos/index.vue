<template>
  <div class="flex justify-between px-4 py-4 mx-auto sm:px-8 max-w-3xl">
    <div class="flex flex-col min-h-screen overflow-hidden">
      <h1 class="font-bold my-8 text-2xl text-slate-600">
        Latest Videos
      </h1>
      <main class="grow text-lg">
        <p class="mb-6">
          This is a feed of my latest YouTube videos. My content focuses primarily on software engineering,
          cloud architecture, machine learning, and hands-on tutorials.
        </p>
        <YouTubeFeed :feed="feed" />
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
import YouTubeFeed from '../../components/youtube/YouTubeFeed'
import IYouTubeVideo from '~/types/YouTubeVideo'
import allVideos from '~/allVideos.json'

const feed: IYouTubeVideo[] = allVideos

</script>
