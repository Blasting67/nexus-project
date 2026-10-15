import React from 'react'
import { HudItem, useSlideShown } from '../../hud/HudSlide'
import { GROUP_STYLES } from '../../trading/CandlePatterns'
import { PatternCard } from '../../trading/PatternCard'
import { PatternIllustration } from '../../trading/PatternIllustration'
import { PATTERN_GROUPS } from '../../trading/PatternData'
import type { PatternCategory } from '../../trading/PatternData'
import { SectionHeading } from '../../trading/SectionHeading'

/** Subtema de Velas japonesas: un grupo de patrones (subida, bajada o indecisión) con sus tarjetas de siempre. */
export const PatternsSlide: React.FC<{ category: PatternCategory }> = ({ category }) => {
  const shown = useSlideShown()
  const group = PATTERN_GROUPS.find((g) => g.category === category)
  if (!group) return null
  const style = GROUP_STYLES[category]

  return (
    <>
      <HudItem lazy order={0} className="col-span-full">
        <SectionHeading title="Velas japonesas: semáforos del precio" />
        <h3 className="flex items-center gap-2.5 text-sm font-semibold text-slate-700">
          <span className={`h-2.5 w-2.5 rounded-full ring-4 ${style.dot}`} />
          {group.title}
          <span className="h-px flex-1 bg-slate-100" />
        </h3>
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
            className="h-full"
          >
            <PatternIllustration candles={pattern.candles} label={pattern.description} shown={shown} />
          </PatternCard>
        </HudItem>
      ))}
    </>
  )
}
