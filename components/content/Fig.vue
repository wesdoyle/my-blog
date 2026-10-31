<script setup lang="ts">
// A figure for articles. An SVG under assets/figures is inlined so its `currentColor` ink follows the
// page theme; anything else (a PNG under public/) falls through to a plain <img>.
//
//   ::fig{src="lit2img/fig-bpe-merges.svg"}
//   Caption, with *markdown* allowed.
//   ::
const props = defineProps<{ src: string; alt?: string; caption?: string }>()

const svgs = import.meta.glob('../../assets/figures/**/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>

const svg = computed(() => {
  if (!props.src.endsWith('.svg')) return undefined
  return Object.entries(svgs).find(([path]) => path.endsWith('/' + props.src))?.[1]
})
</script>

<template>
  <figure class="fig">
    <div v-if="svg" class="fig-svg" v-html="svg" />
    <img v-else :src="src" :alt="alt ?? caption ?? ''" loading="lazy" />
    <figcaption v-if="caption || $slots.default">
      <slot>{{ caption }}</slot>
    </figcaption>
  </figure>
</template>
