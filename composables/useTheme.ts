// Theme: follows the system by default; Light or Shadows can be pinned and are
// remembered in this browser.
export type ThemeMode = 'auto' | 'light' | 'dark'

export function useTheme () {
  const mode = useState<ThemeMode>('theme-mode', () => 'auto')

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
  }

  function cycle () {
    apply(mode.value === 'auto' ? 'light' : mode.value === 'light' ? 'dark' : 'auto')
  }

  return { mode, init, cycle }
}
