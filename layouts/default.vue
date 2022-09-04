<template>
  <div class="py-10 m-auto bg-white">
    <main class="max-w-3xl px-4 mx-auto prose sm:px-8 prose-gray">
      <slot />
    </main>
  </div>
</template>

<style lang="postcss">
/* Customize headers to remove default underline */
.prose h2 a,
.prose h3 a {
  @apply no-underline;
  &:hover {
    @apply border-b border-neutral-600 dark:border-neutral-300;
  }
}
</style>
