<script lang="ts" setup>
const { data: books } = await useAsyncData('reading', () =>
  queryCollection('content')
    .select('path', 'title', 'author', 'date', 'body')
    .where('path', 'LIKE', '/reading/%')
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <div>
    <h1>Reading List</h1>

    <div class="reading-list">
      <div v-for="book in books" :key="book.path" class="book-entry">
        <div class="book-header">
          <span class="book-title">{{ book.title }}</span>
          <span class="book-author" v-if="book.author">, by {{ book.author }}</span>
        </div>
        <div v-if="book.body" class="book-notes">
          <ContentRenderer :value="book" />
        </div>
      </div>
    </div>
  </div>
</template>
