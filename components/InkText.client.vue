<script lang="ts" setup>
// Mounts the hidden-text layer behind the page. Skipped for reduced motion.
// Under Nuxt's client-only wrapper the template ref can still be empty on
// mount, so wait a tick and fall back to a query.
import { createInkText, type InkHandle } from '~/utils/inkText'

const canvas = ref<HTMLCanvasElement | null>(null)
const { params, source } = useInkTuning()
let handle: InkHandle | null = null

onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  await nextTick()
  const el = canvas.value ?? document.querySelector<HTMLCanvasElement>('canvas.ink-text')
  if (el) {
    handle = createInkText(el, params)
    source.value = `${handle.source.title}, ${handle.source.author}`
  }
})

// Param changes that affect the idle dot layer apply even with no pointer motion.
watch(params, () => handle?.refresh(), { deep: true })

onBeforeUnmount(() => {
  handle?.stop()
  handle = null
})
</script>

<template>
  <canvas ref="canvas" class="ink-text" aria-hidden="true" />
</template>
