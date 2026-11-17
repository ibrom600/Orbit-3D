import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useMediaQuery, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useTheme } from '../../theme/context'

const SIMPLEX_NOISE = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`

const coreVertex = `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorld;
varying float vNoise;
${SIMPLEX_NOISE}
void main() {
  float n1 = snoise(position * uFreq + vec3(0.0, uTime * 0.32, uTime * 0.18));
  float n2 = snoise(position * (uFreq * 2.4) + vec3(uTime * 0.22, 0.0, 0.0));
  float displacement = n1 * uAmp + n2 * uAmp * 0.4;
  vec3 displaced = position + normal * displacement;
  vec4 world = modelMatrix * vec4(displaced, 1.0);
  vWorld = world.xyz;
  vNoise = displacement;
  vNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`
const coreFragment = `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uTime;
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec3 vWorld;
varying float vNoise;
void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewDir);
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 2.4);
  float bands = smoothstep(0.1, 0.9, sin(vWorld.y * 3.2 + uTime * 0.7) * 0.5 + 0.5);
  vec3 base = mix(uColorA, uColorB, bands);
  vec3 color = mix(base * 0.55, uColorC, fresnel * 0.85);
  color += uColorB * pow(fresnel, 1.7) * 0.85;
  color += vec3(0.03) * (vNoise + 0.5);
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`

function Core({ mobile }) {
  const { theme } = useTheme()
  const mesh = useRef(null)
  const targets = useMemo(
    () => ({
      a: new THREE.Color(theme.three.shaderA),
      b: new THREE.Color(theme.three.shaderB),
      c: new THREE.Color(theme.three.shaderC),
    }),
    [theme],
  )
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: 0.2 },
          uFreq: { value: 1.4 },
          uColorA: { value: new THREE.Color('#241a5c') },
          uColorB: { value: new THREE.Color('#8b5cf6') },
          uColorC: { value: new THREE.Color('#67e8f9') },
        },
      }),
    [],
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame((state, delta) => {
    const node = mesh.current
    if (!node) return
    const shader = node.material
    const time = state.clock.elapsedTime
    const k = Math.min(1, delta * 3)
    shader.uniforms.uTime.value = time
    shader.uniforms.uColorA.value.lerp(targets.a, k)
    shader.uniforms.uColorB.value.lerp(targets.b, k)
    shader.uniforms.uColorC.value.lerp(targets.c, k)
    node.rotation.y += delta * 0.14
    node.rotation.z = Math.sin(time * 0.18) * 0.12
    node.scale.setScalar(1 + Math.sin(time * 0.9) * 0.012)
  })

  const detail = mobile ? 72 : 128
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1.32, detail, detail]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
function Rings({ reduce }) {
  const { theme } = useTheme()
  const group = useRef(null)

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y -= delta * (reduce ? 0 : 0.22)
    group.current.rotation.x = 0.42 + Math.sin(state.clock.elapsedTime * 0.3) * 0.08
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2.05, 0.3, 0]}>
        <torusGeometry args={[2.05, 0.009, 12, 220]} />
        <meshBasicMaterial color={theme.three.accent2} transparent opacity={0.55} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -0.6, 0.45]}>
        <torusGeometry args={[2.45, 0.007, 12, 220]} />
        <meshBasicMaterial color={theme.three.accent} transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.92, 0.02, 16, 200]} />
        <meshStandardMaterial color={theme.three.ring} emissive={theme.three.accent} emissiveIntensity={0.75} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Satellites({ reduce }) {
  const { theme } = useTheme()
  const group = useRef(null)
  const items = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2
        const radius = 2.25 + (index % 3) * 0.22
        return {
          key: index,
          position: [Math.cos(angle) * radius, Math.sin(angle * 2) * 0.42, Math.sin(angle) * radius],
          size: index % 2 === 0 ? 0.11 : 0.07,
          color: index % 2 === 0 ? theme.three.accent2 : theme.three.accent,
        }
      }),
    [theme],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * (reduce ? 0.04 : 0.34)
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.22) * 0.18
  })

  return (
    <group ref={group}>
      {items.map((item) => (
        <mesh key={item.key} position={item.position}>
          <icosahedronGeometry args={[item.size, 1]} />
          <meshStandardMaterial color={item.color} emissive={item.color} emissiveIntensity={1.7} metalness={0.85} roughness={0.25} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

function Particles({ count }) {
  const { theme } = useTheme()
  const points = useRef(null)
  const material = useRef(null)
  const target = useMemo(() => new THREE.Color(theme.three.particle), [theme])
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3)
    let seed = 20260117
    const random = () => {
      seed = (seed * 16807) % 2147483647
      return (seed - 1) / 2147483646
    }
    for (let i = 0; i < count; i += 1) {
      const radius = 2.9 + random() * 2.7
      const theta = random() * Math.PI * 2
      const phi = Math.acos(2 * random() - 1)
      array[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      array[i * 3 + 1] = radius * Math.cos(phi) * 0.75
      array[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    }
    return array
  }, [count])

  useFrame((state, delta) => {
    if (material.current) material.current.color.lerp(target, Math.min(1, delta * 3))
    if (points.current) {
      points.current.rotation.y += delta * 0.035
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} size={0.028} sizeAttenuation transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} color={theme.three.particle} />
    </points>
  )
}

function WireShell() {
  const { theme } = useTheme()
  const mesh = useRef(null)
  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.y -= delta * 0.05
    mesh.current.rotation.x += delta * 0.018
  })
  return (
    <mesh ref={mesh} scale={1.58}>
      <icosahedronGeometry args={[1.3, 1]} />
      <meshBasicMaterial color={theme.three.accent} wireframe transparent opacity={0.13} depthWrite={false} />
    </mesh>
  )
}

function Parallax({ children, disabled }) {
  const group = useRef(null)
  useFrame((state, delta) => {
    if (!group.current) return
    const targetY = disabled ? 0 : state.pointer.x * 0.35
    const targetX = disabled ? 0 : -state.pointer.y * 0.2
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.5, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.5, delta)
  })
  return <group ref={group}>{children}</group>
}
export default function HeroScene() {
  const { theme } = useTheme()
  const mobile = useMediaQuery('(max-width: 820px)')
  const reduce = usePrefersReducedMotion()

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <pointLight position={[-5, 2, 3]} intensity={30} distance={18} decay={2} color={theme.three.lightA} />
      <pointLight position={[5, -2, 2]} intensity={24} distance={18} decay={2} color={theme.three.lightB} />
      <Environment key={theme.id} resolution={mobile ? 64 : 128} frames={1}>
        <Lightformer form="circle" intensity={3.2} color={theme.three.env[0]} scale={7} position={[5, 4, 3]} />
        <Lightformer form="ring" intensity={2.2} color={theme.three.env[1]} scale={6} position={[-5, -1, 3]} />
        <Lightformer form="rect" intensity={1.6} color={theme.three.env[2]} scale={[4, 9, 1]} position={[0, 6, -5]} />
      </Environment>

      <Parallax disabled={reduce}>
        <group position={[mobile ? 0 : -1.5, 0.05, 0]} scale={mobile ? 0.8 : 1}>
          <Float speed={reduce ? 0 : 1.15} rotationIntensity={reduce ? 0 : 0.28} floatIntensity={reduce ? 0 : 0.7}>
            <Core mobile={mobile} />
            <Rings reduce={reduce} />
            <Satellites reduce={reduce} />
          </Float>
          <WireShell />
          <Particles count={mobile ? 320 : 900} />
        </group>
        <ContactShadows position={[0, -2.45, 0]} opacity={0.5} scale={11} blur={3.2} far={4.5} color={theme.three.shadow} />
      </Parallax>
    </>
  )
}