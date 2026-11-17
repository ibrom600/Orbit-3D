import { ArrowLeft, Heart, Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import Brand from './Brand'
import Reveal from './Reveal'
import { useTheme } from '../theme/context'

const EXPLORE = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#features', label: 'القدرات' },
  { href: '#lab', label: 'المختبر' },
  { href: '#showcase', label: 'المعرض' },
  { href: '#themes', label: 'الثيمات' },
]

const STACK = ['React 19', 'Three.js', 'React Three Fiber', 'Drei', 'Postprocessing', 'Vite']

const HIGHLIGHTS = [
  'شيدر Simplex 3D للنواة',
  'MeshTransmissionMaterial للزجاج',
  'Environment عبر Lightformer',
  'Bloom + Vignette + Noise',
]

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  const { theme } = useTheme()
  const year = CURRENT_YEAR

  const celebrate = () => {
    confetti({
      particleCount: 140,
      spread: 78,
      startVelocity: 42,
      origin: { y: 0.62 },
      colors: [theme.ui.accent, theme.ui.accent2, '#ffffff'],
      disableForReducedMotion: true,
    })
  }

  return (
    <footer className="footer">
      <div className="container">
        <Reveal className="cta">
          <span className="eyebrow">البداية</span>
          <h2>
            جاهز لتصنع <span className="grad">بُعدك</span> الخاص؟
          </h2>
          <p className="lead">
            هذه الصفحة نفسها هي العرض التقني — خذها كأساس لمشروعك التالي، أو جرّب كل الأزرار أولاً.
          </p>
          <div className="cta__actions">
            <a className="btn btn--primary" href="#lab">
              <Sparkles size={17} />
              إلى المختبر
            </a>
            <button type="button" className="btn btn--ghost" onClick={celebrate}>
              احتفل بالمشهد
              <ArrowLeft size={17} />
            </button>
          </div>
        </Reveal>

        <div className="footer__grid">
          <div className="footer__brand">
            <Brand />
            <p>أوربِت — استوديو تجارب ثلاثية الأبعاد تفاعلية، مبني بالكامل داخل المتصفّح بلا أصول خارجية.</p>
            <div className="footer__chips">
              {STACK.map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <nav className="footer__col" aria-label="روابط الموقع">
            <h4>استكشف</h4>
            <div className="footer__links">
              {EXPLORE.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="footer__col">
            <h4>ما الذي يعمل هنا؟</h4>
            <div className="footer__links">
              {HIGHLIGHTS.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {year} أوربِت — جميع الحقوق محفوظة.</span>
          <span className="footer__made">
            صُنع بشغف
            <Heart size={13} />
            React + Three.js
          </span>
        </div>
      </div>
    </footer>
  )
}