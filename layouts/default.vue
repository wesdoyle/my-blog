<template>
  <div>
    <header class="site-header" role="banner">
      <div class="header-top">
        <h1 class="site-title">
          <NuxtLink to="/">Wes Doyle</NuxtLink>
        </h1>
        <div class="site-links">
          <a href="https://github.com/wesdoyle" target="_blank">GitHub</a>
          <span class="nav-sep" aria-hidden="true"></span>
          <a href="https://youtube.com/c/wesdoyle" target="_blank">YouTube</a>
          <span class="nav-sep" aria-hidden="true"></span>
          <a href="https://www.linkedin.com/in/wes-doyle/" target="_blank">LinkedIn</a>
        </div>
      </div>
      <nav class="site-nav" role="navigation" aria-label="Main navigation">
        <NuxtLink to="/">Blog</NuxtLink>
        <span class="nav-sep" aria-hidden="true"></span>
        <NuxtLink to="/reading">Reading</NuxtLink>
        <span class="nav-sep" aria-hidden="true"></span>
        <NuxtLink to="/about">About</NuxtLink>
      </nav>
    </header>

    <main id="main-content" role="main">
      <slot />
    </main>
  </div>
</template>
