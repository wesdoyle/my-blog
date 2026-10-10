<script lang="ts" setup>
useHead({ title: 'Passages · Wes Doyle' })

const route = useRoute()
const { data: books } = await useBooks()
const threads = THREADS

const active = computed(() => (typeof route.query.thread === 'string' ? route.query.thread : ''))

// Every copied passage on the site, newest book first.
const items = computed(() => {
  const list = (books.value ?? []).flatMap(book =>
    book.passages.map((paras, k) => ({ key: `${book.path}#${k}`, paras, book, thread: book.threads[0] ?? '' }))
  ).filter(item => !active.value || item.book.threads.includes(active.value))
  return list.map((item, i) => ({
    ...item,
    threadLabel: threadName(item.thread).toLowerCase(),
    showThread: Boolean(item.thread) && item.thread !== list[i - 1]?.thread
  }))
})
</script>

<template>
  <div>
    <h1 class="page-title">Passages</h1>

    <nav class="threads" aria-label="Threads">
      <NuxtLink :to="{ path: '/passages' }" :class="{ on: !active }" :aria-current="!active ? 'true' : undefined">All</NuxtLink>
      <NuxtLink
        v-for="th in threads"
        :key="th.id"
        :to="{ path: '/passages', query: { thread: th.id } }"
        :class="{ on: active === th.id }"
        :aria-current="active === th.id ? 'true' : undefined"
      >{{ th.name }}</NuxtLink>
    </nav>

    <div class="passage-list">
      <figure v-for="item in items" :key="item.key">
        <p v-if="item.showThread" class="mg">{{ item.threadLabel }}</p>
        <blockquote class="passage">
          <p v-for="(p, i) in item.paras" :key="i">{{ p }}</p>
        </blockquote>
        <figcaption class="attr">
          <template v-if="item.book.author"><span class="sc">{{ item.book.author }}</span>, </template>
          <NuxtLink :to="item.book.path"><i>{{ item.book.title }}</i></NuxtLink>
          <span v-if="item.threadLabel" class="thread-note">{{ item.threadLabel }}</span>
        </figcaption>
      </figure>
      <p v-if="!items.length" class="empty">Nothing on this thread yet.</p>
    </div>
  </div>
</template>
