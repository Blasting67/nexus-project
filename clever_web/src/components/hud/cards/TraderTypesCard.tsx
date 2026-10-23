import React, { useState } from 'react'
import { TRADERS } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS, HUD_TONES } from '../HudIcons'
import { useSlideState } from '../HudSlide'

const DOT = ['bg-rose-300', 'bg-amber-300', 'bg-emerald-300', 'bg-sky-300']

export const TraderTypesCard: React.FC = () => {
  const active = useSlideState() === 'active'
  const [picked, setPicked] = useState<number | null>(null)
  const choice = picked !== null ? TRADERS[picked] : null

  return (
    <HudCard title="Tipos de trader" icon="users">
      <p className="-mt-1 mb-[clamp(0.5rem,1.6vh,1rem)] text-[clamp(0.75rem,1.6vh,0.875rem)] hud-ink-soft">
        De las operaciones más rápidas a las más pacientes
      </p>

      <div aria-hidden="true" className="mb-3 hidden sm:block">
        <div className="relative grid grid-cols-4">
          <span
            className="absolute inset-x-[12.5%] top-1/2 h-1.5 -translate-y-1/2 rounded-full"
            style={{ background: 'linear-gradient(90deg,#fecdd3,#fde68a,#a7f3d0,#bae6fd)' }}
          />
          {TRADERS.map((t, i) => (
            <span key={t.name} className="relative flex justify-center">
              <span className={`h-3.5 w-3.5 rounded-full ring-4 hud-ring-surface transition duration-300 ${DOT[i]} ${picked === i ? 'scale-150' : ''}`} />
            </span>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] hud-ink-dim">
          <span>Más rápido</span>
          <span>Más paciente</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
        {TRADERS.map((t, i) => {
          const Icon = HUD_ICONS[t.icon]
          const tone = HUD_TONES[t.tone]
          const on = picked === i
          return (
            <button
              key={t.name}
              type="button"
              aria-pressed={on}
              onClick={() => setPicked(on ? null : i)}
              style={{ transitionDelay: active ? `${500 + i * 110}ms` : '0ms' }}
              className={`group flex min-h-0 flex-col items-center justify-center rounded-3xl p-[clamp(0.6rem,1.6vh,1rem)] text-center ring-1 transition duration-500 sm:flex-row sm:justify-start sm:gap-3 sm:text-left hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none ${
                active ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              } ${on ? 'scale-[1.03] hud-panel-active shadow-lg shadow-violet-500/20' : 'hud-panel'}`}
            >
              <span
                className={`mb-2 flex h-[clamp(2.4rem,5.5vh,3.25rem)] w-[clamp(2.4rem,5.5vh,3.25rem)] shrink-0 items-center justify-center rounded-2xl sm:mb-0 transition duration-300 group-hover:scale-110 group-hover:-rotate-6 motion-reduce:transition-none ${tone.circle}`}
              >
                <Icon className="h-1/2 w-1/2" />
              </span>
              <span className="min-w-0">
                <span className="block text-[clamp(0.8rem,1.8vh,0.95rem)] font-semibold leading-tight hud-ink">{t.name}</span>
                <span className="mt-0.5 block text-[clamp(0.7rem,1.5vh,0.8rem)] leading-snug hud-ink-soft">{t.text}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-[clamp(0.6rem,1.8vh,1.25rem)] rounded-3xl hud-tint-duo px-4 py-[clamp(0.6rem,1.6vh,1.1rem)] text-center ring-1">
        <p className="text-[clamp(0.9rem,2vh,1.1rem)] font-bold hud-ink">Y tú, ¿qué tipo de trader quieres ser?</p>
        <p aria-live="polite" className="mt-1 min-h-[1.25rem] text-sm hud-ink-soft">
          {choice ? (
            <span key={choice.name} className="hud-fade inline-block">
              Te inclinas por ser <span className={`font-semibold ${HUD_TONES[choice.tone].text}`}>{choice.name}</span>: {choice.pitch}
            </span>
          ) : (
            'Toca una opción para elegir.'
          )}
        </p>
      </div>
    </HudCard>
  )
}