<script lang="ts" setup>
const route = useRoute()
const inPosts = computed(() => route.path.startsWith('/posts') || route.path.startsWith('/articles'))
</script>

<template>
  <div>
    <InkField />
    <div class="page">
      <header class="site-header" role="banner">
        <div class="header-top">
          <p class="site-title">
            <NuxtLink to="/">Wes Doyle</NuxtLink>
          </p>
          <nav class="site-links" aria-label="Elsewhere">
            <a href="https://github.com/wesdoyle" target="_blank" rel="noopener">GitHub</a>
            <a href="https://youtube.com/c/wesdoyle" target="_blank" rel="noopener">YouTube</a>
            <a href="https://www.linkedin.com/in/wes-doyle/" target="_blank" rel="noopener">LinkedIn</a>
          </nav>
        </div>
        <nav class="site-nav" role="navigation" aria-label="Main navigation">
          <NuxtLink to="/posts" :class="{ on: inPosts }">Posts</NuxtLink>
          <NuxtLink to="/reading" active-class="on">Reading</NuxtLink>
          <NuxtLink to="/passages" active-class="on">Passages</NuxtLink>
          <NuxtLink to="/about" active-class="on">About</NuxtLink>
          <ThemeToggle />
        </nav>
      </header>

      <main id="main-content" role="main">
        <slot />
      </main>
    </div>
  </div>
</template>
