import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useTheme } from '../../theme/context'
import Backdrop from './Backdrop'
import Effects from './Effects'

function Artifact({ kind, active, position, mobile }) {
  const { theme } = useTheme()
  const group = useRef(null)
  const palette = theme.three

  useFrame((_, delta) => {
    if (!group.current) return
    const scale = THREE.MathUtils.damp(group.current.scale.x, active ? 1.14 : 0.94, 4, delta)
    group.current.scale.setScalar(scale)
    group.current.rotation.y += delta * (active ? 0.5 : 0.18)
  })

  return (
    <group ref={group} position={position}>
      {kind === 'glass' ? (
        <>
          <mesh>
            <torusGeometry args={[1, mobile ? 0.3 : 0.34, 40, 140]} />
            {mobile ? (
              <meshPhysicalMaterial
                color={palette.glass}
                transmission={1}
                thickness={1}
                roughness={0.06}
                ior={1.4}
                clearcoat={1}
                envMapIntensity={1.4}
                attenuationColor={palette.accent2}
                attenuationDistance={2.2}
              />
            ) : (
              <MeshTransmissionMaterial
                samples={2}
                resolution={160}
                thickness={0.8}
                roughness={0.04}
                chromaticAberration={0.32}
                anisotropicBlur={0.35}
                distortion={0.1}
                distortionScale={0.3}
                color={palette.glass}
                attenuationColor={palette.accent2}
                attenuationDistance={2.2}
              />
            )}
          </mesh>
          <mesh scale={0.4}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color={palette.accent2} emissive={palette.accent2} emissiveIntensity={2.4} toneMapped={false} />
          </mesh>
        </>
      ) : null}      {kind === 'metal' ? (
        <>
          <mesh>
            <icosahedronGeometry args={[1.12, 0]} />
            <meshPhysicalMaterial color={palette.metal} metalness={1} roughness={0.1} clearcoat={1} clearcoatRoughness={0.08} envMapIntensity={1.7} />
          </mesh>
          <mesh scale={1.26}>
            <icosahedronGeometry args={[1.12, 1]} />
            <meshBasicMaterial color={palette.accent2} wireframe transparent opacity={0.2} depthWrite={false} />
          </mesh>
        </>
      ) : null}

      {kind === 'holo' ? (
        <group>
          {[0, 1, 2].map((index) => (
            <mesh key={index} rotation={[Math.PI / 2 + index * 0.35, index * 0.5, 0]} scale={1 - index * 0.16}>
              <torusGeometry args={[1.05, 0.035, 16, 140]} />
              <meshStandardMaterial
                color={palette.accent}
                emissive={index % 2 === 0 ? palette.accent : palette.accent2}
                emissiveIntensity={2.6}
                metalness={0.4}
                roughness={0.25}
                toneMapped={false}
              />
            </mesh>
          ))}
        </group>
      ) : null}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
        <ringGeometry args={[0.86, 0.93, 96]} />
        <meshBasicMaterial color={active ? palette.accent2 : palette.accent} transparent opacity={active ? 0.9 : 0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}
export default function ShowcaseScene({ active = 1 }) {
  const { theme } = useTheme()
  const mobile = useMediaQuery('(max-width: 820px)')
  const reduce = usePrefersReducedMotion()
  const spread = mobile ? 1.45 : 2.75
  const kinds = ['glass', 'metal', 'holo']

  return (
    <>
      <Backdrop radius={34} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 6, 4]} intensity={1.4} />
      <pointLight position={[-5, 2, 3]} intensity={26} distance={20} decay={2} color={theme.three.lightA} />
      <pointLight position={[5, -1, 2]} intensity={20} distance={20} decay={2} color={theme.three.lightB} />
      <Environment key={theme.id} resolution={mobile ? 96 : 160} frames={1}>
        <Lightformer form="circle" intensity={3} color={theme.three.env[0]} scale={6} position={[4, 4, 4]} />
        <Lightformer form="ring" intensity={2} color={theme.three.env[1]} scale={5} position={[-4, 1, 3]} />
        <Lightformer form="rect" intensity={1.4} color={theme.three.env[2]} scale={[5, 8, 1]} position={[0, 6, -4]} />
      </Environment>

      <group scale={mobile ? 0.66 : 1} position={[0, 0.2, 0]}>
        {kinds.map((kind, index) => (
          <Float key={kind} speed={reduce ? 0 : 1 + index * 0.15} rotationIntensity={reduce ? 0 : 0.3} floatIntensity={reduce ? 0 : 0.5}>
            <Artifact
              kind={kind}
              active={active === index}
              position={[(index - 1) * spread, 0, index === 1 ? -0.35 : 0]}
              mobile={mobile}
            />
          </Float>
        ))}
        <ContactShadows position={[0, -1.75, 0]} opacity={0.45} scale={14} blur={3} far={4} color={theme.three.shadow} />
      </group>

      <Effects bloom noise={0.02} />
    </>
  )
}