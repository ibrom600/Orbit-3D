const TECH = [
  'React 19',
  'Three.js',
  'React Three Fiber',
  '@react-three/drei',
  'Postprocessing',
  'GLSL Shaders',
  'Vite',
  'WebGL 2',
  'PBR Materials',
  'Instanced Particles',
]

export default function TechMarquee() {
  const items = [...TECH, ...TECH]
  return (
    <section className="section--tight" aria-label="التقنيات المستخدمة">
      <div className="marquee">
        <div className="marquee__track">
          {items.map((item, index) => (
            <span className="marquee__item" key={item + index}>
              <i />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}