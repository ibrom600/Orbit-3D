import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window.matchMedia !== 'function') return undefined
    if (!window.matchMedia('(pointer: fine)').matches) return undefined

    let raf = 0
    const onMove = (event) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--x', event.clientX + 'px')
        el.style.setProperty('--y', event.clientY + 'px')
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <div ref={ref} className="cursor-glow" aria-hidden="true" />
}