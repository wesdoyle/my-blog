<script lang="ts" setup>
const { data: page } = await useAsyncData('about', () =>
  queryCollection('content')
    .where('path', '=', '/about')
    .first()
)
</script>

<template>
  <article v-if="page">
    <h1>{{ page.title }}</h1>
    <ContentRenderer :value="page" />
  </article>
</template>
