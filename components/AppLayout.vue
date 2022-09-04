<template>
  <div class="sm:pb-16">
    <Html lang="en" />
    <AppNavbar />
    <slot />
  </div>
</template>

<style lang="postcss">
body {
  @apply bg-slate-50;
  @apply text-slate-500;
}
</style>
