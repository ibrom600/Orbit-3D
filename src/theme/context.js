import { createContext, useContext } from 'react'

export const ThemeContext = createContext(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme() يجب أن يُستخدم داخل ThemeProvider')
  return ctx
}