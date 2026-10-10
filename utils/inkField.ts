// A slow halftone "ink field" that lives in the outer margins of the page.
//
// Two layers share one fixed, viewport-sized canvas:
//  - Natural ink blots: a slow, stochastic cellular automaton on a coarse grid.
//    Each living cell splats a soft, often lobed blob into a fine halftone
//    screen; neighbouring dots swell until they merge, as in printed halftone.
//  - The visitor's brush: moving the pointer through the margins swells dots in
//    a slowly cycling palette of temple and garden colours. As a stroke fades,
//    it leaves monospace letters from Frankenstein, then nothing.
// While someone is drawing, the natural blots fade out and the automaton waits.

const TEXT = 'You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking. I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. '

const ZEN_LIGHT = [[190, 84, 62], [158, 64, 54], [122, 88, 62], [190, 154, 80], [134, 152, 88], [100, 126, 80], [70, 98, 128], [146, 142, 132], [204, 156, 150]]
const ZEN_DARK = [[214, 104, 82], [182, 82, 72], [150, 112, 84], [214, 180, 104], [160, 176, 112], [126, 150, 104], [96, 128, 160], [170, 166, 156], [226, 182, 176]]

export function createInkField (cv: HTMLCanvasElement): () => void {
  const ctx = cv.getContext('2d')
  if (!ctx) return () => {}
  let alive_ = true
  let raf = 0

  const S = 8 // halftone pitch
  const G = 32 // automaton cell
  const RB = 13 // smallest blot radius
  const TAU = Math.PI * 2
  const RMAX = S * 0.74
  const CYCLE = 3000 // px of travel per full colour cycle
  const COLUMN = 640

  const root = document.documentElement
  const css = getComputedStyle(root)
  const rgb = (name: string, fb: string) => {
    const h = (css.getPropertyValue(name).trim() || fb).replace('#', '')
    return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)).join(',')
  }
  const pinned = root.dataset.theme
  const dark = pinned ? pinned === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  const dotColor = rgb('--border', dark ? '#3B3732' : '#D4D0C8')
  const INK = dark ? 'rgba(214,208,198,0.5)' : 'rgba(43,40,37,0.55)'
  const ZEN = dark ? ZEN_DARK : ZEN_LIGHT
  const brA = dark ? 0.86 : 0.82
  const STEPS = 6
  const GRAD: string[] = []
  for (let k = 0; k < ZEN.length; k++) {
    const a = ZEN[k]!, b = ZEN[(k + 1) % ZEN.length]!
    for (let s = 0; s < STEPS; s++) {
      const t = s / STEPS
      GRAD.push(a.map((v, q) => Math.round(v + (b[q]! - v) * t)).join(','))
    }
  }

  const base = document.createElement('canvas')
  let W = 0, H = 0, dpr = 1, dc = 0, dr = 0, nc = 0, nr = 0, bandX = 0
  let dmask = new Float32Array(0), dots = new Int32Array(0)
  let en = new Float32Array(0), hue = new Uint8Array(0), chr = new Uint16Array(0), F = new Float32Array(0)
  let alive = new Uint8Array(0), shown = new Float32Array(0), nmask = new Float32Array(0), sz = new Float32Array(0)
  let el = new Float32Array(0), rot = new Float32Array(0), amp = new Float32Array(0), ph = new Float32Array(0)
  let ox = new Float32Array(0), oy = new Float32Array(0), hd = new Float32Array(0), sp = new Float32Array(0), spin = new Float32Array(0)
  let ti = 0

  // Mask: 1 at the left and right edges of the viewport, easing to 0 well
  // before the text column.
  const band = (x: number) => {
    if (bandX <= 0) return 0
    const t = Math.max(0, 1 - Math.min(x, W - x) / bandX)
    return t * t * (3 - 2 * t)
  }

  const reshape = (i: number) => {
    sz[i] = 1 + 7 * Math.pow(Math.random(), 2.4)
    if (Math.random() < 0.2) {
      el[i] = 1; rot[i] = 0
      amp[i * 3] = 0; amp[i * 3 + 1] = 0; amp[i * 3 + 2] = 0
    } else {
      el[i] = 1 + 0.8 * Math.random()
      rot[i] = Math.random() * Math.PI
      amp[i * 3] = 0.12 + 0.2 * Math.random()
      amp[i * 3 + 1] = 0.06 + 0.16 * Math.random()
      amp[i * 3 + 2] = 0.03 + 0.1 * Math.random()
    }
    ph[i * 3] = Math.random() * TAU; ph[i * 3 + 1] = Math.random() * TAU; ph[i * 3 + 2] = Math.random() * TAU
    ox[i] = 0; oy[i] = 0; hd[i] = Math.random() * TAU
    if (Math.random() < 0.55) { sp[i] = 2 + 4 * Math.random(); spin[i] = (Math.random() - 0.5) * 0.16 } else { sp[i] = 0; spin[i] = 0 }
  }

  const resize = (force = false) => {
    const w = root.clientWidth, h = window.innerHeight
    // Ignore small height changes (mobile URL bars) so the field isn't reset on scroll.
    if (!force && w === W && Math.abs(h - H) < 160) return
    W = w; H = h; dpr = window.devicePixelRatio || 1
    const margin = (W - COLUMN) / 2
    bandX = W >= 900 ? Math.max(0, Math.min(220, margin - 150)) : 22
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    dc = Math.ceil(W / S); dr = Math.ceil(H / S)
    nc = Math.ceil(W / G) + 1; nr = Math.ceil(H / G) + 1
    const nd = dc * dr
    dmask = new Float32Array(nd); en = new Float32Array(nd); hue = new Uint8Array(nd); chr = new Uint16Array(nd); F = new Float32Array(nd)
    const list: number[] = []
    for (let y = 0; y < dr; y++) {
      for (let x = 0; x < dc; x++) {
        const i = y * dc + x
        dmask[i] = band(x * S + S / 2)
        if (dmask[i]! > 0.02) list.push(i)
      }
    }
    dots = Int32Array.from(list)
    const nn = nc * nr
    alive = new Uint8Array(nn); shown = new Float32Array(nn); nmask = new Float32Array(nn); sz = new Float32Array(nn)
    el = new Float32Array(nn); rot = new Float32Array(nn); amp = new Float32Array(nn * 3); ph = new Float32Array(nn * 3)
    ox = new Float32Array(nn); oy = new Float32Array(nn); hd = new Float32Array(nn); sp = new Float32Array(nn); spin = new Float32Array(nn)
    for (let y = 0; y < nr; y++) {
      for (let x = 0; x < nc; x++) {
        const i = y * nc + x
        nmask[i] = band(x * G)
        reshape(i)
        if (nmask[i]! > 0.3 && Math.random() < 0.04) alive[i] = 1
      }
    }
    base.width = cv.width; base.height = cv.height
    const b2 = base.getContext('2d')!
    b2.setTransform(dpr, 0, 0, dpr, 0, 0)
    b2.clearRect(0, 0, W, H)
    b2.beginPath()
    for (const i of dots) {
      const x = (i % dc) * S + S / 2, y = ((i / dc) | 0) * S + S / 2
      const r = 0.3 + 0.6 * dmask[i]!
      b2.moveTo(x + r, y)
      b2.arc(x, y, r, 0, TAU)
    }
    b2.fillStyle = 'rgba(' + dotColor + ',0.9)'
    b2.fill()
  }

  const step = () => {
    const next = new Uint8Array(alive.length)
    for (let y = 0; y < nr; y++) {
      for (let x = 0; x < nc; x++) {
        const i = y * nc + x
        const m = nmask[i]!
        if (m < 0.02) continue
        let n = 0
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (!dx && !dy) continue
            const xx = x + dx, yy = y + dy
            if (xx >= 0 && yy >= 0 && xx < nc && yy < nr) n += alive[yy * nc + xx]!
          }
        }
        const p = alive[i] ? ((n === 2 || n === 3) ? 0.9 : 0.45) : ((n === 3 ? 0.29 : 0) + 0.0019)
        next[i] = Math.random() < p * (0.35 + 0.65 * m) ? 1 : 0
        if (next[i] && !alive[i] && shown[i]! < 0.05) reshape(i)
      }
    }
    alive = next
  }

  const splat = () => {
    F.fill(1)
    for (let y = 0; y < nr; y++) {
      for (let x = 0; x < nc; x++) {
        const ni = y * nc + x
        const v = shown[ni]!
        if (v < 0.02) continue
        const cx = x * G + ox[ni]!, cy = y * G + oy[ni]!
        const R = RB * sz[ni]! * (0.55 + 0.45 * nmask[ni]!)
        const box = R * 1.75
        const cs = Math.cos(rot[ni]!), sn = Math.sin(rot[ni]!), e = el[ni]!
        const a1 = amp[ni * 3]!, a2 = amp[ni * 3 + 1]!, a3 = amp[ni * 3 + 2]!
        const p1 = ph[ni * 3]!, p2 = ph[ni * 3 + 1]!, p3 = ph[ni * 3 + 2]!
        const gx0 = Math.max(0, Math.floor((cx - box) / S)), gx1 = Math.min(dc - 1, Math.floor((cx + box) / S))
        const gy0 = Math.max(0, Math.floor((cy - box) / S)), gy1 = Math.min(dr - 1, Math.floor((cy + box) / S))
        for (let gy = gy0; gy <= gy1; gy++) {
          const dy = gy * S + S / 2 - cy
          for (let gx = gx0; gx <= gx1; gx++) {
            const j = gy * dc + gx
            if (dmask[j]! <= 0.02) continue
            const dx = gx * S + S / 2 - cx
            const u = dx * cs + dy * sn, w = (dy * cs - dx * sn) * e
            const d = Math.hypot(u, w)
            let Rt = R
            if (a1 || a2 || a3) {
              const th = Math.atan2(w, u)
              Rt = R * (1 + a1 * Math.sin(2 * th + p1) + a2 * Math.sin(3 * th + p2) + a3 * Math.sin(5 * th + p3))
            }
            if (d >= Rt) continue
            const t = 1 - d / Rt
            F[j] = F[j]! * (1 - v * t * t * (3 - 2 * t))
          }
        }
      }
    }
  }

  const fillDots = (list: number[], color: string) => {
    if (!list.length) return
    ctx.beginPath()
    for (let j = 0; j < list.length; j += 3) {
      ctx.moveTo(list[j]! + list[j + 2]!, list[j + 1]!)
      ctx.arc(list[j]!, list[j + 1]!, list[j + 2]!, 0, TAU)
    }
    ctx.fillStyle = color
    ctx.fill()
  }

  let quiet = false
  const draw = (dt: number) => {
    const decay = dt / 4600
    for (let i = 0; i < shown.length; i++) {
      const target = quiet ? 0 : alive[i]!
      shown[i] = shown[i]! + (target - shown[i]!) * (target < shown[i]! ? 0.05 : 0.03)
      if (sp[i] && shown[i]! > 0.02 && dt) {
        const k = dt / 1000
        hd[i] = hd[i]! + (Math.random() - 0.5) * 0.7 * k
        ox[i] = ox[i]! + Math.cos(hd[i]!) * sp[i]! * k
        oy[i] = oy[i]! + Math.sin(hd[i]!) * sp[i]! * k
        if (ox[i]! * ox[i]! + oy[i]! * oy[i]! > 784) hd[i] = Math.atan2(-oy[i]!, -ox[i]!) + (Math.random() - 0.5) * 0.8
        rot[i] = rot[i]! + spin[i]! * k
      }
    }
    splat()
    const ink: number[] = []
    const br = new Map<number, number[]>()
    const glyphs: number[] = []
    for (const i of dots) {
      const m = dmask[i]!
      const gx = i % dc, gy = (i / dc) | 0
      const x = gx * S + S / 2, y = gy * S + S / 2
      const f = 1 - F[i]!
      if (f > 0.03) {
        const r = RMAX * Math.pow(f, 0.8) * (0.4 + 0.6 * m)
        if (r > 0.45) ink.push(x, y, r)
      }
      if (en[i]! > 0) {
        en[i] = Math.max(0, en[i]! - decay * (en[i]! < 0.3 ? 0.5 : 1))
        const e = en[i]!
        if (e > 0.3) {
          let l = br.get(hue[i]!)
          if (!l) { l = []; br.set(hue[i]!, l) }
          l.push(x, y, RMAX * 1.05 * Math.pow((e - 0.3) / 0.7, 0.7))
        } else if (e > 0 && !(gx & 1) && !(gy & 1) && chr[i] !== 32) {
          glyphs.push(i)
        }
      }
    }
    ctx.clearRect(0, 0, W, H)
    ctx.drawImage(base, 0, 0, W, H)
    fillDots(ink, INK)
    br.forEach((l, k) => fillDots(l, 'rgba(' + GRAD[k] + ',' + brA + ')'))
    if (glyphs.length) {
      ctx.font = '12px ui-monospace, "SF Mono", Menlo, Consolas, monospace'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const i of glyphs) {
        const e = en[i]!
        ctx.fillStyle = 'rgba(' + GRAD[hue[i]!] + ',' + (brA * Math.pow(e / 0.3, 0.7)).toFixed(3) + ')'
        ctx.fillText(String.fromCharCode(chr[i]!), (i % dc) * S + S, ((i / dc) | 0) * S + S)
      }
    }
  }

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let lastStep = 0, lastDraw = 0, lastMove = -1e9
  let px: number | null = null, py: number | null = null
  let travel = Math.random() * CYCLE

  const deposit = (x: number, y: number) => {
    const B = 28
    const h = Math.floor(((travel % CYCLE) / CYCLE) * GRAD.length) % GRAD.length
    const gx0 = Math.max(0, Math.floor((x - B) / S)), gx1 = Math.min(dc - 1, Math.floor((x + B) / S))
    const gy0 = Math.max(0, Math.floor((y - B) / S)), gy1 = Math.min(dr - 1, Math.floor((y + B) / S))
    for (let gy = gy0; gy <= gy1; gy++) {
      for (let gx = gx0; gx <= gx1; gx++) {
        const i = gy * dc + gx
        if (dmask[i]! < 0.06) continue
        const d = Math.hypot(gx * S + S / 2 - x, gy * S + S / 2 - y)
        if (d > B) continue
        const t = 1 - d / B
        const v = t * t * (3 - 2 * t) * (0.75 + 0.25 * Math.random())
        if (v > en[i]!) {
          if (en[i]! <= 0 && !(gx & 1) && !(gy & 1)) { chr[i] = TEXT.charCodeAt(ti); ti = (ti + 1) % TEXT.length }
          en[i] = v
          hue[i] = h
        }
      }
    }
  }

  const onMove = (ev: PointerEvent) => {
    if (ev.pointerType === 'touch') return
    const x = ev.clientX, y = ev.clientY
    if (px === null || py === null) { px = x; py = y }
    const dx = x - px, dy = y - py, dist = Math.hypot(dx, dy)
    const n = Math.max(1, Math.ceil(dist / 4))
    let touched = false
    for (let s = 1; s <= n; s++) {
      travel += dist / n
      const sx = px + dx * s / n, sy = py + dy * s / n
      const gi = Math.floor(sy / S) * dc + Math.floor(sx / S)
      if ((dmask[gi] ?? 0) >= 0.06) touched = true
      deposit(sx, sy)
    }
    if (touched) lastMove = performance.now()
    px = x; py = y
  }
  const onLeave = (ev: PointerEvent) => { if (!ev.relatedTarget) { px = null; py = null } }
  const onResize = () => { resize(); if (reduce) { shown.set(alive); draw(0) } }

  const loop = (t: number) => {
    if (!alive_) return
    quiet = performance.now() - lastMove < 1500
    if (!quiet && t - lastStep > 1800) { step(); lastStep = t }
    if (t - lastDraw > 40) { draw(Math.min(t - lastDraw, 200)); lastDraw = t }
    raf = requestAnimationFrame(loop)
  }

  resize(true)
  window.addEventListener('resize', onResize)
  if (reduce) {
    shown.set(alive)
    draw(0)
  } else {
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerout', onLeave)
    raf = requestAnimationFrame(loop)
  }

  return () => {
    alive_ = false
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', onResize)
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerout', onLeave)
  }
}
