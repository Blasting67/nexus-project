import React from 'react'
import { HudItem, useSlideShown } from '../../hud/HudSlide'
import { GROUP_STYLES } from '../../trading/CandlePatterns'
import { PatternCard } from '../../trading/PatternCard'
import { PatternIllustration } from '../../trading/PatternIllustration'
import type { PatternSignal } from '../../trading/PatternIllustration'
import { PATTERN_GROUPS } from '../../trading/PatternData'
import type { PatternCategory } from '../../trading/PatternData'

const SIGNAL: Record<PatternCategory, PatternSignal> = { bullish: 'up', bearish: 'down', indecision: 'pause' }

/**
 * Subtema de Velas japonesas: un grupo de patrones (subida, bajada o indecisión).
 * Con seis patrones se muestran tres por fila; con cuatro, dos por fila y con dibujos más anchos.
 */
export const PatternsSlide: React.FC<{ category: PatternCategory }> = ({ category }) => {
  const shown = useSlideShown()
  const group = PATTERN_GROUPS.find((g) => g.category === category)
  if (!group) return null
  const style = GROUP_STYLES[category]
  const wide = group.patterns.length <= 4

  return (
    <>
      <HudItem lazy order={0} className="col-span-full">
        <header className="flex items-end justify-between gap-4 px-1">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">Velas japonesas: semáforos del precio</p>
            <h3 className="mt-1 flex items-center gap-3 text-xl font-bold tracking-tight text-slate-900">
              <span className={`h-3 w-3 rounded-full ring-4 ${style.dot}`} />
              {group.title}
            </h3>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${style.chip}`}>{group.patterns.length} patrones</span>
        </header>
      </HudItem>

      {group.patterns.map((pattern, i) => (
        <HudItem lazy key={pattern.id} order={i + 1}>
          <PatternCard
            name={pattern.name}
            meaning={pattern.meaning}
            candleCount={pattern.candles.filter((k) => !k.context).length}
            panel={style.panel}
            chip={style.chip}
            shown={shown}
            index={i}
            wide={wide}
            className="h-full"
          >
            <PatternIllustration candles={pattern.candles} label={pattern.description} shown={shown} signal={SIGNAL[category]} wide={wide} />
          </PatternCard>
        </HudItem>
      ))}
    </>
  )
}