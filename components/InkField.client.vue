<script lang="ts" setup>
// Mounts the halftone ink field behind the page. Restarts when the theme or the
// motion preference changes so it picks up the new palette.
import { createInkField } from '~/utils/inkField'

const canvas = ref<HTMLCanvasElement | null>(null)
let stop: (() => void) | null = null
const queries: MediaQueryList[] = []

function start () {
  stop?.()
  const el = canvas.value ?? document.querySelector<HTMLCanvasElement>('canvas.ink-field')
  stop = el ? createInkField(el) : null
}

onMounted(async () => {
  await nextTick()
  start()
  for (const q of ['(prefers-color-scheme: dark)', '(prefers-reduced-motion: reduce)']) {
    const mq = window.matchMedia(q)
    mq.addEventListener('change', start)
    queries.push(mq)
  }
  window.addEventListener('themechange', start)
})

onBeforeUnmount(() => {
  stop?.()
  queries.forEach(mq => mq.removeEventListener('change', start))
  window.removeEventListener('themechange', start)
})
</script>

<template>
  <canvas ref="canvas" class="ink-field" aria-hidden="true" />
</template>
