import { useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollProgress() {
  const barRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0
        if (barRef.current) barRef.current.style.setProperty('--p', progress.toFixed(4))
        setVisible(window.scrollY > 700)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <>
      <div ref={barRef} className="scroll-progress" aria-hidden="true" />
      <button
        type="button"
        className={'to-top ' + (visible ? 'is-visible' : '')}
        aria-label="العودة إلى الأعلى"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp size={18} />
      </button>
    </>
  )
}