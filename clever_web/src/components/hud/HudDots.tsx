import React from 'react'
import { HUD_ICONS } from './HudIcons'

interface HudDotsProps {
  count: number
  index: number
  /** tamaño de cada grupo de puntos (se separan visualmente), p. ej. [4, 3, 2, 2]; por defecto, uno solo */
  groups?: number[]
  /** nombre accesible de cada punto (no se muestra en pantalla) */
  labels: string[]
  onSelect: (i: number) => void
  onPrev: () => void
  onNext: () => void
  label?: string
  hintTitle?: string
  hintText?: string
}

const Left = HUD_ICONS.chevronLeft
const Right = HUD_ICONS.chevronRight

const ARROW =
  'flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200 transition duration-200 hover:text-sky-600 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 active:scale-90 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none max-[420px]:hidden'

/**
 * Barra de subtemas: solo puntitos, sin texto.
 * El punto de la página actual se hace grande; los demás se quedan pequeños.
 */
export const HudDots: React.FC<HudDotsProps> = ({
  count,
  index,
  groups,
  labels,
  onSelect,
  onPrev,
  onNext,
  label = 'Subtemas',
  hintTitle = 'Desliza de lado para cambiar',
  hintText = 'o usa las flechas ← →',
}) => {
  // posiciones tras las que va un separador (final de cada grupo, menos el último)
  const breaks = new Set<number>()
  let acc = 0
  ;(groups ?? [count]).slice(0, -1).forEach((g) => {
    acc += g
    breaks.add(acc - 1)
  })

  return (
    <nav aria-label={label} className="sticky bottom-3 z-20 mt-4 flex h-12 items-center justify-center">
      {/* guía de navegación (solo pantallas anchas) */}
      <div className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center gap-3 lg:flex">
        <span className="flex shrink-0 text-slate-300">
          <Left className="h-4 w-4" />
          <Right className="h-4 w-4" />
        </span>
        <div>
          <p className="text-xs font-semibold text-slate-500">{hintTitle}</p>
          <p className="text-[11px] leading-snug text-slate-400">{hintText}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full bg-white/70 p-1.5 shadow-lg shadow-sky-200/40 ring-1 ring-white backdrop-blur-md">
        <button type="button" onClick={onPrev} disabled={index === 0} aria-label="Subtema anterior" className={`${ARROW} hover:-translate-x-0.5`}>
          <Left className="h-5 w-5" />
        </button>

        <div role="tablist" aria-label={label} className="flex items-center rounded-full bg-white/60 px-2 py-1 ring-1 ring-white max-sm:px-1">
          {Array.from({ length: count }, (_, i) => {
            const on = i === index
            return (
              <React.Fragment key={i}>
                {/* el botón es la zona de toque (fija); solo el círculo interior cambia de tamaño */}
                <button
                  id={`hud-dot-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-label={labels[i] ?? `Subtema ${i + 1}`}
                  onClick={() => onSelect(i)}
                  className="group flex h-8 items-center px-[3px] focus-visible:outline-none sm:px-1"
                >
                  <span className="relative flex items-center justify-center">
                    {/* halo que pulsa alrededor del punto actual */}
                    {on && <span aria-hidden="true" className="hud-ping absolute h-4 w-4 rounded-full bg-sky-400/50" />}
                    <span
                      className={`relative block rounded-full transition-[width,height,box-shadow,transform,background-color] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-focus-visible:ring-2 group-focus-visible:ring-sky-400 motion-reduce:transition-none ${
                        on
                          ? 'h-4 w-4 bg-sky-500 shadow-md shadow-sky-400/50 ring-2 ring-white'
                          : 'h-2 w-2 bg-white shadow ring-1 ring-slate-300 group-hover:scale-125 group-hover:shadow-md group-active:scale-90'
                      }`}
                    />
                  </span>
                </button>
                {breaks.has(i) && <span aria-hidden="true" className="mx-1.5 h-4 w-px rounded-full bg-slate-200 max-sm:mx-1" />}
              </React.Fragment>
            )
          })}
        </div>

        <button type="button" onClick={onNext} disabled={index === count - 1} aria-label="Subtema siguiente" className={`${ARROW} hover:translate-x-0.5`}>
          <Right className="h-5 w-5" />
        </button>
      </div>
    </nav>
  )
}
