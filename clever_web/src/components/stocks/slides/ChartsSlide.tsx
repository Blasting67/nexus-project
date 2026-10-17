import React from 'react'
import { HudItem, useSlideShown } from '../../hud/HudSlide'
import { ChartCard } from '../../trading/ChartCard'
import { CHARTS } from '../../trading/ChartTypes'
import { SectionHeading } from '../../trading/SectionHeading'

interface ChartsSlideProps {
  /** nombres de los gráficos de este subtema, tal como aparecen en ChartTypes */
  names: string[]
  /** una sola tarjeta: se centra en lugar de ocupar la mitad izquierda */
  single?: boolean
}

/** Subtema de Gráficos: el título del tema y las tarjetas indicadas (las mismas de siempre). */
export const ChartsSlide: React.FC<ChartsSlideProps> = ({ names, single = false }) => {
  const shown = useSlideShown()
  const charts = CHARTS.filter((c) => names.includes(c.name))

  return (
    <>
      <HudItem lazy order={0} className="sm:col-span-2">
        <SectionHeading
          title="Gráficos: el electrocardiograma del precio"
          subtitle="Los seis gráficos usan los mismos precios, vistos de formas distintas."
        />
      </HudItem>

      {charts.map(({ Preview, layout: _layout, ...chart }, i) => (
        <HudItem
          lazy
          key={chart.name}
          order={i + 1}
          className={single ? 'mx-auto w-full sm:col-span-2 sm:max-w-[29rem]' : ''}
        >
          {/* la posición en la cuadrícula original (layout) no se usa: aquí la decide el subtema */}
          <ChartCard {...chart} number={CHARTS.findIndex((c) => c.name === chart.name) + 1} shown={shown} index={i} className="h-full">
            <Preview shown={shown} />
          </ChartCard>
        </HudItem>
      ))}
    </>
  )
}