import { useEffect, useState } from 'react'
import { Menu, Sparkles, X } from 'lucide-react'
import Brand from './Brand'
import ThemeSwitcher from './ThemeSwitcher'

const LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#features', label: 'القدرات' },
  { href: '#lab', label: 'المختبر' },
  { href: '#showcase', label: 'المعرض' },
  { href: '#themes', label: 'الثيمات' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={'nav ' + (scrolled ? 'is-scrolled' : '')}>
      <div className="container nav__inner">
        <Brand />
        <nav className="nav__links" aria-label="التنقل الرئيسي">
          {LINKS.map((link) => (
            <a key={link.href} className="nav__link" href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="nav__actions">
          <ThemeSwitcher />
          <a className="btn btn--primary btn--sm nav__cta" href="#lab">
            <Sparkles size={15} />
            ابدأ التجربة
          </a>
          <button
            type="button"
            className="nav__burger"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div className={'mobile-menu ' + (open ? 'is-open' : '')}>
        <nav aria-label="قائمة الجوال">
          {LINKS.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mobile-menu__foot">
          <span className="mono">الثيم الحالي</span>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  )
}