import { useEffect, useState } from 'react'

export function useFps(sampleMs = 700) {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    let frames = 0
    let last = performance.now()
    let raf = 0
    const tick = (now) => {
      frames += 1
      const elapsed = now - last
      if (elapsed >= sampleMs) {
        setFps(Math.round((frames * 1000) / elapsed))
        frames = 0
        last = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sampleMs])

  return fps
}