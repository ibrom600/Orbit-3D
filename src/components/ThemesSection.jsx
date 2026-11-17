import { Check, Palette } from 'lucide-react'
import Reveal from './Reveal'
import { spotlight } from '../lib/spotlight'
import { useTheme } from '../theme/context'

export default function ThemesSection() {
  const { themes, themeId, setThemeId } = useTheme()

  return (
    <section id="themes" className="section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">الثيمات</span>
          <h2 className="section-title">
            أربعة عوالم، <span className="grad">زرّ واحد</span>
          </h2>
          <p className="lead">
            الثيم ليس مجرد ألوان واجهة: إنه يمرّر لوحة كاملة إلى WebGL — لون الشيدر، المعادن، الزجاج، الجزيئات، الإضاءة، وخريطة البيئة.
          </p>
        </Reveal>

        <div className="themes__grid">
          {themes.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <button
                type="button"
                className={'theme-card ' + (item.id === themeId ? 'is-active' : '')}
                style={{ '--c1': item.ui.accent, '--c2': item.ui.accent2, '--c3': item.ui.bgSoft }}
                onClick={() => setThemeId(item.id)}
                onMouseMove={spotlight}
                aria-pressed={item.id === themeId}
              >
                <span className="theme-card__preview" aria-hidden="true">
                  <i />
                  <b />
                </span>
                <span className="theme-card__body">
                  <span className="theme-card__row">
                    <strong>{item.name}</strong>
                    {item.id === themeId ? (
                      <span className="theme-card__badge">
                        <Check size={12} /> مفعّل
                      </span>
                    ) : null}
                  </span>
                  <span className="theme-card__tag">{item.tagline}</span>
                  <span className="theme-card__desc">{item.description}</span>
                  <span className="theme-card__swatches">
                    {item.swatches.map((color) => (
                      <i key={color} style={{ background: color }} />
                    ))}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal className="themes__note" delay={160}>
          <Palette size={16} />
          انتقل إلى المختبر وغيّر الثيم من الشريط العلوي — ستلاحظ انتقال الألوان داخل المشهد بشكل تدريجي لا مفاجئ.
        </Reveal>
      </div>
    </section>
  )
}