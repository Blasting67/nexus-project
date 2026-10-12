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
    const tick = () => {
      const diff = target - current.current
      if (Math.abs(diff) < epsilon) {
        current.current = target
        setValue(target)
        return
      }
      current.current += diff * easing
      setValue(current.current)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, easing, epsilon])

  return value
}
