// A hidden page of text on the halftone grid.
//
// One square grid covers the viewport. Every cell shows a small dot glyph in
// the outer margins (fading out toward the text column), so the halftone is
// itself made of characters. One character of a book's opening, chosen at
// random on each load, is pinned to every cell, laid out row by row, and is
// invisible until the pointer passes near.
// It then takes the dot's place: fading in while cycling through random
// letters, landing on its true letter, holding while the brush is near, and
// fading out over a few seconds as the dot returns. The frame loop only runs
// while letters are live; otherwise the canvas holds a static frame.

import { pickInkText, type InkSource } from './inkTexts'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = LOWER.toUpperCase()

// A quiet landscape, used to tint the letters by where they sit on the page:
// sky and cloud across the top, a far ridge, nearer hills, field below.
// Colours are mixed toward the ink colour by `colorMix`, so they read as a
// tint rather than a picture.
type RGB = [number, number, number]
const SKY: RGB = [64, 156, 222]
const CLOUD: RGB = [232, 230, 222]
const FAR_RIDGE: RGB = [78, 110, 164]
const NEAR_RIDGE: RGB = [48, 124, 78]
const HILL_LIT: RGB = [104, 178, 40]
const HILL_SHADE: RGB = [36, 116, 44]
const FIELD: RGB = [54, 142, 36]
const BUSH: RGB = [22, 76, 26]

const fract = (v: number) => v - Math.floor(v)
const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
const hash2 = (x: number, y: number) => fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453)

// Value noise in [0, 1] on a unit lattice.
const noise2 = (x: number, y: number) => {
  const x0 = Math.floor(x), y0 = Math.floor(y)
  const fx = smooth(x - x0), fy = smooth(y - y0)
  const a = hash2(x0, y0), b = hash2(x0 + 1, y0), c = hash2(x0, y0 + 1), d = hash2(x0 + 1, y0 + 1)
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy
}
const noise1 = (x: number) => noise2(x, 0.5)
const clamp01 = (v: number) => Math.max(0, Math.min(1, v))
const step = (lo: number, hi: number, v: number) => smooth(clamp01((v - lo) / (hi - lo)))

// u, v in [0, 1] across and down the viewport.
function landscape (u: number, v: number): RGB {
  const farRidge = 0.46 + 0.05 * noise1(u * 4 + 2) + 0.02 * noise1(u * 13 + 7)
  const nearRidge = 0.58 + 0.06 * noise1(u * 3 + 11) + 0.02 * noise1(u * 9 + 3)
  const fieldTop = 0.72 + 0.015 * noise1(u * 6 + 20)
  if (v < farRidge) {
    // Sky, with cloud where two octaves of noise pile up. Clouds thin out
    // toward the top of the sky.
    const n = 0.65 * noise2(u * 5, v * 7) + 0.35 * noise2(u * 11 + 3, v * 15 + 1)
    const cloud = step(0.5, 0.66, n) * (0.55 + 0.45 * step(0, 0.45, v))
    return mix(SKY, CLOUD, cloud)
  }
  if (v < nearRidge) {
    const t = (v - farRidge) / Math.max(0.01, nearRidge - farRidge)
    return mix(FAR_RIDGE, NEAR_RIDGE, 0.7 * t)
  }
  if (v < fieldTop) {
    // Hills: sunlit patches drift across a shaded base.
    const t = (v - nearRidge) / Math.max(0.01, fieldTop - nearRidge)
    const lit = step(0.4, 0.7, noise2(u * 7 + 5, v * 9))
    const base = mix(NEAR_RIDGE, HILL_SHADE, step(0, 0.5, t))
    return mix(base, HILL_LIT, 0.8 * lit)
  }
  // Field, darkening toward the bottom, with bushes in the near ground.
  const t = (v - fieldTop) / Math.max(0.01, 1 - fieldTop)
  const bush = step(0.6, 0.78, noise2(u * 9 + 1, v * 8 + 4)) * step(0.25, 0.8, t)
  return mix(mix(HILL_LIT, FIELD, step(0, 0.6, t)), BUSH, 0.7 * bush)
}

// Everything that shapes the effect. The object is read live, so a tuning
// panel can change values while the layer runs.
export interface InkParams {
  pitch: number // px between cells (characters and dots alike)
  fontSize: number // px, for the letters and the dot glyph alike
  dotGlyph: string // the idle glyph drawn in every margin cell, at fontSize
  radius: number // brush radius in px
  cycleMs: number // mean time to fade in and cycle through random letters
  cycleSdMs: number // each letter's cycle time is normal around the mean, cut at one sd
  flipMs: number // how long each random letter shows during the cycle
  fadeMs: number // fade out after the brush has moved away
  holdMs: number // a resting pointer holds its letters this long, then lets go
  alphaMin: number // intensity at the edge of the brush
  alphaMax: number // intensity at its centre
  colorMix: number // 0 = ink only, 1 = full landscape tint on a fresh letter
}

export const DEFAULT_INK: InkParams = {
  pitch: 16,
  fontSize: 12,
  dotGlyph: '·',
  radius: 80,
  cycleMs: 675,
  cycleSdMs: 150,
  flipMs: 35,
  fadeMs: 4750,
  holdMs: 2000,
  alphaMin: 0.15,
  alphaMax: 0.85,
  colorMix: 1
}

// A standard normal sample, rejected until it lies within one standard
// deviation, so cycle times vary but never stray far from the mean.
function boundedNormal (): number {
  for (let tries = 0; tries < 16; tries++) {
    const u = 1 - Math.random(), v = Math.random()
    const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    if (z >= -1 && z <= 1) return z
  }
  return 0
}

export interface InkHandle {
  stop: () => void
  refresh: () => void // rebuild the grid and the dot layer after a param change
  source: InkSource // which book's opening this layer is showing
}

export function createInkText (cv: HTMLCanvasElement, params: InkParams = DEFAULT_INK): InkHandle {
  const ctx = cv.getContext('2d')
  const source = pickInkText()
  const TEXT = source.text
  if (!ctx) return { stop: () => {}, refresh: () => {}, source }

  let W = 0, H = 0, cols = 0, rows = 0, dpr = 1, band = 0
  let gridPitch = 0 // the pitch the grid was last built for
  let off = 0 // half the pitch: cell centres
  let peak = new Float32Array(0) // brush intensity when last touched, 0 = dead
  let born = new Float64Array(0) // when the current reveal started
  let touched = new Float64Array(0) // when the brush was last near
  let cyc = new Float32Array(0) // this reveal's cycle time, drawn per letter
  let seed = new Uint16Array(0) // per-cell offset so neighbours cycle differently
  let ink = '' // letter colour, r,g,b
  let inkRGB: RGB = [61, 56, 51]
  let dot = '' // dot colour, r,g,b
  let darkInk = false // light ink on a dark page: lift the palette so it tints rather than dims
  let land = new Uint8ClampedArray(0) // landscape tint per cell, r,g,b
  let raf = 0
  let running = false
  let px = -1e9, py = -1e9 // last pointer position
  let pointerIn = false
  let lastMove = -1e9
  let baseKey = ''
  const base = document.createElement('canvas')
  const bctx = base.getContext('2d')!

  const mono = () => getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() || 'ui-monospace, Menlo, monospace'

  const readColours = () => {
    const css = getComputedStyle(document.documentElement)
    const rgb = (name: string, fb: string) => {
      const h = (css.getPropertyValue(name).trim() || fb).replace('#', '')
      return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(',')
    }
    ink = rgb('--text', '#3D3833')
    inkRGB = ink.split(',').map(Number) as RGB
    darkInk = (inkRGB[0] * 0.3 + inkRGB[1] * 0.59 + inkRGB[2] * 0.11) > 128
    dot = rgb('--dot', '#B9B2A7')
  }

  // The halftone band: full at the viewport edge, gone `band` px in. Matches
  // the CSS fallback's linear mask.
  const mask = (x: number) => band <= 0 ? 0 : Math.max(0, 1 - Math.min(x, W - x) / band)

  // The landscape tint for every cell. On the dark theme the palette is lifted
  // toward the page's light ink so colour reads as a tint, not a dimming.
  const buildLand = () => {
    const n = cols * rows
    land = new Uint8ClampedArray(n * 3)
    const lift: RGB = [236, 232, 224]
    for (let i = 0; i < n; i++) {
      let c = landscape(((i % cols) * gridPitch + off) / W, (Math.floor(i / cols) * gridPitch + off) / H)
      if (darkInk) c = mix(c, lift, 0.45)
      land[i * 3] = c[0]; land[i * 3 + 1] = c[1]; land[i * 3 + 2] = c[2]
    }
  }

  // Draw the idle dot layer once into the base canvas.
  const buildBase = () => {
    base.width = cv.width; base.height = cv.height
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    bctx.clearRect(0, 0, W, H)
    bctx.font = `${params.fontSize}px ${mono()}`
    bctx.textAlign = 'center'
    bctx.textBaseline = 'middle'
    bctx.fillStyle = `rgb(${dot})`
    for (let c = 0; c < cols; c++) {
      const x = c * gridPitch + off
      const m = mask(x)
      if (m < 0.02) continue
      bctx.globalAlpha = m
      for (let r = 0; r < rows; r++) bctx.fillText(params.dotGlyph, x, r * gridPitch + off)
    }
    bctx.globalAlpha = 1
    baseKey = `${gridPitch}|${params.dotGlyph}|${params.fontSize}|${dot}`
  }

  const showBase = () => {
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(base, 0, 0, W, H)
  }

  const resize = () => {
    W = document.documentElement.clientWidth
    H = window.innerHeight
    dpr = window.devicePixelRatio || 1
    cv.width = Math.round(W * dpr)
    cv.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    gridPitch = Math.max(6, Math.round(params.pitch))
    off = gridPitch / 2
    document.documentElement.style.setProperty('--grid', `${gridPitch}px`)
    band = W >= 900 ? Math.max(22, Math.min(220, (W - 940) / 2)) : 22
    cols = Math.ceil(W / gridPitch)
    rows = Math.ceil(H / gridPitch)
    const n = cols * rows
    peak = new Float32Array(n)
    born = new Float64Array(n)
    touched = new Float64Array(n)
    cyc = new Float32Array(n)
    seed = new Uint16Array(n)
    for (let i = 0; i < n; i++) seed[i] = (i * 7919) % 65521
    buildLand()
    buildBase()
    showBase()
  }

  const charAt = (i: number) => TEXT.charAt(i % TEXT.length)

  // Rebuild what a param change invalidates.
  const refresh = () => {
    if (Math.max(6, Math.round(params.pitch)) !== gridPitch) { resize(); return }
    if (`${gridPitch}|${params.dotGlyph}|${params.fontSize}|${dot}` !== baseKey) {
      buildBase()
      if (!running) showBase()
    }
  }

  // Smooth falloff from the brush centre to its edge.
  const intensity = (d: number) => {
    const t = Math.max(0, 1 - d / params.radius)
    const s = t * t * (3 - 2 * t)
    return params.alphaMin + (params.alphaMax - params.alphaMin) * s
  }

  // Touch every cell within the brush radius of (x, y).
  const brush = (x: number, y: number, now: number) => {
    const R = params.radius, P = gridPitch
    const c0 = Math.max(0, Math.floor((x - R - off) / P))
    const c1 = Math.min(cols - 1, Math.ceil((x + R - off) / P))
    const r0 = Math.max(0, Math.floor((y - R - off) / P))
    const r1 = Math.min(rows - 1, Math.ceil((y + R - off) / P))
    for (let r = r0; r <= r1; r++) {
      const dy = r * P + off - y
      for (let c = c0; c <= c1; c++) {
        const dx = c * P + off - x
        const d = Math.hypot(dx, dy)
        if (d > R) continue
        const i = r * cols + c
        const v = intensity(d)
        if (peak[i]! <= 0) {
          // A dead character: start a fresh reveal with its own cycle time.
          peak[i] = v
          born[i] = now
          cyc[i] = Math.max(0, params.cycleMs + params.cycleSdMs * boundedNormal())
        } else if (v > peak[i]!) {
          // Still visible: brighten without cycling again.
          peak[i] = v
        }
        touched[i] = now
      }
    }
  }

  const draw = (now: number) => {
    showBase()
    const P = gridPitch
    const half = P / 2
    const font = `${params.fontSize}px ${mono()}`
    ctx.font = font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let alive = 0
    const flip = Math.floor(now / Math.max(1, params.flipMs))
    for (let i = 0; i < peak.length; i++) {
      const p = peak[i]!
      if (p <= 0) continue
      const age = now - born[i]!
      let alpha: number
      let ch: string
      const truth = charAt(i)
      const cycle = cyc[i]!
      if (age < cycle) {
        // Fading in while cycling through random letters.
        alpha = p * (age / cycle)
        const k = (flip + seed[i]!) % 65521
        const pool = truth >= 'A' && truth <= 'Z' ? UPPER : LOWER
        ch = pool.charAt((k * 31 + i) % 26)
      } else {
        const since = now - touched[i]!
        alpha = p * Math.max(0, 1 - since / Math.max(1, params.fadeMs))
        ch = truth
        // Only a character that has finished fading out is retired.
        if (alpha <= 0.005) { peak[i] = 0; continue }
      }
      alive++
      const x = (i % cols) * P + off
      const y = Math.floor(i / cols) * P + off
      // The letter takes the dot's place: clear the cell, let the dot come
      // back as the letter fades, then draw the letter.
      ctx.clearRect(x - half, y - half, P, P)
      const m = mask(x)
      const presence = Math.min(1, alpha / p)
      if (m > 0.02 && presence < 1) {
        ctx.fillStyle = `rgba(${dot},${(m * (1 - presence)).toFixed(3)})`
        ctx.fillText(params.dotGlyph, x, y)
      }
      if (ch === ' ') continue
      // Tint toward the landscape while the letter is fresh; a letter fading
      // out slides back to plain ink.
      const k = presence * params.colorMix
      const r = inkRGB[0] + (land[i * 3]! - inkRGB[0]) * k
      const g = inkRGB[1] + (land[i * 3 + 1]! - inkRGB[1]) * k
      const b = inkRGB[2] + (land[i * 3 + 2]! - inkRGB[2]) * k
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${alpha.toFixed(3)})`
      ctx.fillText(ch, x, y)
    }
    return alive
  }

  const loop = () => {
    const now = performance.now()
    refresh()
    // A pointer that has just stopped keeps the characters under it alive for
    // a moment; after that they fade like the rest and the loop can end.
    const holding = pointerIn && now - lastMove < params.holdMs
    if (holding) brush(px, py, now)
    const alive = draw(now)
    if (alive > 0 || holding) {
      raf = requestAnimationFrame(loop)
    } else {
      running = false
      showBase()
    }
  }

  const start = () => {
    if (running) return
    running = true
    raf = requestAnimationFrame(loop)
  }

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    const now = performance.now()
    refresh()
    const x = ev.clientX, y = ev.clientY
    // Stamp along the path so a fast stroke leaves an unbroken trail.
    if (px > -1e8) {
      const dist = Math.hypot(x - px, y - py)
      const n = Math.min(40, Math.max(1, Math.ceil(dist / (gridPitch / 2))))
      for (let s = 1; s <= n; s++) brush(px + (x - px) * s / n, py + (y - py) * s / n, now)
    } else {
      brush(x, y, now)
    }
    px = x; py = y
    pointerIn = true
    lastMove = now
    start()
  }
  const onLeave = (ev: PointerEvent) => {
    if (ev.relatedTarget) return
    pointerIn = false
    px = -1e9; py = -1e9
  }
  const onTheme = () => {
    readColours()
    buildLand()
    buildBase()
    if (!running) showBase()
  }
  const onResize = () => { resize() }

  readColours()
  resize()
  document.documentElement.classList.add('ink-canvas')
  window.addEventListener('pointermove', onMove, { passive: true })
  document.addEventListener('pointerout', onLeave)
  window.addEventListener('resize', onResize)
  window.addEventListener('themechange', onTheme)
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  mq.addEventListener('change', onTheme)

  const stop = () => {
    cancelAnimationFrame(raf)
    running = false
    document.documentElement.classList.remove('ink-canvas')
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerout', onLeave)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('themechange', onTheme)
    mq.removeEventListener('change', onTheme)
  }

  return { stop, refresh, source }
}
