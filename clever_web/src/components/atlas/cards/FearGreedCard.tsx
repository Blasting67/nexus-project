import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { fearGreedLabel, sampleColor } from '../atlasData'

const STOPS: Array<[number, string]> = [
  [0, '#2563eb'],
  [30, '#0891b2'],
  [50, '#d97706'],
  [75, '#ea580c'],
  [100, '#dc2626'],
]
const ZONES = ['#2563eb', '#0891b2', '#d97706', '#ea580c', '#dc2626']

/** Fear & Greed → termómetro (el mercurio sube y cambia de color) */
export const FearGreedCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const color = sampleColor(STOPS, v)
  const top = 96 - (v / 100) * 84
  const zone = Math.min(4, Math.floor(v / 20))

  return (
    <AtlasCard
      title="Miedo & Codicia"
      tip="Resume si el mercado actúa cauteloso o con codicia. Puedes usar indicadores de volatilidad y momentum para análisis propio."
      tint="rgba(251,146,60,0.10)"
    >
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 56 120" className="h-28 w-auto shrink-0" aria-hidden="true">
          <rect x="20" y="6" width="16" height="92" rx="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx="28" cy="102" r="14" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

          <g style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
            <rect x="24" y={top} width="8" height={102 - top} rx="4" fill={color} />
            <circle cx="28" cy="102" r="10" fill={color} />
          </g>

          <g stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round">
            {[12, 33, 54, 75, 96].map((y) => (
              <line key={y} x1="41" y1={y} x2="47" y2={y} />
            ))}
          </g>
        </svg>

        <div className="min-w-0 flex-1">
          <Readout value={Math.round(v)} suffix="/100" label={fearGreedLabel(v)} labelColor={color} />

          <div className="mt-3 flex gap-1" aria-hidden="true">
            {ZONES.map((c, i) => (
              <span
                key={c}
                className="h-1.5 flex-1 rounded-full transition-opacity duration-300"
                style={{ background: c, opacity: i === zone ? 1 : 0.22 }}
              />
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-slate-500">
            <span>Miedo</span>
            <span>Codicia</span>
          </div>
        </div>
      </div>
    </AtlasCard>
  )
}