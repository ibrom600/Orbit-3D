import { useState } from 'react'
import { MousePointer2, RotateCcw, Shuffle, Sparkles } from 'lucide-react'
import LabScene from './three/LabScene'
import Reveal from './Reveal'
import SceneCanvas from './three/SceneCanvas'
import { LAB_DEFAULTS, MATERIALS, SHAPES, materialLabel, shapeLabel } from '../data/lab'
import { useFps } from '../hooks/useFps'
import { useTheme } from '../theme/context'

const TOGGLES = [
  { key: 'autoRotate', label: 'دوران تلقائي' },
  { key: 'wireframe', label: 'إطار شبكي' },
  { key: 'particles', label: 'جزيئات متوهّجة' },
  { key: 'bloom', label: 'توهّج Bloom' },
]

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export default function Lab() {
  const { themes, setThemeId } = useTheme()
  const [state, setState] = useState(LAB_DEFAULTS)
  const fps = useFps()

  const update = (patch) => setState((prev) => ({ ...prev, ...patch }))

  const randomize = () => {
    setThemeId(pick(themes).id)
    setState({
      shape: pick(SHAPES).id,
      material: pick(MATERIALS).id,
      roughness: Number((Math.random() * 0.75 + 0.05).toFixed(2)),
      metalness: Number(Math.random().toFixed(2)),
      autoRotate: true,
      wireframe: Math.random() > 0.55,
      particles: true,
      bloom: Math.random() > 0.2,
    })
  }

  return (
    <section id="lab" className="section">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">المختبر</span>
          <h2 className="section-title">
            غيّر كل شيء <span className="grad">بيدك</span>
          </h2>
          <p className="lead">
            بدّل المجسّم والمادة، اضبط الخشونة والانعكاس، وأشعل التوهّج. كل تعديل يظهر مباشرة في المشهد دون إعادة تحميل.
          </p>
        </Reveal>

        <div className="lab__grid">
          <Reveal className="lab__stage">
            <SceneCanvas camera={{ position: [0, 0.9, 5.6], fov: 42 }}>
              <LabScene {...state} />
            </SceneCanvas>
            <div className="stage-hud stage-hud--top">
              <span className="hud-chip hud-chip--live">
                <b>{fps}</b> FPS
              </span>
              <span className="hud-chip">WebGL 2</span>
              <span className="hud-chip">
                {shapeLabel(state.shape)} · {materialLabel(state.material)}
              </span>
            </div>
            <div className="stage-hud stage-hud--bottom">
              <span className="hud-chip">
                <MousePointer2 size={12} /> اسحب للتدوير · العجلة للتكبير
              </span>
            </div>
          </Reveal>
          <Reveal className="lab__panel" delay={120}>
            <div className="lab__group">
              <header className="lab__group-head">
                <span>المجسّم</span>
                <span className="mono">{SHAPES.length} خيارات</span>
              </header>
              <div className="segmented">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.id}
                    type="button"
                    className={'seg ' + (state.shape === shape.id ? 'is-active' : '')}
                    aria-pressed={state.shape === shape.id}
                    onClick={() => update({ shape: shape.id })}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lab__group">
              <header className="lab__group-head">
                <span>المادة</span>
                <span className="mono">{MATERIALS.length} خيارات</span>
              </header>
              <div className="segmented">
                {MATERIALS.map((material) => (
                  <button
                    key={material.id}
                    type="button"
                    className={'seg ' + (state.material === material.id ? 'is-active' : '')}
                    aria-pressed={state.material === material.id}
                    onClick={() => update({ material: material.id })}
                  >
                    {material.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lab__group">
              <header className="lab__group-head">
                <span>الخصائص الفيزيائية</span>
                <span className="mono">PBR</span>
              </header>
              <label className="range-row">
                <span>
                  الخشونة
                  <output dir="ltr">{state.roughness.toFixed(2)}</output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.roughness}
                  aria-label="الخشونة"
                  onChange={(event) => update({ roughness: Number(event.target.value) })}
                />
              </label>
              <label className="range-row">
                <span>
                  الانعكاس المعدني
                  <output dir="ltr">{state.metalness.toFixed(2)}</output>
                </span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={state.metalness}
                  aria-label="الانعكاس المعدني"
                  onChange={(event) => update({ metalness: Number(event.target.value) })}
                />
              </label>
            </div>

            <div className="lab__group">
              <header className="lab__group-head">
                <span>المؤثرات</span>
              </header>
              {TOGGLES.map((toggle) => (
                <div className="switch-row" key={toggle.key}>
                  <span>{toggle.label}</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={state[toggle.key]}
                    aria-label={toggle.label}
                    className={'switch ' + (state[toggle.key] ? 'is-on' : '')}
                    onClick={() => update({ [toggle.key]: !state[toggle.key] })}
                  />
                </div>
              ))}
            </div>

            <div className="lab__actions">
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => setState(LAB_DEFAULTS)}>
                <RotateCcw size={15} />
                إعادة الضبط
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={randomize}>
                <Shuffle size={15} />
                خلط عشوائي
              </button>
            </div>
            <p className="lab__hint">
              <Sparkles size={14} />
              الخلط العشوائي يغيّر الثيم أيضاً — راقب انتقال الألوان داخل المشهد.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}