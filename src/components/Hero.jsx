import { ArrowLeft, Gauge, MousePointer2, Sparkles } from 'lucide-react'
import HeroScene from './three/HeroScene'
import SceneCanvas from './three/SceneCanvas'

const STATS = [
  { value: '4', label: 'ثيمات حيّة' },
  { value: '4', label: 'مواد PBR' },
  { value: '4', label: 'مجسمات تفاعلية' },
  { value: 'GLSL', label: 'شيدر مخصّص' },
]

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__canvas">
        <SceneCanvas camera={{ position: [0, 0.15, 6.2], fov: 42 }}>
          <HeroScene />
        </SceneCanvas>
      </div>

      <div className="container hero__content">
        <span className="pill">
          <span className="pill__dot" />
          استوديو تجارب ثلاثية الأبعاد داخل المتصفّح
        </span>
        <h1>
          نصنع عوالم <span className="grad">تتنفّس</span> بالويب جي إل
        </h1>
        <p className="hero__lead">
          مشهد تفاعلي كامل مبني بـ React Three Fiber: شيدرات GLSL مكتوبة يدوياً، مواد انكسار واقعية،
          حقول جزيئات، معالجة بصرية سينمائية، وأربعة ثيمات تغيّر الواجهة والمشهد ثلاثي الأبعاد في اللحظة نفسها.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href="#lab">
            <MousePointer2 size={17} />
            جرّب المختبر التفاعلي
            <ArrowLeft size={17} />
          </a>
          <a className="btn btn--ghost" href="#themes">
            <Sparkles size={17} />
            استكشف الثيمات
          </a>
        </div>
        <ul className="hero__stats">
          {STATS.map((stat) => (
            <li className="hero__stat" key={stat.label}>
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <span className="hero__chip hero__chip--a" aria-hidden="true">
        <span className="chip-dot" />
        GLSL Simplex Shader
      </span>
      <span className="hero__chip hero__chip--b" aria-hidden="true">
        <Gauge size={14} />
        60 إطاراً/ثانية
      </span>

      <a className="hero__cue" href="#features" aria-label="انتقل إلى قسم القدرات">
        <span className="hero__mouse" />
        <span>مرّر للأسفل</span>
      </a>
    </section>
  )
}