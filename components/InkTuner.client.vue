<script lang="ts" setup>
// TEMPORARY: sliders for dialing in the hidden-text effect. Remove once tuned.
const { params, reset, source } = useInkTuning()

const controls = [
  { key: 'pitch', label: 'pitch (px)', min: 8, max: 24, step: 2 },
  { key: 'fontSize', label: 'font size (px)', min: 7, max: 24, step: 1 },
  { key: 'radius', label: 'brush radius (px)', min: 20, max: 300, step: 5 },
  { key: 'cycleMs', label: 'cycle mean (ms)', min: 0, max: 1500, step: 25 },
  { key: 'cycleSdMs', label: 'cycle sd (ms)', min: 0, max: 500, step: 10 },
  { key: 'flipMs', label: 'flip every (ms)', min: 15, max: 250, step: 5 },
  { key: 'fadeMs', label: 'fade out (ms)', min: 250, max: 12000, step: 250 },
  { key: 'holdMs', label: 'hold when still (ms)', min: 0, max: 6000, step: 250 },
  { key: 'alphaMin', label: 'alpha at edge', min: 0, max: 1, step: 0.05 },
  { key: 'alphaMax', label: 'alpha at centre', min: 0, max: 1, step: 0.05 },
  { key: 'colorMix', label: 'colour amount', min: 0, max: 1, step: 0.05 }
] as const

const open = ref(true)
const snippet = computed(() => JSON.stringify(params, null, 2))
</script>

<template>
  <aside class="ink-tuner" aria-label="Ink effect tuning (temporary)">
    <button type="button" class="ink-tuner-toggle" @click="open = !open">
      {{ open ? 'hide' : 'tune' }}
    </button>
    <div v-if="open" class="ink-tuner-body">
      <p class="ink-tuner-source">text: {{ source || 'none' }}</p>
      <label v-for="c in controls" :key="c.key">
        <span>{{ c.label }}</span>
        <input v-model.number="params[c.key]" type="range" :min="c.min" :max="c.max" :step="c.step">
        <output>{{ params[c.key] }}</output>
      </label>
      <label class="ink-tuner-text">
        <span>dot glyph</span>
        <input v-model="params.dotGlyph" type="text" maxlength="2" spellcheck="false">
        <output>{{ params.dotGlyph.codePointAt(0)?.toString(16) }}</output>
      </label>
      <div class="ink-tuner-row">
        <button type="button" @click="reset">reset</button>
      </div>
      <pre>{{ snippet }}</pre>
    </div>
  </aside>
</template>

<style scoped>
.ink-tuner {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 10;
  font: 12px/1.5 var(--font-mono);
  color: var(--text);
}

.ink-tuner-toggle,
.ink-tuner-row button {
  font: inherit;
  padding: 2px 8px;
  border: 1px solid var(--border);
  border-radius: 3px;
  background: var(--bg);
  color: var(--text-secondary);
  cursor: pointer;
}

.ink-tuner-toggle {
  position: absolute;
  right: 0;
  bottom: 100%;
  margin-bottom: 6px;
}

.ink-tuner-body {
  width: 260px;
  max-height: calc(100vh - 60px);
  overflow: auto;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg);
}

label {
  display: grid;
  grid-template-columns: 1fr 44px;
  align-items: center;
  gap: 0 8px;
  margin-bottom: 6px;
}

label span {
  grid-column: 1 / -1;
  color: var(--text-secondary);
}

input[type='range'] {
  width: 100%;
  margin: 0;
}

input[type='text'] {
  width: 100%;
  margin: 0;
  padding: 2px 6px;
  font: inherit;
  border: 1px solid var(--border);
  border-radius: 3px;
  background: var(--bg);
  color: var(--text);
}

output {
  text-align: right;
}

.ink-tuner-row {
  margin: 8px 0;
}

.ink-tuner-source {
  margin: 0 0 8px;
  color: var(--text-secondary);
}

pre {
  margin: 0;
  padding: 6px 8px;
  font: 11px/1.4 var(--font-mono);
  background: var(--border-subtle);
  border-radius: 3px;
  user-select: all;
}
</style>
