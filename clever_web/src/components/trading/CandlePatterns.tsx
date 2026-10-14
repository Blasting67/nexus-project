import React from 'react'
import { PATTERN_GROUPS } from './PatternData'
import type { PatternCategory } from './PatternData'
import { PatternCard } from './PatternCard'
import { PatternIllustration } from './PatternIllustration'
import { SectionHeading } from './SectionHeading'
import { useReveal } from './useReveal'

const GROUP_STYLES: Record<PatternCategory, { dot: string; panel: string; chip: string }> = {
  bullish: {
    dot: 'bg-emerald-300 ring-emerald-100',
    panel: 'bg-emerald-50/60',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  bearish: {
    dot: 'bg-rose-300 ring-rose-100',
    panel: 'bg-rose-50/60',
    chip: 'bg-rose-50 text-rose-700 ring-rose-100',
  },
  indecision: {
    dot: 'bg-amber-300 ring-amber-100',
    panel: 'bg-amber-50/60',
    chip: 'bg-amber-50 text-amber-700 ring-amber-100',
  },
}

/** Posición en la cuadrícula de 6 columnas: grupos de 3 en tres columnas, grupos de 2 en dos más anchas. */
const layoutFor = (count: number, index: number) =>
  count === 2 ? 'lg:col-span-3' : index === 2 ? 'sm:col-span-2 lg:col-span-2' : 'lg:col-span-2'

/** Parte 3: patrones de velas japonesas agrupados por lo que anuncian. */
export const CandlePatterns: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.1)

  return (
    <section ref={ref} aria-label="Patrones de velas japonesas">
      <SectionHeading title="Velas japonesas: semáforos del precio" />

      <div className="space-y-8">
        {PATTERN_GROUPS.map((group) => {
          const style = GROUP_STYLES[group.category]
          return (
            <div key={group.category}>
              <h3 className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-slate-700">
                <span className={`h-2.5 w-2.5 rounded-full ring-4 ${style.dot}`} />
                {group.title}
                <span className="h-px flex-1 bg-slate-100" />
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
                {group.patterns.map((pattern, i) => (
                  <PatternCard
                    key={pattern.id}
                    name={pattern.name}
                    meaning={pattern.meaning}
                    candleCount={pattern.candles.filter((k) => !k.context).length}
                    panel={style.panel}
                    chip={style.chip}
                    shown={shown}
                    index={i}
                    className={layoutFor(group.patterns.length, i)}
                  >
                    <PatternIllustration candles={pattern.candles} label={pattern.description} shown={shown} />
                  </PatternCard>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
