import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Environment,
  Float,
  Grid,
  Lightformer,
  MeshTransmissionMaterial,
  OrbitControls,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useTheme } from '../../theme/context'
import Backdrop from './Backdrop'
import Effects from './Effects'

function ShapeGeometry({ shape, mobile }) {
  if (shape === 'sphere') return <sphereGeometry args={[1.2, mobile ? 64 : 128, mobile ? 64 : 128]} />
  if (shape === 'torus') return <torusGeometry args={[1.02, 0.38, 48, 160]} />
  if (shape === 'crystal') return <icosahedronGeometry args={[1.34, 0]} />
  return <torusKnotGeometry args={[0.85, 0.28, mobile ? 160 : 260, 36]} />
}

function Surface({ kind, roughness, metalness, mobile }) {
  const { theme } = useTheme()
  const palette = theme.three
  const ref = useRef(null)
  const targetColor = useMemo(
    () => new THREE.Color(kind === 'clay' ? palette.clay : kind === 'holo' ? palette.accent : palette.metal),
    [kind, palette],
  )

  useFrame((_, delta) => {
    if (ref.current?.color) ref.current.color.lerp(targetColor, Math.min(1, delta * 4))
  })

  if (kind === 'glass') {
    if (mobile) {
      return (
        <meshPhysicalMaterial
          ref={ref}
          color={palette.glass}
          transmission={1}
          thickness={1.1}
          roughness={0.06}
          metalness={0}
          ior={1.4}
          clearcoat={1}
          envMapIntensity={1.5}
          attenuationColor={palette.accent2}
          attenuationDistance={2.4}
        />
      )
    }
    return (
      <MeshTransmissionMaterial
        samples={2}
        resolution={192}
        thickness={0.85}
        roughness={0.05}
        transmission={1}
        ior={1.42}
        chromaticAberration={0.3}
        anisotropicBlur={0.4}
        distortion={0.12}
        distortionScale={0.35}
        temporalDistortion={0.04}
        color={palette.glass}
        attenuationColor={palette.accent2}
        attenuationDistance={2.4}
      />
    )
  }

  if (kind === 'holo') {
    return (
      <meshStandardMaterial
        ref={ref}
        color={palette.accent}
        emissive={palette.accent2}
        emissiveIntensity={1.6}
        metalness={0.55}
        roughness={0.25}
        wireframe
        transparent
        opacity={0.72}
        toneMapped={false}
      />
    )
  }

  if (kind === 'clay') {
    return <meshStandardMaterial ref={ref} color={palette.clay} roughness={Math.max(0.7, roughness)} metalness={0.04} envMapIntensity={0.75} />
  }

  return (
    <meshPhysicalMaterial
      ref={ref}
      color={palette.metal}
      metalness={metalness}
      roughness={roughness}
      clearcoat={1}
      clearcoatRoughness={0.12}
      envMapIntensity={1.6}
    />
  )
}
export default function LabScene({ shape, material: materialKind, roughness, metalness, autoRotate, wireframe, particles, bloom }) {
  const { theme } = useTheme()
  const mobile = useMediaQuery('(max-width: 820px)')
  const reduce = usePrefersReducedMotion()

  return (
    <>
      <Backdrop />
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <pointLight position={[-4, 2, 3]} intensity={26} distance={18} decay={2} color={theme.three.lightA} />
      <pointLight position={[4, -1, 2]} intensity={20} distance={18} decay={2} color={theme.three.lightB} />
      <Environment key={theme.id} resolution={mobile ? 96 : 160} frames={1}>
        <Lightformer form="circle" intensity={3} color={theme.three.env[0]} scale={6} position={[4, 4, 4]} />
        <Lightformer form="ring" intensity={2} color={theme.three.env[1]} scale={5} position={[-4, 1, 3]} />
        <Lightformer form="rect" intensity={1.5} color={theme.three.env[2]} scale={[5, 8, 1]} position={[0, 6, -4]} />
      </Environment>

      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.2}
        maxDistance={8}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI - 0.45}
        autoRotate={autoRotate && !reduce}
        autoRotateSpeed={0.9}
      />

      <group position={[0, 0.25, 0]}>
        <Float speed={reduce ? 0 : 1.1} rotationIntensity={reduce ? 0 : 0.18} floatIntensity={reduce ? 0 : 0.35}>
          <mesh>
            <ShapeGeometry shape={shape} mobile={mobile} />
            <Surface kind={materialKind} roughness={roughness} metalness={metalness} mobile={mobile} />
          </mesh>
          {wireframe ? (
            <mesh scale={1.02}>
              <ShapeGeometry shape={shape} mobile={mobile} />
              <meshBasicMaterial color={theme.three.accent2} wireframe transparent opacity={0.3} depthWrite={false} />
            </mesh>
          ) : null}
        </Float>
      </group>

      <Grid
        position={[0, -1.7, 0]}
        args={[14, 14]}
        cellSize={0.55}
        cellThickness={0.5}
        cellColor={theme.three.grid}
        sectionSize={2.75}
        sectionThickness={1}
        sectionColor={theme.three.accent}
        fadeDistance={28}
        fadeStrength={1.8}
        infiniteGrid
      />
      <ContactShadows position={[0, -1.68, 0]} opacity={0.5} scale={12} blur={2.8} far={3.6} color={theme.three.shadow} />
      {particles ? <Sparkles count={mobile ? 40 : 110} scale={[7, 4.5, 7]} size={2.4} speed={0.3} opacity={0.55} color={theme.three.particle} /> : null}
      <Effects bloom={bloom} />
    </>
  )
}