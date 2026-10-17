import { useEffect, useState } from 'react'

/** Cuenta de 0 al valor final con una desaceleración suave. `delay` (ms) espera antes de empezar. */
export function useCountUp(target: number, duration = 1400, delay = 0): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    let timer = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        setValue(target * (1 - Math.pow(1 - t, 3)))
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    if (delay > 0) timer = window.setTimeout(run, delay)
    else run()
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [target, duration, delay])

  return value
}