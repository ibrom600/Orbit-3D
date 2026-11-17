import { Aperture, Gauge, Layers, Orbit, Palette, Sparkles } from 'lucide-react'
import Reveal from './Reveal'
import { spotlight } from '../lib/spotlight'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'شيدرات GLSL مخصّصة',
    text: 'نواة المشهد مادة شيدر مكتوبة يدوياً: إزاحة بالضوضاء البسيطة ثلاثية الأبعاد، تدرّج Fresnel للحافة، وربط مباشر بألوان الثيم.',
  },
  {
    icon: Orbit,
    title: 'تحكّم مداري سلس',
    text: 'OrbitControls مع تخميد الحركة، حدود للتكبير وزوايا الكاميرا، ودوران تلقائي؛ والمشهد يتفاعل مع حركة المؤشر في الهيرو.',
  },
  {
    icon: Layers,
    title: 'مواد PBR وانكسار',
    text: 'كروم لامع، زجاج MeshTransmissionMaterial بتشتت لوني، طين مطفي، وهولوغرام شبكي مضيء — تبديل فوري داخل المختبر.',
  },
  {
    icon: Aperture,
    title: 'معالجة بصرية',
    text: 'سلسلة EffectComposer تشمل Bloom وNoise وVignette لتمنح المشهد عمقاً سينمائياً مع إمكانية الإطفاء من اللوحة.',
  },
  {
    icon: Palette,
    title: 'ثيمات مترابطة',
    text: 'تبديل الثيم يمرّر متغيّرات CSS وألوان المواد والإضاءة وخرائط البيئة معاً، مع انتقال لوني سلس داخل المشهد.',
  },
  {
    icon: Gauge,
    title: 'أداء محسوب',
    text: 'اللوحات تُحمّل عند الظهور وتتوقف خارج الشاشة، دقة بكسل متكيّفة، وأعداد الجزيئات تتقلّص تلقائياً على الشاشات الصغيرة.',
  },
]

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">القدرات</span>
          <h2 className="section-title">
            كل ما تراه يعمل <span className="grad">الآن</span> في متصفّحك
          </h2>
          <p className="lead">
            لا فيديوهات ولا صور جاهزة ولا موديلات محمّلة من الإنترنت — كل بكسل مولّد لحظياً بواسطة WebGL
            وشيدرات وإضاءة محسوبة في الزمن الحقيقي.
          </p>
        </Reveal>

        <div className="features__grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Reveal key={feature.title} delay={index * 70}>
                <article className="feature" onMouseMove={spotlight}>
                  <span className="feature__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="feature__icon">
                    <Icon size={20} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="features__note" delay={120}>
          جرّب تحريك المؤشر فوق الهيرو، ثم بدّل الثيم من الأعلى ولاحظ تغيّر الإضاءة والمواد معاً.
        </Reveal>
      </div>
    </section>
  )
}