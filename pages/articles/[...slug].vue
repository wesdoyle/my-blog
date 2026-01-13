<script lang="ts" setup>
const route = useRoute()
const { data: article } = await useAsyncData(`article-${route.path}`, () =>
  queryCollection('content')
    .where('path', '=', route.path)
    .first()
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}
</script>

<template>
  <article v-if="article">
    <header class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <p class="article-meta">
        <time :datetime="article.date">
          {{ new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
        </time>
      </p>
    </header>

    <ContentRenderer :value="article" />
  </article>
</template>
