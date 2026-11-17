import { useEffect, useState } from 'react'

export default function Intro() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className={'intro ' + (done ? 'is-done' : '')} aria-hidden={done}>
      <div className="intro__inner">
        <span className="intro__orb" />
        <strong className="intro__brand">أوربِت</strong>
        <span className="intro__label">جارٍ تجهيز المشهد…</span>
        <span className="intro__bar">
          <span />
        </span>
      </div>
    </div>
  )
}