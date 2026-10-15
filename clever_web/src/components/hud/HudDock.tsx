import React from 'react'
import { HUD_ICONS } from './HudIcons'

export interface HudDockSection {
  id: string
  label: string
}

interface HudDockProps {
  sections: HudDockSection[]
  index: number
  onSelect: (i: number) => void
  onPrev: () => void
  onNext: () => void
  label?: string
}

const Left = HUD_ICONS.chevronLeft
const Right = HUD_ICONS.chevronRight
const MouseIcon = HUD_ICONS.mouse

const ARROW =
  'flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200 transition duration-200 hover:text-sky-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 active:scale-90 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none max-[420px]:hidden'

/**
 * Barra de secciones: un botón blanco pequeño por sección, sin texto.
 * Solo el seleccionado crece y muestra su título.
 */
export const HudDock: React.FC<HudDockProps> = ({ sections, index, onSelect, onPrev, onNext, label = 'Secciones' }) => (
  <nav aria-label={label} className="sticky bottom-3 z-20 mt-4 flex h-14 items-center justify-center">
    {/* guía de navegación (solo pantallas anchas) */}
    <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex">
      <span className="relative flex h-10 w-7 shrink-0 items-center justify-center text-slate-300">
        <MouseIcon className="h-9 w-9" />
        <span className="hud-wheel absolute top-[11px] h-1.5 w-0.5 rounded-full bg-sky-400" />
      </span>
      <div>
        <p className="text-xs font-semibold text-slate-500">Scrollea para cambiar</p>
        <p className="text-[11px] leading-snug text-slate-400">o usa las flechas del teclado</p>
      </div>
    </div>

    <div className="flex items-center gap-2 rounded-full bg-white/70 p-1.5 shadow-lg shadow-sky-200/40 ring-1 ring-white backdrop-blur-md">
      <button type="button" onClick={onPrev} disabled={index === 0} aria-label="Sección anterior" className={`${ARROW} hover:-translate-x-0.5`}>
        <Left className="h-5 w-5" />
      </button>

      <div role="tablist" aria-label={label} className="flex items-center rounded-full bg-white/60 px-2 py-2 ring-1 ring-white max-sm:px-1.5">
        {sections.map((s, i) => {
          const on = i === index
          return (
            // el botón es la zona de toque (fija, sin solaparse con sus vecinos); solo el círculo interior crece
            <button
              key={s.id}
              id={`hud-tab-${s.id}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls={`hud-panel-${s.id}`}
              aria-label={s.label}
              onClick={() => onSelect(i)}
              className="group flex h-9 items-center px-[3px] focus-visible:outline-none sm:px-1"
            >
              <span
                className={`flex items-center rounded-full bg-white ring-1 transition-[height,padding,box-shadow,transform] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-focus-visible:ring-2 group-focus-visible:ring-sky-400 motion-reduce:transition-none ${
                  on
                    ? 'hud-glow-sky h-9 px-4 text-sky-700 shadow-md ring-sky-200 max-sm:px-3'
                    : 'h-3 px-1.5 shadow ring-slate-300/80 group-hover:scale-125 group-hover:shadow-md group-active:scale-90'
                }`}
              >
                <span
                  className={`grid transition-[grid-template-columns,opacity] duration-500 ease-out motion-reduce:transition-none ${
                    on ? 'grid-cols-[1fr] opacity-100' : 'grid-cols-[0fr] opacity-0'
                  }`}
                >
                  <span className="min-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold max-sm:text-xs">{s.label}</span>
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <button type="button" onClick={onNext} disabled={index === sections.length - 1} aria-label="Sección siguiente" className={`${ARROW} hover:translate-x-0.5`}>
        <Right className="h-5 w-5" />
      </button>
    </div>
  </nav>
)
