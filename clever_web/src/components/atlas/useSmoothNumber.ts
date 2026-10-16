import { useEffect, useRef, useState } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Devuelve un valor que se acerca suavemente a `target`.
 * Solo anima mientras hay diferencia: cuando converge, deja de usar requestAnimationFrame.
 */
export function useSmoothNumber(target: number, easing = 0.1, epsilon = 0.01): number {
  const [value, setValue] = useState(target)
  const current = useRef(target)

  useEffect(() => {
    if (prefersReducedMotion()) {
      current.current = target
      setValue(target)
      return
    }

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const diff = target - current.current
      if (Math.abs(diff) < epsilon) {
        current.current = target
        setValue(target)
        return
      }
      // el suavizado depende del tiempo (no del número de cuadros): igual que `easing` por cuadro a 60 fps,
      // pero llega al mismo valor en el mismo tiempo aunque el equipo dibuje pocos cuadros por segundo
      const dt = Math.min(0.25, (now - last) / 1000)
      last = now
      const k = 1 - Math.pow(1 - easing, dt * 60)
      current.current += diff * k
      setValue(current.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, easing, epsilon])

  return value
}