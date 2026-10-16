import type { CSSProperties } from 'react'

/**
 * Variables CSS para las animaciones de las escenas (--d, --h, --dx, --s…), cuantizadas.
 * Los valores que se están animando (p. ej. el que viene de un preset) cambian en cada cuadro; si las duraciones de las
 * ~180 animaciones cambiaran con ellos, el navegador recalcularía su tiempo en cada cuadro y las vería saltar.
 * Redondeando por escalones, solo cambian cuando cruzan un escalón.
 */
export function animVars(vars: Record<string, string | number>): CSSProperties {
  const out: Record<string, string | number> = {}
  for (const [key, value] of Object.entries(vars)) {
    if (typeof value === 'number') {
      out[key] = key === '--s' ? Math.round(value / 0.05) * 0.05 : value
      continue
    }
    const m = /^(-?\d*\.?\d+)(s|px)$/.exec(value)
    if (!m) {
      out[key] = value
      continue
    }
    const n = parseFloat(m[1])
    if (m[2] === 's') out[key] = `${Math.max(0.25, Math.round(n / 0.25) * 0.25)}s` // duraciones: escalones de 0,25 s
    else out[key] = `${Math.round(n / 4) * 4}px` // distancias: escalones de 4 px
  }
  return out as unknown as CSSProperties
}
