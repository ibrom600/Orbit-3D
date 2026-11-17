import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

export default function Effects({ bloom = true, noise = 0.03, vignette = 0.82 }) {
  if (!bloom) {
    return (
      <EffectComposer multisampling={0}>
        <Noise opacity={noise} premultiply />
        <Vignette offset={0.3} darkness={vignette} />
      </EffectComposer>
    )
  }
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.18} luminanceSmoothing={0.32} radius={0.7} />
      <Noise opacity={noise} premultiply />
      <Vignette offset={0.3} darkness={vignette} />
    </EffectComposer>
  )
}