<script lang="ts" setup>
useHead({ title: 'Wes Doyle' })

const { data: books } = await useBooks()
const { data: posts } = await usePosts()

const latestBook = computed(() => books.value?.[0])
const latestPost = computed(() => posts.value?.[0])
const recent = computed(() => posts.value?.slice(0, 4) ?? [])

// "on the importance of ..." from a description like "The importance of ..."
const latestAbout = computed(() => {
  const d = latestPost.value?.description?.trim().replace(/\.$/, '')
  return d ? d.charAt(0).toLowerCase() + d.slice(1) : ''
})

// One short passage, set alone. Changes daily.
const hero = computed(() => {
  const all = (books.value ?? []).flatMap(book =>
    book.passages
      .filter(p => p.join(' ').length <= 280)
      .map(paras => ({ paras, book }))
  )
  if (!all.length) return null
  const day = Math.floor(Date.now() / 86400000)
  return all[day % all.length]
})
</script>

<template>
  <div>
    <p class="lede">
      Notes on what I'm reading, and the occasional post on engineering.
    </p>

    <section v-if="latestBook || latestPost" class="sec" aria-label="Latest">
      <p class="mg">latest</p>
      <p v-if="latestBook">
        Finished <i>{{ latestBook.title }}</i><template v-if="latestBook.author"> by {{ latestBook.author }}</template><template v-if="latestBook.finishedMonth">, in {{ latestBook.finishedMonth }}</template>.
      </p>
      <p v-if="latestPost" style="margin: 0">
        Posted <NuxtLink :to="latestPost.path">{{ latestPost.title }}</NuxtLink><template v-if="latestAbout">, on {{ latestAbout }}</template>.
        <span class="meta">{{ latestPost.dateDay }}</span>
      </p>
    </section>

    <section v-if="hero" class="sec hero" aria-label="A passage">
      <blockquote class="passage">
        <p v-for="(p, i) in hero.paras" :key="i">{{ p }}</p>
      </blockquote>
      <p class="attr">
        <template v-if="hero.book.author"><span class="sc">{{ hero.book.author }}</span>, </template>
        <NuxtLink :to="hero.book.path"><i>{{ hero.book.title }}</i></NuxtLink>
      </p>
    </section>

    <section class="sec" aria-label="Recent posts">
      <p class="mg">posts</p>
      <ul class="row-list" role="list">
        <li v-for="post in recent" :key="post.path">
          <div class="row">
            <span class="dt">{{ post.dateShort }}</span>
            <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
          </div>
        </li>
      </ul>
      <p class="meta" style="margin: 1.125rem 0 0">
        <NuxtLink to="/posts">All posts</NuxtLink>
      </p>
    </section>

    <!-- TEMPORARY: tuning panel for the hidden-text layer. Remove when dialed in. -->
    <InkTuner />
  </div>
</template>
