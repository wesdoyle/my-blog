// Theme: follows the system until the switch pins Light or Dark, which is
// remembered in this browser.
export type ThemeMode = 'auto' | 'light' | 'dark'

export function useTheme () {
  const mode = useState<ThemeMode>('theme-mode', () => 'auto')
  const systemDark = useState<boolean>('theme-system-dark', () => false)

  // The theme actually showing, whichever way it was decided.
  const effective = computed<'light' | 'dark'>(() =>
    mode.value === 'auto' ? (systemDark.value ? 'dark' : 'light') : mode.value
  )

  function apply (m: ThemeMode) {
    mode.value = m
    const el = document.documentElement
    if (m === 'auto') delete el.dataset.theme
    else el.dataset.theme = m
    try {
      if (m === 'auto') localStorage.removeItem('theme')
      else localStorage.setItem('theme', m)
    } catch {}
    window.dispatchEvent(new Event('themechange'))
  }

  function init () {
    let m: ThemeMode = 'auto'
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') m = saved
    } catch {}
    mode.value = m
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mq.matches
    mq.addEventListener('change', e => { systemDark.value = e.matches })
  }

  // Flip to the opposite of what is showing, and pin it.
  function toggle () {
    apply(effective.value === 'dark' ? 'light' : 'dark')
  }

  return { mode, effective, init, toggle, apply }
}
