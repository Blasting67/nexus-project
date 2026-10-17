import React from 'react'
import { BackToAnalysisButton } from '../analysis/BackToAnalysisButton'
import { CandlestickStructure } from '../analysis/CandlestickStructure'
import { HudItem } from '../hud/HudSlide'
import { TopicHud } from '../hud/TopicHud'
import type { Topic } from '../hud/TopicHud'
import { CommandmentsBook } from '../trading/CommandmentsBook'
import { MOMENTUM, STRUCTURE, VOLATILITY } from '../trading/IndicatorData'
import { ChartsSlide } from './slides/ChartsSlide'
import {
  IchimokuSlide,
  IndicatorSlide,
  MovingAveragesSlide,
  OtherAveragesSlide,
  SmaEmaSlide,
} from './slides/IndicatorSlides'
import { MistakesSlide } from './slides/MistakesSlide'
import { PatternsSlide } from './slides/PatternsSlide'

/* Disposición de las tarjetas dentro de un subtema (las tarjetas en sí no cambian). */
const CHARTS_LAYOUT = 'grid w-full gap-5 sm:grid-cols-2'
const STACK = 'grid gap-4'

/**
 * Temas (barra lateral, ↑ ↓) y subtemas (barra de puntos, ← →) del análisis de acciones.
 * Aquí solo se decide qué tarjeta va en cada pantalla.
 */
const TOPICS: Topic[] = [
  {
    id: 'charts',
    label: 'Gráficos',
    icon: 'chart',
    slides: [
      {
        id: 'lines-bars',
        label: 'Líneas y barras',
        layout: CHARTS_LAYOUT,
        children: <ChartsSlide names={['Líneas', 'Barras']} />,
      },
      {
        id: 'candles-heikin',
        label: 'Velas japonesas y Heikin Ashi',
        layout: CHARTS_LAYOUT,
        children: <ChartsSlide names={['Velas japonesas', 'Heikin Ashi']} />,
      },
      {
        id: 'renko-areas',
        label: 'Renko y gráfico de áreas',
        layout: CHARTS_LAYOUT,
        children: <ChartsSlide names={['Renko', 'Áreas']} />,
      },
    ],
  },
  {
    id: 'candles',
    label: 'Velas japonesas',
    icon: 'candles',
    slides: [
      {
        id: 'structure',
        label: 'Estructura de una vela japonesa',
        layout: 'grid w-full',
        children: (
          <HudItem lazy>
            <CandlestickStructure />
          </HudItem>
        ),
      },
      {
        id: 'bullish',
        label: 'Patrones que anuncian subida',
        layout: 'grid w-full gap-4 sm:grid-cols-3',
        children: <PatternsSlide category="bullish" />,
      },
      {
        id: 'bearish',
        label: 'Patrones que anuncian bajada',
        layout: 'grid w-full gap-4 sm:grid-cols-3',
        children: <PatternsSlide category="bearish" />,
      },
      {
        id: 'indecision',
        label: 'Patrones que anuncian indecisión',
        layout: 'grid w-full gap-4 sm:grid-cols-2',
        children: <PatternsSlide category="indecision" />,
      },
    ],
  },
  {
    id: 'indicators',
    label: 'Indicadores',
    icon: 'sliders',
    // `group` agrupa los puntos por familia: tendencias móviles (4), impulso (3), volatilidad (2) y estructura (2)
    slides: [
      { id: 'sma-ema', label: 'SMA y EMA', group: 0, layout: 'grid gap-4 md:grid-cols-2', children: <SmaEmaSlide /> },
      { id: 'other-averages', label: 'Otras medias móviles', group: 0, layout: STACK, children: <OtherAveragesSlide /> },
      { id: 'ma-diagram', label: 'Gráfico interactivo de las medias', group: 0, layout: STACK, children: <MovingAveragesSlide /> },
      { id: 'ichimoku', label: 'Nube de Ichimoku', group: 0, layout: STACK, children: <IchimokuSlide /> },
      ...MOMENTUM.map((indicator) => ({
        id: indicator.id,
        label: indicator.name,
        group: 1,
        layout: STACK,
        children: <IndicatorSlide category="momentum" indicator={indicator} />,
      })),
      ...VOLATILITY.map((indicator) => ({
        id: indicator.id,
        label: indicator.name,
        group: 2,
        layout: STACK,
        children: <IndicatorSlide category="volatility" indicator={indicator} />,
      })),
      ...STRUCTURE.map((indicator) => ({
        id: indicator.id,
        label: indicator.name,
        group: 3,
        layout: STACK,
        children: <IndicatorSlide category="structure" indicator={indicator} />,
      })),
    ],
  },
  {
    id: 'mistakes',
    label: 'Errores comunes',
    icon: 'alert',
    slides: [
      {
        id: 'mistakes',
        label: 'Errores comunes',
        layout: 'grid items-start gap-5 lg:grid-cols-3',
        children: <MistakesSlide />,
      },
    ],
  },
  {
    id: 'commandments',
    label: 'Los 12 mandamientos del trader',
    icon: 'scroll',
    slides: [
      {
        id: 'book',
        label: 'Los 12 mandamientos del trader',
        layout: 'grid w-full',
        children: (
          <HudItem lazy>
            <CommandmentsBook />
          </HudItem>
        ),
      },
    ],
  },
]

export const StocksHud: React.FC<{ header: React.ReactNode }> = ({ header }) => (
  <TopicHud header={header} topics={TOPICS} label="Temas del análisis de acciones" sidebarAction={<BackToAnalysisButton />} />
)