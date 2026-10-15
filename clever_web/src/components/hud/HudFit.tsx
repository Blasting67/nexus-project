import React, { useLayoutEffect, useRef, useState } from 'react'

interface HudFitProps {
  /** false = sin ajuste (pantallas pequeñas: la sección crece con su contenido) */
  enabled: boolean
  /** escala mínima; si aun así no cabe, la sección se desplaza por dentro */
  minScale?: number
  /** clases de la cuadrícula que contiene las tarjetas */
  className?: string
  children: React.ReactNode
}

/** Holgura (px) que se tolera antes de reducir: es el relleno vertical de la sección (8 px arriba y 8 px abajo). */
const SLACK = 16

interface FitState {
  scale: number
  top: number
  scroll: boolean
}

/**
 * Ajusta el contenido de una sección a la altura disponible.
 * - Si cabe, queda a su tamaño original, centrado verticalmente.
 * - Si no cabe, se reduce de forma uniforme (mismo diseño, solo más pequeño) y queda centrado.
 * - Si ni con la escala mínima cabe, la sección se desplaza por dentro.
 * El ancho de diseño no cambia: la reducción es una miniatura fiel, no un nuevo diseño.
 */
export const HudFit: React.FC<HudFitProps> = ({ enabled, minScale = 0.5, className = '', children }) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<FitState>({ scale: 1, top: 0, scroll: false })

  useLayoutEffect(() => {
    const box = boxRef.current
    const inner = innerRef.current
    if (!enabled || !box || !inner) {
      setFit((f) => (f.scale === 1 && f.top === 0 && !f.scroll ? f : { scale: 1, top: 0, scroll: false }))
      return
    }

    const measure = () => {
      const H = box.clientHeight
      const h = inner.offsetHeight // alto de diseño: no cambia con la escala
      if (!H) return
      const scale = h <= H + SLACK ? 1 : Math.max(minScale, Math.min(1, H / h))
      const shown = h * scale
      const scroll = shown > H + SLACK
      // dentro de la holgura el contenido queda centrado (puede invadir un poco el relleno); si hay que desplazar, arranca arriba
      const top = scroll ? 0 : Math.round((H - shown) / 2)
      setFit((f) =>
        Math.abs(f.scale - scale) < 0.002 && f.top === top && f.scroll === scroll ? f : { scale, top, scroll },
      )
    }

    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(box)
    ro.observe(inner)
    return () => ro.disconnect()
  }, [enabled, minScale])

  return (
    <div
      ref={boxRef}
      className={`relative h-full w-full ${
        enabled && fit.scroll ? 'overflow-y-auto overscroll-contain [scrollbar-width:thin]' : ''
      }`}
    >
      <div
        ref={innerRef}
        className={`${enabled ? 'absolute inset-x-0' : ''} ${className}`}
        style={
          enabled
            ? {
                top: fit.top,
                transformOrigin: 'top center',
                transform: fit.scale < 1 ? `scale(${fit.scale})` : undefined,
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  )
}
