<script lang="ts" setup>
const { data: articles } = await useAsyncData('articles', () =>
  queryCollection('content')
    .where('path', 'LIKE', '/articles/%')
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <div>
    <p>
      I'm interested mostly in using this space to record thoughts about the experience of being an engineer
      and to log explorations of interesting problems.
    </p>

    <hr>

    <ul class="article-list" role="list">
      <li v-for="article in articles" :key="article.path">
        <span class="article-date">{{ new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
        <NuxtLink :to="article.path">{{ article.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>
