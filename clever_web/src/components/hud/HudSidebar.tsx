import React from 'react'
import { HUD_ICONS } from './HudIcons'
import type { HudIconKey } from './HudIcons'

export interface HudSection {
  id: string
  label: string
  icon: HudIconKey
}

interface HudSidebarProps {
  sections: HudSection[]
  index: number
  onSelect: (i: number) => void
  onPrev: () => void
  onNext: () => void
  /** clases extra para colocarlo dentro del layout de la página */
  className?: string
  /** texto de ayuda (por defecto: "Scrollea para cambiar" / "o usa las flechas del teclado") */
  hintTitle?: string
  hintText?: string
  /** columnas de los botones en pantallas pequeñas */
  mobileGrid?: string
}

const BUTTON_H = 56 // h-14
const GAP = 12 // gap-3

const Up = HUD_ICONS.chevronUp
const Down = HUD_ICONS.chevronDown
const MouseIcon = HUD_ICONS.mouse

/**
 * Panel de secciones. En pantallas anchas es una columna con un resaltado que se desliza entre botones;
 * en pantallas pequeñas, una fila de tres botones.
 */
export const HudSidebar: React.FC<HudSidebarProps> = ({
  sections,
  index,
  onSelect,
  onPrev,
  onNext,
  className = '',
  hintTitle = 'Scrollea para cambiar',
  hintText = 'o usa las flechas del teclado',
  mobileGrid = 'grid-cols-3',
}) => (
  <aside aria-label="Secciones" className={`lg:w-60 ${className}`}>
    <div role="tablist" aria-orientation="vertical" className={`relative grid ${mobileGrid} gap-2 lg:grid-cols-1 lg:gap-3`}>
      {/* resaltado que se desliza hasta el botón activo */}
      <span
        aria-hidden="true"
        style={{ transform: `translateY(${index * (BUTTON_H + GAP)}px)` }}
        className="hud-glow pointer-events-none absolute left-0 top-0 hidden h-14 w-full rounded-2xl bg-gradient-to-r from-white via-violet-50 to-sky-50 ring-1 ring-violet-200/70 transition-transform duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none lg:block"
      />

      {sections.map((s, i) => {
        const Icon = HUD_ICONS[s.icon]
        const on = i === index
        return (
          <button
            key={s.id}
            id={`hud-tab-${s.id}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={`hud-panel-${s.id}`}
            onClick={() => onSelect(i)}
            className={`group relative z-10 flex h-14 items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold leading-tight transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 active:scale-[0.97] motion-reduce:transition-none ${
              on
                ? 'bg-white text-violet-800 shadow-md lg:bg-transparent lg:shadow-none'
                : 'bg-white/55 text-slate-600 ring-1 ring-white hover:-translate-y-0.5 hover:bg-white/85 hover:text-slate-800 hover:shadow-md lg:hover:translate-x-1 lg:hover:translate-y-0'
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none ${
                on
                  ? 'bg-gradient-to-br from-sky-400 to-violet-500 text-white shadow-md shadow-violet-300/50'
                  : 'bg-violet-50 text-violet-400 group-hover:bg-violet-100'
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <span>{s.label}</span>
          </button>
        )
      })}
    </div>

    {/* guía de navegación */}
    <div className="mt-5 hidden rounded-2xl bg-white/60 p-4 ring-1 ring-white backdrop-blur lg:block">
      <div className="flex items-center gap-3">
        <span className="relative flex h-10 w-7 shrink-0 items-center justify-center text-slate-400">
          <MouseIcon className="h-9 w-9" />
          <span className="hud-wheel absolute top-[11px] h-1.5 w-0.5 rounded-full bg-violet-400" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-700">{hintTitle}</p>
          <p className="text-[11px] leading-snug text-slate-400">{hintText}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Sección anterior"
          className="flex h-9 flex-1 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:text-violet-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <Up className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === sections.length - 1}
          aria-label="Sección siguiente"
          className="flex h-9 flex-1 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200 transition duration-200 hover:translate-y-0.5 hover:text-violet-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 active:scale-95 disabled:pointer-events-none disabled:opacity-40"
        >
          <Down className={`h-5 w-5 ${index === sections.length - 1 ? '' : 'hud-bob'}`} />
        </button>
      </div>
    </div>

    <p className="mt-3 text-center text-xs text-slate-400 lg:hidden">Toca una sección para cambiar</p>
  </aside>
)