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

  className?: string

  hintTitle?: string
  hintText?: string

  mobileGrid?: string

  topAction?: React.ReactNode
}

const BUTTON_H = 48
const GAP = 4

const Up = HUD_ICONS.chevronUp
const Down = HUD_ICONS.chevronDown

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
  topAction,
}) => (
  <aside aria-label="Secciones" className={`lg:w-60 ${className}`}>
    {topAction}
    <p className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-dim)] ${topAction ? 'mt-6' : ''}`}>Temas</p>
    <div role="tablist" aria-orientation="vertical" className={`relative grid ${mobileGrid} gap-2 lg:grid-cols-1 lg:gap-1 lg:border-l lg:border-[var(--border)]`}>

      <span
        aria-hidden="true"
        style={{ transform: `translateY(${index * (BUTTON_H + GAP)}px)` }}
        className="pointer-events-none absolute -left-px top-0 hidden h-12 w-full transition-transform duration-300 ease-out motion-reduce:transition-none lg:block"
      >
        <span className="absolute inset-0 rounded-r-lg bg-[var(--surface-alt)]" />
        <span className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-[var(--primary)]" />
      </span>

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
            className={`group relative z-10 flex min-h-[48px] items-center gap-3 rounded-lg px-3 py-2 text-left text-sm leading-tight lg:h-12 lg:py-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] motion-reduce:transition-none lg:rounded-l-none lg:pl-4 ${
              on
                ? 'bg-[var(--primary)] font-semibold text-[var(--primary-text)] lg:bg-transparent lg:text-[var(--text)]'
                : 'bg-[var(--surface)] font-medium text-[var(--text-muted)] ring-1 ring-[color:var(--border)] hover:text-[var(--text)] lg:bg-transparent lg:ring-0 lg:hover:bg-[var(--surface-alt)]'
            }`}
          >
            <Icon
              className={`h-[18px] w-[18px] shrink-0 transition duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none ${
                on ? 'text-[var(--primary-text)] lg:text-[var(--primary)]' : 'text-[var(--text-dim)] group-hover:text-[var(--text-muted)]'
              }`}
            />
            <span>{s.label}</span>
          </button>
        )
      })}
    </div>

    <div className="mt-6 hidden lg:block">
      <p className="px-3 text-xs font-medium text-[var(--text-muted)]">{hintTitle}</p>
      <p className="px-3 text-[11px] leading-snug text-[var(--text-dim)]">{hintText}</p>
      <div className="mt-3 flex gap-2 px-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          aria-label="Sección anterior"
          className="flex h-8 flex-1 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors duration-200 hover:border-[var(--text-dim)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] disabled:pointer-events-none disabled:opacity-40"
        >
          <Up className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === sections.length - 1}
          aria-label="Sección siguiente"
          className="flex h-8 flex-1 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition-colors duration-200 hover:border-[var(--text-dim)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] disabled:pointer-events-none disabled:opacity-40"
        >
          <Down className="h-4 w-4" />
        </button>
      </div>
    </div>

    <p className="mt-3 text-center text-xs text-[var(--text-dim)] lg:hidden">Toca una sección para cambiar</p>
  </aside>
)