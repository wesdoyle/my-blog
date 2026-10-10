<script lang="ts" setup>
definePageMeta({ key: route => route.fullPath })

const route = useRoute()
const { data: article } = await useAsyncData(`article-${route.path}`, () =>
  queryCollection('content')
    .where('path', '=', route.path)
    .first()
)

if (!article.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

useHead({ title: computed(() => `${article.value?.title ?? 'Post'} · Wes Doyle`) })

const { data: posts } = await usePosts()
const { data: books } = await useBooks()

const meta = computed(() => posts.value?.find(p => p.path === route.path))
const index = computed(() => posts.value?.findIndex(p => p.path === route.path) ?? -1)
// Posts are newest first: "previous" is the older post, "next" the newer one.
const previous = computed(() => (index.value >= 0 ? posts.value?.[index.value + 1] : undefined))
const next = computed(() => (index.value > 0 ? posts.value?.[index.value - 1] : undefined))

const tags = computed(() => (meta.value?.tags ?? []).map(t => ({ name: t, thread: threadForTag(t)?.id })))

// Books nearby: the ones named in front matter, else books with notes that share a thread.
const nearby = computed(() => {
  const shelf = books.value ?? []
  const named = (meta.value?.nearby ?? [])
    .map(slug => shelf.find(b => b.slug === slug))
    .filter((b): b is Book => Boolean(b))
  if (named.length) return named.slice(0, 3)
  const threads = meta.value?.threads ?? []
  return shelf.filter(b => b.notes && b.threads.some(t => threads.includes(t))).slice(0, 3)
})

const nearbyThread = computed(() => {
  const own = meta.value?.threads ?? []
  const counts = new Map<string, number>()
  for (const b of nearby.value) for (const t of b.threads) counts.set(t, (counts.get(t) ?? 0) + (own.includes(t) ? 2 : 1))
  const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]
  return best ? best[0] : ''
})
const nearbyThreadName = computed(() => threadName(nearbyThread.value).toLowerCase())
</script>

<template>
  <article v-if="article">
    <header class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <p class="meta" style="margin: 0">
        <time :datetime="article.date">{{ meta?.dateLong }}</time>
        <template v-if="meta"> · {{ meta.minutes }} min</template>
        <template v-if="tags.length"> ·
          <template v-for="(tag, j) in tags" :key="tag.name">
            <NuxtLink v-if="tag.thread" :to="{ path: '/reading', query: { thread: tag.thread } }">{{ tag.name }}</NuxtLink>
            <span v-else>{{ tag.name }}</span><template v-if="j < tags.length - 1">, </template>
          </template>
        </template>
      </p>
    </header>

    <ContentRenderer :value="article" />

    <section v-if="nearby.length" class="sec related" aria-label="Books nearby">
      <p class="mg">books nearby</p>
      <ul class="books">
        <li v-for="book in nearby" :key="book.path">
          <NuxtLink v-if="book.notes" :to="book.path"><i>{{ book.title }}</i></NuxtLink>
          <i v-else>{{ book.title }}</i>
          <span v-if="book.author" class="au">{{ book.author }}</span>
          <NuxtLink v-if="book.notes" class="nt" :to="book.path" :aria-label="`Notes on ${book.title}`">¶</NuxtLink>
        </li>
      </ul>
      <p v-if="nearbyThread" class="meta" style="margin: 0.75rem 0 0">
        From the thread <NuxtLink :to="{ path: '/reading', query: { thread: nearbyThread } }">{{ nearbyThreadName }}</NuxtLink>
      </p>
    </section>

    <nav v-if="previous || next" class="pager" aria-label="More posts">
      <NuxtLink v-if="previous" :to="previous.path"><span class="k">previous</span>{{ previous.title }}</NuxtLink>
      <NuxtLink v-if="next" class="next" :to="next.path"><span class="k">next</span>{{ next.title }}</NuxtLink>
    </nav>
  </article>
</template>
