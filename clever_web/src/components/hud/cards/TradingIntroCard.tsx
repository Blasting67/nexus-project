import React, { useEffect, useState } from 'react'
import { TRADING_INTRO } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS, HUD_TONES } from '../HudIcons'
import { useSlideState } from '../HudSlide'

const Arrow = HUD_ICONS.arrowRight
const reduced = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Introducción: ¿Qué es hacer Trading? — la analogía del tianguis en tres pasos que se iluminan en secuencia. */
export const TradingIntroCard: React.FC = () => {
  const visible = useSlideState() === 'active'
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  // cada vez que la sección aparece, la historia empieza de nuevo en "Hoy"
  useEffect(() => {
    if (visible) setCurrent(0)
  }, [visible])

  // recorre los pasos por sí solo mientras la sección está a la vista
  useEffect(() => {
    if (!visible || paused || reduced()) return
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % TRADING_INTRO.steps.length), 2400)
    return () => window.clearInterval(id)
  }, [visible, paused])

  return (
    <HudCard title="¿Qué es hacer Trading?" icon="book">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
          <HUD_ICONS.bulb className="h-3.5 w-3.5" />
          Analogía
        </span>
        <p className="text-[clamp(0.8rem,1.8vh,1rem)] leading-relaxed text-slate-600">{TRADING_INTRO.analogy}</p>
      </div>

      <ol
        onMouseLeave={() => setPaused(false)}
        className="mt-[clamp(0.75rem,2vh,1.5rem)] grid min-h-0 flex-1 items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]"
      >
        {TRADING_INTRO.steps.flatMap((step, i) => {
          const Icon = HUD_ICONS[step.icon]
          const tone = HUD_TONES[step.tone]
          const on = current === i
          const card = (
            <li
              key={step.when}
              onMouseEnter={() => {
                setPaused(true)
                setCurrent(i)
              }}
              className={`flex min-h-0 flex-col justify-center rounded-3xl bg-white/80 p-[clamp(0.75rem,1.8vh,1.25rem)] ring-1 transition duration-500 md:flex-row md:items-center md:gap-4 motion-reduce:transition-none ${
                on ? '-translate-y-1 shadow-xl shadow-violet-200/50 ring-violet-200' : 'shadow-sm ring-slate-200/60'
              }`}
            >
              <span
                className={`mb-[clamp(0.4rem,1.2vh,0.75rem)] flex h-[clamp(2.25rem,5vh,3rem)] w-[clamp(2.25rem,5vh,3rem)] shrink-0 items-center justify-center rounded-full transition duration-500 md:mb-0 motion-reduce:transition-none ${tone.circle} ${
                  on ? 'scale-110' : ''
                }`}
              >
                <Icon className="h-1/2 w-1/2" />
              </span>
              <div className="min-w-0">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${tone.text}`}>{step.when}</p>
                <p className="mt-1 text-[clamp(0.75rem,1.7vh,0.9rem)] leading-snug text-slate-600">{step.text}</p>
              </div>
            </li>
          )
          if (i === TRADING_INTRO.steps.length - 1) return [card]
          return [
            card,
            <li key={`arrow-${i}`} aria-hidden="true" className="hidden items-center justify-center sm:flex">
              <Arrow className={`h-5 w-5 transition-colors duration-500 ${on ? 'hud-nudge text-violet-500' : 'text-violet-200'}`} />
            </li>,
          ]
        })}
      </ol>
    </HudCard>
  )
}