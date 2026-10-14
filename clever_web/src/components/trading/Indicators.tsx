import React from 'react'
import { CATEGORIES, MOMENTUM, STRUCTURE, VOLATILITY } from './IndicatorData'
import type { CategoryKey, Indicator } from './IndicatorData'
import { CategoryHeader, IndicatorAccordion } from './IndicatorParts'
import { SectionHeading } from './SectionHeading'
import { TrendIndicators } from './TrendIndicators'
import { useReveal } from './useReveal'

/** Categorías B, C y D: cada indicador es una tarjeta expandible (una abierta a la vez). */
const IndicatorGroup: React.FC<{ category: CategoryKey; items: Indicator[]; defaultOpen: string }> = ({
  category,
  items,
  defaultOpen,
}) => {
  const { ref, shown } = useReveal<HTMLDivElement>(0.1)

  return (
    <div ref={ref} aria-label={CATEGORIES[category].title}>
      <CategoryHeader category={category} />
      <IndicatorAccordion items={items} category={category} shown={shown} defaultOpen={defaultOpen} />
    </div>
  )
}

/** Parte 4: indicadores y herramientas de análisis, en cuatro familias. */
export const Indicators: React.FC = () => (
  <section aria-label="Indicadores y herramientas de análisis">
    <SectionHeading
      title="Indicadores: los instrumentos del tablero"
      subtitle="Cuatro familias de herramientas para leer un mismo gráfico desde ángulos distintos. Son apoyos para interpretar, no garantías."
    />

    <div className="space-y-12">
      <TrendIndicators />
      <IndicatorGroup category="momentum" items={MOMENTUM} defaultOpen="macd" />
      <IndicatorGroup category="volatility" items={VOLATILITY} defaultOpen="bollinger" />
      <IndicatorGroup category="structure" items={STRUCTURE} defaultOpen="elliott" />
    </div>
  </section>
)
