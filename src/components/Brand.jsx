import { Orbit } from 'lucide-react'

export default function Brand({ compact = false }) {
  return (
    <a className="brand" href="#home" aria-label="أوربِت — العودة إلى أعلى الصفحة">
      <span className="brand__mark">
        <Orbit size={19} />
      </span>
      <span className="brand__text">
        أوربِت
        {compact ? null : <small>استوديو ثلاثي الأبعاد</small>}
      </span>
    </a>
  )
}