<script lang="ts" setup>
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const path = `/reading/${route.params.slug}`

const { data: book } = await useAsyncData(`book-${path}`, () =>
  queryCollection('content')
    .where('path', '=', path)
    .first()
)

if (!book.value) {
  throw createError({ statusCode: 404, message: 'Book not found' })
}

useHead({ title: computed(() => `${book.value?.title ?? 'Book'} · Wes Doyle`) })

const { data: books } = await useBooks()
const { data: posts } = await usePosts()

const meta = computed(() => books.value?.find(b => b.path === path))
const threads = computed(() => (meta.value?.threads ?? []).map(id => ({ id, name: threadName(id) })))

const also = computed(() => {
  const first = meta.value?.threads[0]
  if (!first) return []
  return (books.value ?? [])
    .filter(b => b.path !== path && b.threads.includes(first))
    .sort((a, b) => Number(b.notes) - Number(a.notes))
    .slice(0, 3)
})
const alsoThread = computed(() => meta.value?.threads[0] ?? '')

const postsNearby = computed(() => {
  const mine = meta.value?.threads ?? []
  return (posts.value ?? []).filter(p => p.threads.some(t => mine.includes(t))).slice(0, 2)
})
</script>

<template>
  <article v-if="book">
    <p class="meta" style="margin: 0 0 0.625rem">
      <NuxtLink to="/reading">Reading</NuxtLink><template v-if="meta?.year"> · {{ meta.year }}</template>
    </p>
    <h1 class="page-title"><i>{{ book.title }}</i></h1>
    <p v-if="book.author" class="byline" style="margin-bottom: 0">{{ book.author }}</p>
    <p class="meta" style="margin: 0.5rem 0 0">
      <template v-if="meta?.finished">Finished {{ meta.finished }}</template>
      <template v-for="th in threads" :key="th.id"> ·
        <NuxtLink :to="{ path: '/reading', query: { thread: th.id } }">{{ th.name }}</NuxtLink>
      </template>
    </p>

    <section v-if="meta?.notes" class="sec" aria-label="Notes">
      <p class="mg">notes</p>
      <div class="book-body">
        <ContentRenderer :value="book" />
      </div>
    </section>
    <p v-else class="sec empty">No notes on this one.</p>

    <section v-if="also.length" class="sec" aria-label="Also in this thread">
      <p class="mg">also in this thread</p>
      <ul class="books">
        <li v-for="b in also" :key="b.path">
          <NuxtLink v-if="b.notes" :to="b.path"><i>{{ b.title }}</i></NuxtLink>
          <i v-else>{{ b.title }}</i>
          <span v-if="b.author" class="au">{{ b.author }}</span>
          <NuxtLink v-if="b.notes" class="nt" :to="b.path" :aria-label="`Notes on ${b.title}`">¶</NuxtLink>
        </li>
      </ul>
      <p class="meta" style="margin: 0.75rem 0 0">
        More in <NuxtLink :to="{ path: '/reading', query: { thread: alsoThread } }">{{ threadName(alsoThread).toLowerCase() }}</NuxtLink>
      </p>
    </section>

    <section v-if="postsNearby.length" class="sec" aria-label="Posts nearby">
      <p class="mg">posts nearby</p>
      <ul class="books">
        <li v-for="p in postsNearby" :key="p.path">
          <NuxtLink :to="p.path">{{ p.title }}</NuxtLink>
          <span class="aside">{{ p.dateShort }}</span>
        </li>
      </ul>
    </section>
  </article>
</template>
