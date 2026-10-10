<script lang="ts" setup>
const { effective, init, toggle } = useTheme()
onMounted(init)
const isDark = computed(() => effective.value === 'dark')
</script>

<template>
  <button
    type="button"
    class="theme-switch"
    role="switch"
    :aria-checked="isDark"
    :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
    @click="toggle"
  >
    <span class="theme-switch-track" aria-hidden="true">
      <span class="theme-switch-knob">
        <svg v-if="isDark" viewBox="0 0 16 16" width="10" height="10">
          <path d="M10.5 2.5a5.5 5.5 0 1 0 3 10 5 5 0 0 1-3-10z" fill="currentColor" />
        </svg>
        <svg v-else viewBox="0 0 16 16" width="10" height="10">
          <circle cx="8" cy="8" r="3" fill="currentColor" />
          <g stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
            <path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4" />
          </g>
        </svg>
      </span>
    </span>
  </button>
</template>
