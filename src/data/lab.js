export const SHAPES = [
  { id: 'knot', label: 'عقدة' },
  { id: 'sphere', label: 'كرة' },
  { id: 'torus', label: 'حلقة' },
  { id: 'crystal', label: 'بلّورة' },
]

export const MATERIALS = [
  { id: 'chrome', label: 'كروم' },
  { id: 'glass', label: 'زجاج' },
  { id: 'clay', label: 'طين مطفي' },
  { id: 'holo', label: 'هولوغرام' },
]

export const LAB_DEFAULTS = {
  shape: 'knot',
  material: 'chrome',
  roughness: 0.14,
  metalness: 1,
  autoRotate: true,
  wireframe: false,
  particles: true,
  bloom: true,
}

export function shapeLabel(id) {
  return (SHAPES.find((shape) => shape.id === id) ?? SHAPES[0]).label
}

export function materialLabel(id) {
  return (MATERIALS.find((material) => material.id === id) ?? MATERIALS[0]).label
}