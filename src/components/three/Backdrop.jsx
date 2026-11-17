import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTheme } from '../../theme/context'

const vertexShader = [
  'varying vec2 vUv;',
  'void main() {',
  '  vUv = uv;',
  '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
  '}',
].join('\n')

const fragmentShader = [
  'uniform vec3 uInner;',
  'uniform vec3 uOuter;',
  'uniform vec3 uGlow;',
  'varying vec2 vUv;',
  'void main() {',
  '  vec2 p = vUv - 0.5;',
  '  float d = length(p * vec2(1.15, 0.95));',
  '  vec3 col = mix(uInner, uOuter, smoothstep(0.02, 0.72, d));',
  '  float glow = smoothstep(0.62, 0.0, distance(vUv, vec2(0.5, 0.8)));',
  '  col += uGlow * glow * 0.2;',
  '  gl_FragColor = vec4(col, 1.0);',
  '  #include <tonemapping_fragment>',
  '  #include <colorspace_fragment>',
  '}',
].join('\n')

export default function Backdrop({ radius = 30 }) {
  const { theme } = useTheme()
  const mesh = useRef(null)
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uInner: { value: new THREE.Color('#0a0c1d') },
          uOuter: { value: new THREE.Color('#05060f') },
          uGlow: { value: new THREE.Color('#8b5cf6') },
        },
      }),
    [],
  )
  const targets = useMemo(
    () => ({
      inner: new THREE.Color(theme.three.backdropInner),
      outer: new THREE.Color(theme.three.backdropOuter),
      glow: new THREE.Color(theme.three.accent),
    }),
    [theme],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((_, delta) => {
    const node = mesh.current
    if (!node) return
    const shader = node.material
    const k = Math.min(1, delta * 3.5)
    shader.uniforms.uInner.value.lerp(targets.inner, k)
    shader.uniforms.uOuter.value.lerp(targets.outer, k)
    shader.uniforms.uGlow.value.lerp(targets.glow, k)
  })

  return (
    <mesh ref={mesh} scale={radius} renderOrder={-1}>
      <sphereGeometry args={[1, 32, 24]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}