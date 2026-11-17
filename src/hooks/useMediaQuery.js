import { useMemo, useSyncExternalStore } from 'react'

const supportsMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function'

function getServerSnapshot() {
  return false
}

export function useMediaQuery(query) {
  const subscribe = useMemo(
    () => (onChange) => {
      if (!supportsMatchMedia) return () => {}
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  const getSnapshot = useMemo(
    () => () => (supportsMatchMedia ? window.matchMedia(query).matches : false),
    [query],
  )

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}