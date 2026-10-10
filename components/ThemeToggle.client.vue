<script lang="ts" setup>
const { mode, init, cycle } = useTheme()
onMounted(init)
const label = computed(() => (mode.value === 'auto' ? 'Auto' : mode.value === 'light' ? 'Light' : 'Shadows'))
</script>

<template>
  <button type="button" class="theme-toggle" :aria-label="`Theme: ${label}. Change theme`" @click="cycle">
    {{ label }}
  </button>
</template>
