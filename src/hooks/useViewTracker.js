import { useEffect, useState } from 'react'

const hasObserver = typeof IntersectionObserver === 'function'

const INITIAL = { inView: false, mounted: false }
const ALWAYS = { inView: true, mounted: true }

export function useViewTracker(ref, { rootMargin = '200px', threshold = 0.01 } = {}) {
  const [view, setView] = useState(() => (hasObserver ? INITIAL : ALWAYS))

  useEffect(() => {
    const el = ref.current
    if (!el || !hasObserver) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting
        setView((prev) => (prev.mounted || visible ? { inView: visible, mounted: prev.mounted || visible } : prev))
      },
      { rootMargin, threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin, threshold])

  return view
}