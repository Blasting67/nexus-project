import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, trendLabel } from '../atlasData'

const TICKS = Array.from({ length: 12 }, (_, i) => (i / 12) * 360)

/** Tendencia → brújula (la aguja sube con el mercado alcista y baja con el bajista) */
export const TrendCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const angle = -((v - 50) / 50) * 65

  return (
    <AtlasCard
      title="Tendencia"
      tip="Muestra hacia dónde apunta el mercado: hacia abajo (bajista), estable (neutral) o hacia arriba (alcista). Indicadores mas usadod: SMA, EMA, MACD y ADX."
      tint="rgba(74,222,128,0.10)"
    >
      <div className="flex items-center justify-between gap-3">
        <Readout value={Math.round(v)} suffix="/100" label={trendLabel(v)} labelColor={goodColor(v)} />

        <svg viewBox="0 0 96 96" className="h-24 w-24 shrink-0" aria-hidden="true">
          <defs>
            <linearGradient id="atlas-compass-ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <radialGradient id="atlas-compass-face" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </radialGradient>
          </defs>

          <circle cx="48" cy="48" r="44" fill="url(#atlas-compass-face)" stroke="url(#atlas-compass-ring)" strokeWidth="3" />

          <g stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round">
            {TICKS.map((a) => (
              <line key={a} x1="48" y1="9" x2="48" y2={a % 90 === 0 ? 15 : 12} transform={`rotate(${a} 48 48)`} />
            ))}
          </g>

          {/* extremos: alcista (arriba) / bajista (abajo) */}
          <circle cx="64" cy="14" r="2.6" fill="#16a34a" />
          <circle cx="64" cy="82" r="2.6" fill="#dc2626" />

          <g transform={`rotate(${angle} 48 48)`} style={{ filter: 'drop-shadow(0 0 3px rgba(217,119,6,.45))' }}>
            <polygon points="48,44.5 80,48 48,51.5" fill="#d97706" />
            <polygon points="48,44.5 22,48 48,51.5" fill="#94a3b8" />
          </g>
          <circle cx="48" cy="48" r="4.5" fill="#fbbf24" stroke="#92400e" strokeWidth="1" />
        </svg>
      </div>
    </AtlasCard>
  )
}