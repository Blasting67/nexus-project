import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnalysisOptionCard } from '../components/analysis/AnalysisOptionCard'
import { ANALYSIS_OPTIONS } from '../components/analysis/AnalysisOptions'
import { requestedSectionIndex } from '../components/analysis/analysisRoute'
import { ConceptsCard } from '../components/hud/cards/ConceptsCard'
import { MarketsCard } from '../components/hud/cards/MarketsCard'
import { OperationTypesCard } from '../components/hud/cards/OperationTypesCard'
import { TradingIntroCard } from '../components/hud/cards/TradingIntroCard'
import { TraderTypesCard } from '../components/hud/cards/TraderTypesCard'
import { HudBackdrop } from '../components/hud/HudBackdrop'
import { HudItem, HudSlide } from '../components/hud/HudSlide'
import type { SlideState } from '../components/hud/HudSlide'
import { HudSidebar } from '../components/hud/HudSidebar'
import type { HudSection } from '../components/hud/HudSidebar'
import { HudStyles } from '../components/hud/HudStyles'
import { useFitHeight, useMediaQuery, useSectionPager, useViewportBreakout } from '../components/hud/hudHooks'

const SECTIONS: HudSection[] = [
  { id: 'intro', label: 'Introducción', icon: 'book' },
  { id: 'concepts', label: 'Conceptos básicos', icon: 'bulb' },
  { id: 'analysis', label: 'Análisis', icon: 'chart' },
]

/**
 * Análisis Técnico.
 * El título y la descripción permanecen fijos; lo que cambia es el HUD de tarjetas, que se navega
 * con los botones del panel izquierdo, la rueda del mouse o las flechas del teclado.
 */
export const AnalysisPage: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  // en pantallas anchas la página ocupa todo el ancho de la ventana; el contenido conserva su ancho de siempre
  const naturalWidth = useViewportBreakout(rootRef, isDesktop)
  const stageHeight = useFitHeight(stageRef, isDesktop)
  // si se llega desde "Volver a Análisis" (criptos o acciones), arranca en la sección "Análisis"
  const location = useLocation()
  const { index, goTo, next, prev } = useSectionPager({
    initialIndex: requestedSectionIndex(location.state, SECTIONS.map((s) => s.id)),
    count: SECTIONS.length,
    wheelEnabled: isDesktop,
    stageRef,
  })

  // la primera sección también entra con animación
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const stateOf = (i: number): SlideState => (!ready ? 'below' : i === index ? 'active' : i < index ? 'above' : 'below')
  const slide = (i: number) => ({
    id: `hud-panel-${SECTIONS[i].id}`,
    tabId: `hud-tab-${SECTIONS[i].id}`,
    state: stateOf(i),
  })

  return (
    <div
      ref={rootRef}
      style={naturalWidth ? ({ '--hud-w': `calc(${naturalWidth}px - 16.5rem)` } as React.CSSProperties) : undefined}
      className="relative isolate mx-auto w-full max-w-7xl py-4"
    >
      <HudStyles />
      <HudBackdrop />

      {/* Cabecera fija */}
      <div className="grid gap-x-6 gap-y-5 lg:grid-cols-[minmax(15rem,1fr)_minmax(0,var(--hud-w,63.5rem))_1fr] lg:gap-y-6 lg:px-6">
      <header className="flex flex-wrap items-start justify-between gap-4 lg:col-start-2 lg:row-start-1">
        <div>
          <p className="mb-2 flex items-center gap-3 text-sm text-slate-500">
            <span aria-hidden="true" className="h-5 w-0.5 rounded-full bg-sky-500" />
            <span key={SECTIONS[index].label} className="hud-label-in inline-block">
              {SECTIONS[index].label}
            </span>
          </p>
          <h1 className="bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Análisis Técnico
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Guía práctica para la interpretación de gráficos de precios y estructuras de mercado.
          </p>
        </div>

        <Link
          to="/exchange"
          className="platform-btn-secondary self-start px-3 py-1.5 text-xs transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          Ver gráficos en vivo
        </Link>
      </header>

      <p aria-live="polite" className="sr-only">
        Sección {index + 1} de {SECTIONS.length}: {SECTIONS[index].label}
      </p>

        {/* panel de navegación: pegado al borde izquierdo de la página, a la altura del título */}
        <HudSidebar
          sections={SECTIONS}
          index={index}
          onSelect={goTo}
          onPrev={prev}
          onNext={next}
          className="lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start lg:pt-7"
        />

        {/* HUD: en pantallas anchas ocupa exactamente lo que queda de la pantalla */}
        <div
          ref={stageRef}
          style={isDesktop ? { height: stageHeight ?? 'calc(100vh - 20rem)' } : undefined}
          className="relative grid overflow-hidden rounded-[2rem] lg:col-start-2 lg:row-start-2"
        >
          {/* 1. Introducción */}
          <HudSlide {...slide(0)} className="grid gap-4 lg:grid-rows-2">
            <HudItem order={0}>
              <TradingIntroCard />
            </HudItem>
            <HudItem order={1}>
              <OperationTypesCard />
            </HudItem>
          </HudSlide>

          {/* 2. Conceptos básicos */}
          <HudSlide {...slide(1)} className="grid gap-4 lg:grid-cols-2">
            <HudItem order={0}>
              <ConceptsCard />
            </HudItem>
            <HudItem order={1}>
              <MarketsCard />
            </HudItem>
          </HudSlide>

          {/* 3. Análisis */}
          <HudSlide {...slide(2)} className="grid gap-4 lg:grid-rows-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <HudItem order={0}>
              <TraderTypesCard />
            </HudItem>
            <div className="grid min-h-0 gap-4 lg:grid-cols-2">
              {ANALYSIS_OPTIONS.map(({ kind, path, ...option }, i) => (
                <HudItem key={kind} order={i + 1}>
                  <AnalysisOptionCard {...option} to={path} compact reveal={false} />
                </HudItem>
              ))}
            </div>
          </HudSlide>
        </div>
      </div>
    </div>
  )
}