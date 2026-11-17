import { useEffect, useMemo, useState } from 'react'
import { DEFAULT_THEME_ID, THEMES, hexToRgbString } from './themes'
import { ThemeContext } from './context'

const STORAGE_KEY = 'orbit-theme'

function readStoredThemeId() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored && THEMES.some((theme) => theme.id === stored)) return stored
  } catch {
    // التخزين المحلي غير متاح (وضع خاص مثلاً)
  }
  return DEFAULT_THEME_ID
}

function buildCssVars(theme) {
  const ui = theme.ui
  return {
    '--bg': ui.bg,
    '--bg-soft': ui.bgSoft,
    '--surface': ui.surface,
    '--surface-strong': ui.surfaceStrong,
    '--border': ui.border,
    '--border-strong': ui.borderStrong,
    '--text': ui.text,
    '--muted': ui.muted,
    '--accent': ui.accent,
    '--accent-2': ui.accent2,
    '--accent-contrast': ui.accentContrast,
    '--glow': ui.glow,
    '--shadow': ui.shadow,
    '--grid-line': ui.gridLine,
    '--accent-rgb': hexToRgbString(ui.accent),
    '--accent2-rgb': hexToRgbString(ui.accent2),
  }
}

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(readStoredThemeId)
  const theme = useMemo(() => THEMES.find((item) => item.id === themeId) ?? THEMES[0], [themeId])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme.id
    for (const [key, value] of Object.entries(buildCssVars(theme))) root.style.setProperty(key, value)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme.ui.bg)
    try {
      window.localStorage.setItem(STORAGE_KEY, theme.id)
    } catch {
      // تجاهل فشل التخزين
    }
  }, [theme])

  const value = useMemo(() => ({ theme, themeId, setThemeId, themes: THEMES }), [theme, themeId])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}