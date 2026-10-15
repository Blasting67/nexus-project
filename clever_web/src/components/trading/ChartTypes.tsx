import React from 'react'
import { ChartCard } from './ChartCard'
import type { ChartTone } from './ChartCard'
import { SectionHeading } from './SectionHeading'
import { useReveal } from './useReveal'
import {
  CandlesPreview,
  HeikinAshiPreview,
  LineChartPreview,
  OhlcBarsPreview,
  RenkoPreview,
} from './chartPreviews'

const TONES: Record<'sky' | 'violet' | 'amber' | 'teal' | 'pink', ChartTone> = {
  sky: { panel: 'bg-sky-50/70', chip: 'bg-sky-50 text-sky-700 ring-sky-100' },
  violet: { panel: 'bg-violet-50/70', chip: 'bg-violet-50 text-violet-700 ring-violet-100' },
  amber: { panel: 'bg-amber-50/70', chip: 'bg-amber-50 text-amber-700 ring-amber-100' },
  teal: { panel: 'bg-teal-50/70', chip: 'bg-teal-50 text-teal-700 ring-teal-100' },
  pink: { panel: 'bg-pink-50/70', chip: 'bg-pink-50 text-pink-700 ring-pink-100' },
}

export const CHARTS: Array<{
  name: string
  shows: string
  audience: string
  description: string
  tone: ChartTone
  Preview: React.FC<{ shown: boolean }>
  layout: string // posición en la cuadrícula (3 arriba, 2 abajo en pantallas anchas)
}> = [
  {
    name: 'Líneas',
    shows: 'Solo precio de cierre',
    audience: 'Principiantes',
    description: 'Une los precios de cierre con una sola línea. Es fácil de leer y sirve para ver la dirección general.',
    tone: TONES.sky,
    Preview: LineChartPreview,
    layout: 'lg:col-span-2',
  },
  {
    name: 'Barras',
    shows: 'Apertura, cierre, máximo, mínimo',
    audience: 'Análisis detallado',
    description:
      'Cada barra es un periodo: la marca izquierda es la apertura, la derecha el cierre y la línea va del mínimo al máximo.',
    tone: TONES.violet,
    Preview: OhlcBarsPreview,
    layout: 'lg:col-span-2',
  },
  {
    name: 'Velas japonesas',
    shows: 'Todo lo anterior, más visual',
    audience: 'El más usado',
    description:
      'El cuerpo une apertura y cierre y las mechas marcan máximo y mínimo. Verde indica que el precio subió y rosa que bajó.',
    tone: TONES.amber,
    Preview: CandlesPreview,
    layout: 'lg:col-span-2',
  },
  {
    name: 'Heikin Ashi',
    shows: 'Suavizado',
    audience: 'Tendencias claras',
    description:
      'Promedia los valores de cada vela para reducir el ruido: se forman rachas de un solo color que muestran mejor la tendencia.',
    tone: TONES.teal,
    Preview: HeikinAshiPreview,
    layout: 'sm:col-span-1 lg:col-span-3',
  },
  {
    name: 'Renko',
    shows: 'Solo movimiento de precio',
    audience: 'Tendencias puras',
    description:
      'Ignora el tiempo: dibuja un ladrillo solo cuando el precio se mueve una cantidad fija, y así la tendencia queda sin ruido.',
    tone: TONES.pink,
    Preview: RenkoPreview,
    layout: 'sm:col-span-2 lg:col-span-3',
  },
]

/** Parte 2: tipos de gráficos de precios, todos dibujados con los mismos datos de ejemplo. */
export const ChartTypes: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.1)

  return (
    <section ref={ref} aria-label="Gráficos de precios">
      <SectionHeading
        title="Gráficos: el electrocardiograma del precio"
        subtitle="Los cinco gráficos usan los mismos precios, vistos de formas distintas."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {CHARTS.map(({ Preview, layout, ...chart }, i) => (
          <ChartCard key={chart.name} {...chart} shown={shown} index={i} className={layout}>
            <Preview shown={shown} />
          </ChartCard>
        ))}
      </div>
    </section>
  )
}