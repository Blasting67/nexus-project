import React, { useEffect, useRef, useState } from 'react'
import { HudDock } from './HudDock'
import { HudFit } from './HudFit'
import { HudSlide } from './HudSlide'
import type { SlideState } from './HudSlide'
import { HudStyles } from './HudStyles'
import { useFitHeight, useMediaQuery, useSectionPager } from './hudHooks'

export interface DockSection {
  id: string
  /** título que muestra el botón cuando la sección está seleccionada */
  label: string
  /** clases de la cuadrícula con las tarjetas (por defecto, dos columnas iguales) */
  layout?: string
  /** escala mínima al ajustar a la pantalla (por defecto 0.5) */
  minScale?: number
  /** las tarjetas, cada una dentro de un <HudItem> */
  children: React.ReactNode
}

interface DockedHudProps {
  sections: DockSection[]
  /** nombre accesible del conjunto de secciones */
  label: string
}

const DEFAULT_LAYOUT = 'grid gap-5 lg:grid-cols-2'

/** Espacio bajo el HUD: separación (16) + barra (56). */
const DOCK_BLOCK = 72

/**
 * HUD con barra de secciones debajo.
 * Cambia de sección con los botones, la rueda del mouse o las flechas del teclado.
 * Las tarjetas nuevas suben desde abajo y las anteriores salen hacia arriba.
 */
export const DockedHud: React.FC<DockedHudProps> = ({ sections, label }) => {
  const stageRef = useRef<HTMLDivElement>(null)
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const stageHeight = useFitHeight(stageRef, isDesktop, 360, 28 + DOCK_BLOCK)
  const { index, goTo, next, prev } = useSectionPager({
    count: sections.length,
    wheelEnabled: isDesktop,
    stageRef,
    keys: 'both',
  })

  // la primera sección también entra con animación
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const stateOf = (i: number): SlideState => (!ready ? 'below' : i === index ? 'active' : i < index ? 'above' : 'below')

  return (
    <div className="relative">
      <HudStyles />

      <p aria-live="polite" className="sr-only">
        Sección {index + 1} de {sections.length}: {sections[index].label}
      </p>

      {/* en pantallas anchas ocupa exactamente lo que queda de la pantalla */}
      <div
        ref={stageRef}
        style={
          {
            '--hud-travel': '100vh',
            ...(isDesktop ? { height: stageHeight ?? 'calc(100vh - 20rem)' } : {}),
          } as React.CSSProperties
        }
        className="relative grid overflow-hidden lg:-mx-4"
      >
        {sections.map((s, i) => (
          <HudSlide
            key={s.id}
            id={`hud-panel-${s.id}`}
            tabId={`hud-tab-${s.id}`}
            state={stateOf(i)}
            padding="px-0 py-2 lg:px-4"
            collapseInactive
          >
            <HudFit enabled={isDesktop} minScale={s.minScale} className={s.layout ?? DEFAULT_LAYOUT}>
              {s.children}
            </HudFit>
          </HudSlide>
        ))}
      </div>

      <HudDock sections={sections} index={index} onSelect={goTo} onPrev={prev} onNext={next} label={label} />
    </div>
  )
}
