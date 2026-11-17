import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useViewTracker } from '../../hooks/useViewTracker'

const DEFAULT_CAMERA = { position: [0, 0, 6], fov: 45 }

export default function SceneCanvas({ children, camera, className = '', dpr, ...rest }) {
  const hostRef = useRef(null)
  const { inView, mounted } = useViewTracker(hostRef, { rootMargin: '260px' })
  const compact = useMediaQuery('(max-width: 820px)')

  return (
    <div ref={hostRef} className={'scene ' + className}>
      {mounted ? (
        <Canvas
          dpr={dpr ?? [1, compact ? 1.4 : 1.8]}
          camera={camera ?? DEFAULT_CAMERA}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          frameloop={inView ? 'always' : 'demand'}
          {...rest}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </Canvas>
      ) : null}
    </div>
  )
}