import { useState } from 'react'
import Reveal from './Reveal'
import SceneCanvas from './three/SceneCanvas'
import ShowcaseScene from './three/ShowcaseScene'

const ITEMS = [
  {
    tag: 'Glass',
    title: 'دونات زجاجية',
    text: 'انكسار وتشتيت لوني عبر مادة Transmission مع نواة مضيئة في المركز.',
  },
  {
    tag: 'Metal',
    title: 'بلّورة كروم',
    text: 'معدن عالي الانعكاس داخل بيئة استوديو مولّدة بالكود، مع غلاف شبكي تقني.',
  },
  {
    tag: 'Emissive',
    title: 'أصداف هولوغرام',
    text: 'حلقات مشعّة بحركة مستمرة وتوهّج Bloom يمنحها حضوراً نيونياً.',
  },
]

export default function Showcase() {
  const [active, setActive] = useState(1)

  return (
    <section id="showcase" className="section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">المعرض</span>
          <h2 className="section-title">
            ثلاثة مجسّمات، <span className="grad">ثلاث مواد</span>
          </h2>
          <p className="lead">
            مرّر فوق البطاقات أو ركّز عليها بلوحة المفاتيح لتكبير المجسم المقابل وإضاءة حلقته داخل المشهد.
          </p>
        </Reveal>

        <Reveal className="showcase__stage">
          <SceneCanvas camera={{ position: [0, 0.4, 7.6], fov: 40 }}>
            <ShowcaseScene active={active} />
          </SceneCanvas>
          <div className="stage-hud stage-hud--top">
            <span className="hud-chip hud-chip--live">مشهد حيّ</span>
            <span className="hud-chip">{ITEMS[active].tag}</span>
          </div>
        </Reveal>

        <div className="showcase__cards">
          {ITEMS.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <button
                type="button"
                className={'artifact ' + (active === index ? 'is-active' : '')}
                aria-pressed={active === index}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
              >
                <span className="artifact__tag">
                  <i />
                  {item.tag}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}