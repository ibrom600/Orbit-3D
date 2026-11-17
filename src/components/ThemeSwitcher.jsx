import { useTheme } from '../theme/context'

export default function ThemeSwitcher({ label = 'اختيار الثيم' }) {
  const { themes, themeId, setThemeId } = useTheme()

  return (
    <div className="theme-switch" role="group" aria-label={label}>
      {themes.map((item) => (
        <button
          key={item.id}
          type="button"
          className={'theme-switch__dot ' + (item.id === themeId ? 'is-active' : '')}
          style={{ '--dot': item.ui.accent, '--dot-2': item.ui.accent2 }}
          title={item.name + ' · ' + item.tagline}
          aria-label={'ثيم ' + item.name}
          aria-pressed={item.id === themeId}
          onClick={() => setThemeId(item.id)}
        >
          <span />
        </button>
      ))}
    </div>
  )
}