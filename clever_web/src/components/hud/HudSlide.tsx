import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

/**
 * Estado de cada sección respecto a la que se está viendo:
 *  - 'active': la visible
 *  - 'above' : ya pasó (sus tarjetas salieron hacia arriba)
 *  - 'below' : falta por ver (sus tarjetas esperan abajo y subirán)
 *  - 'left'  : subtema ya visto dentro del mismo tema (sale hacia la izquierda)
 *  - 'right' : subtema por ver dentro del mismo tema (espera a la derecha)
 */
export type SlideState = 'active' | 'above' | 'below' | 'left' | 'right'

const SlideContext = createContext<SlideState>('active')

/** Para que las tarjetas sepan si su sección está visible (animaciones internas, temporizadores). */
export const useSlideState = () => useContext(SlideContext)

/** true cuando la sección ya se vio (con un pequeño retraso para que se aprecie su animación de entrada). */
export function useSlideShown(delayMs = 300): boolean {
  const active = useSlideState() === 'active'
  const [shown, setShown] = useState(false)
  useEffect(() => {
    if (!active || shown) return
    const id = window.setTimeout(() => setShown(true), delayMs)
    return () => window.clearTimeout(id)
  }, [active, shown, delayMs])
  return shown
}

/** Posición de las tarjetas según el estado de su sección. */
const ITEM_POSE: Record<SlideState, string> = {
  active: 'translate-y-0 scale-100 opacity-100',
  above: '-translate-y-[var(--hud-travel,40vh)] scale-[0.96] opacity-0',
  below: 'translate-y-[var(--hud-travel,40vh)] scale-[0.96] opacity-0',
  left: '-translate-x-[var(--hud-travel-x,40vw)] scale-[0.96] opacity-0',
  right: 'translate-x-[var(--hud-travel-x,40vw)] scale-[0.96] opacity-0',
}

interface HudSlideProps {
  id: string
  tabId: string
  state: SlideState
  /** distribución de las tarjetas dentro de la sección (clases de grid) */
  className?: string
  /** relleno de la sección (clases de Tailwind) */
  padding?: string
  /** en pantallas pequeñas, las secciones que no se ven dejan de ocupar espacio */
  collapseInactive?: boolean
  children: React.ReactNode
}

/** Una sección del HUD. Las inactivas quedan ocultas (sin foco ni lector de pantalla) cuando termina su salida. */
export const HudSlide: React.FC<HudSlideProps> = ({
  id,
  tabId,
  state,
  className = '',
  padding = 'p-2',
  collapseInactive = false,
  children,
}) => {
  const active = state === 'active'
  return (
    <div
      id={id}
      role="tabpanel"
      aria-labelledby={tabId}
      aria-hidden={!active}
      data-state={state}
      style={{
        transitionProperty: collapseInactive ? 'visibility, max-height' : 'visibility',
        transitionDuration: '0s',
        transitionDelay: active ? '0s' : '1s',
      }}
      className={`${padding} [grid-area:1/1] lg:absolute lg:inset-0 ${
        active ? 'visible' : 'pointer-events-none invisible'
      } ${
        collapseInactive
          ? active
            ? 'max-h-[99999px]'
            : 'max-h-0 overflow-hidden lg:max-h-none lg:overflow-visible'
          : ''
      } ${className}`}
    >
      <SlideContext.Provider value={state}>{children}</SlideContext.Provider>
    </div>
  )
}

interface HudItemProps {
  /** orden de llegada: las tarjetas entran escalonadas */
  order?: number
  /** monta el contenido hasta que su sección se ve por primera vez (así sus animaciones de entrada se ven) */
  lazy?: boolean
  className?: string
  children: React.ReactNode
}

/** Envoltorio de una tarjeta: sube desde abajo al entrar y sale hacia arriba al irse (o al revés si se regresa). */
export const HudItem: React.FC<HudItemProps> = ({ order = 0, lazy = false, className = '', children }) => {
  const state = useSlideState()
  const active = state === 'active'
  const seen = useRef(false)
  if (active) seen.current = true

  return (
    <div
      style={{
        transitionProperty: 'transform, opacity',
        transitionDuration: '950ms, 650ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: active ? `${140 + order * 140}ms` : `${order * 60}ms`,
      }}
      className={`min-h-0 will-change-transform motion-reduce:!transition-none ${ITEM_POSE[state]} ${className}`}
    >
      {lazy && !seen.current ? null : children}
    </div>
  )
}