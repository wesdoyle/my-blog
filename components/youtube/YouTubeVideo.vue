<template>
  <div class="my-2">
    <div class="flex">
      <h2 class="text-xl font-semibold mb-2">
        {{ title }}
      </h2>
    </div>
    <YouTube :src="url" />
  </div>
</template>

<script setup lang="ts">
import YouTube from 'vue3-youtube'
defineProps<{
  title?: string
  url?: string
  tags?: string[]
  description?: string
}>()
</script>

<style scoped>
</style>
