import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { cssVars, goodColor, lerp, momentumLabel } from '../atlasData'

/** Momentum → cohete (casi detenido … ascendiendo rápido) */
export const MomentumCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const t = v / 100
  const flame = 0.45 + t * 1.15
  const tilt = lerp(7, -7, t)

  return (
    <AtlasCard
      title="Momentum"
      tip="Mide la fuerza con la que se mueve el precio. Los indicadores mas usados son RSI y MACD."
      tint="rgba(251,146,60,0.10)"
    >
      <div className="flex flex-col gap-2">
        <svg viewBox="0 0 100 100" className="h-24 w-24 self-center" aria-hidden="true">
          <defs>
            <linearGradient id="atlas-rocket-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="atlas-rocket-flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff3c9" />
              <stop offset="55%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>

          {/* estela: más rápida y visible con más momentum */}
          <g stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" opacity={0.2 + 0.6 * t}>
            {[14, 24, 76, 86].map((x, i) => (
              <line
                key={x}
                x1={x}
                y1={8 + (i % 2) * 8}
                x2={x}
                y2={92}
                strokeDasharray="6 6"
                className="atlas-trail"
                style={cssVars({ '--d': `${lerp(1.6, 0.35, t)}s` })}
              />
            ))}
          </g>

          <g transform={`translate(50 46) rotate(${tilt})`}>
            <g className="atlas-bob" style={cssVars({ '--d': `${lerp(3.2, 1.2, t)}s` })}>
              <g transform="scale(0.8)">
                <path
                  d="M0 -40 C14 -30 14 0 8 18 L-8 18 C-14 0 -14 -30 0 -40 Z"
                  fill="url(#atlas-rocket-body)"
                  stroke="#64748b"
                  strokeWidth="1"
                />
                <circle cx="0" cy="-18" r="5" fill="#2dd4bf" style={{ filter: 'drop-shadow(0 0 4px rgba(45,212,191,.8))' }} />
                <path d="M-8 8 L-20 22 L-8 20 Z" fill="#fbbf24" />
                <path d="M8 8 L20 22 L8 20 Z" fill="#fbbf24" />
                <g
                  style={{
                    transform: `scaleY(${flame})`,
                    transformOrigin: '50% 0%',
                    transformBox: 'fill-box',
                    filter: 'drop-shadow(0 0 6px rgba(251,191,36,.7))',
                  }}
                >
                  <path d="M-6 18 L0 45 L6 18 Z" fill="url(#atlas-rocket-flame)" />
                </g>
              </g>
            </g>
          </g>
        </svg>

        <Readout value={Math.round(v)} suffix="/100" label={momentumLabel(v)} labelColor={goodColor(v)} />
      </div>
    </AtlasCard>
  )
}