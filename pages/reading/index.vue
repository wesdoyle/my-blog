<script lang="ts" setup>
useHead({ title: 'Reading · Wes Doyle' })

const route = useRoute()
const { data: books } = await useBooks()
const threads = THREADS

const active = computed(() => (typeof route.query.thread === 'string' ? route.query.thread : ''))

const groups = computed(() => {
  const list = (books.value ?? []).filter(b =>
    !active.value ? true : active.value === 'notes' ? b.notes : b.threads.includes(active.value)
  )
  const out: { year: string, books: Book[] }[] = []
  for (const b of list) {
    const last = out[out.length - 1]
    if (last && last.year === b.year) last.books.push(b)
    else out.push({ year: b.year, books: [b] })
  }
  return out
})
</script>

<template>
  <div>
    <h1 class="page-title">Reading</h1>

    <nav class="threads" aria-label="Threads">
      <NuxtLink :to="{ path: '/reading' }" :class="{ on: !active }" :aria-current="!active ? 'true' : undefined">All</NuxtLink>
      <NuxtLink
        v-for="th in threads"
        :key="th.id"
        :to="{ path: '/reading', query: { thread: th.id } }"
        :class="{ on: active === th.id }"
        :aria-current="active === th.id ? 'true' : undefined"
      >{{ th.name }}</NuxtLink>
      <NuxtLink
        :to="{ path: '/reading', query: { thread: 'notes' } }"
        :class="{ on: active === 'notes' }"
        :aria-current="active === 'notes' ? 'true' : undefined"
      >With notes ¶</NuxtLink>
    </nav>

    <div class="shelf">
      <section v-for="group in groups" :key="group.year" class="sec" :aria-label="group.year">
        <p class="mg">{{ group.year }}</p>
        <ul class="books">
          <li v-for="book in group.books" :key="book.path">
            <NuxtLink v-if="book.notes" :to="book.path"><i>{{ book.title }}</i></NuxtLink>
            <i v-else>{{ book.title }}</i>
            <span v-if="book.author" class="au">{{ book.author }}</span>
            <NuxtLink v-if="book.notes" class="nt" :to="book.path" :aria-label="`Notes on ${book.title}`">¶</NuxtLink>
          </li>
        </ul>
      </section>
      <p v-if="!groups.length" class="empty sec">Nothing on this thread yet.</p>
    </div>
  </div>
</template>
