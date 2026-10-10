<script lang="ts" setup>
useHead({ title: 'Wes Doyle' })

const { data: posts } = await usePosts()

const rows = computed(() => (posts.value ?? []).map((post, i, all) => ({
  post,
  showYear: i === 0 || post.year !== all[i - 1]?.year,
  tags: post.tags.map(t => ({ name: t, thread: threadForTag(t)?.id }))
})))
</script>

<template>
  <div>
    <h1 class="page-title">Posts</h1>

    <ul class="post-list" role="list">
      <li v-for="{ post, showYear, tags } in rows" :key="post.path">
        <p v-if="showYear" class="mg">{{ post.year }}</p>
        <div class="post-title">
          <NuxtLink :to="post.path">{{ post.title }}</NuxtLink>
        </div>
        <p v-if="post.description" class="post-desc">{{ post.description }}</p>
        <div class="meta">
          {{ post.dateShort }} · {{ post.minutes }} min<template v-if="tags.length"> ·
            <template v-for="(tag, j) in tags" :key="tag.name">
              <NuxtLink v-if="tag.thread" :to="{ path: '/reading', query: { thread: tag.thread } }">{{ tag.name }}</NuxtLink>
              <span v-else>{{ tag.name }}</span><template v-if="j < tags.length - 1">, </template>
            </template>
          </template>
        </div>
      </li>
    </ul>
  </div>
</template>
