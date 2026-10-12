import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { clamp, cssVars, lerp, riskColor, volatilityLabel } from '../atlasData'

const DOTS = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2
  const r = 36 + (i % 3) * 8
  return {
    x: 66 + Math.cos(a) * r,
    y: 54 + Math.sin(a) * r * 0.6,
    dx: Math.cos(a) * 14,
    dy: -8 - (i % 4) * 3,
    delay: i * 0.17,
  }
})

/** Volatilidad → nube (pequeña y calmada … grande y turbulenta) */
export const VolatilityCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const t = v / 100
  const scale = 0.28 + 0.34 * t
  const wobble = lerp(4.2, 0.7, t)
  const turbulence = clamp((v - 55) / 35)

  return (
    <AtlasCard
      title="Volatilidad"
      tip="Una volatilidad alta significa que el precio puede cambiar rápidamente. Puedes guiarte usando las Bandas de Bollinger, mientras mas anchas sean mayor es la volatilidad."
      tint="rgba(129,140,248,0.12)"
    >
      <div className="flex items-center justify-between gap-3">
        <Readout value={Math.round(v)} suffix="/100" label={volatilityLabel(v)} labelColor={riskColor(v)} />

        <svg viewBox="0 0 132 96" className="h-24 w-[132px] shrink-0" aria-hidden="true">
          <defs>
            <linearGradient id="atlas-cloud" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b97e0" />
              <stop offset="100%" stopColor="#4a55a0" />
            </linearGradient>
          </defs>

          <ellipse cx="66" cy="86" rx={14 + 30 * t} ry="3" fill="#64748b" opacity="0.25" />

          <g transform={`translate(66 54) scale(${scale})`}>
            <g className="atlas-box atlas-wobble" style={cssVars({ '--d': `${wobble}s` })}>
              <g fill="url(#atlas-cloud)" stroke="#a5b1ec" strokeWidth="2">
                <ellipse cx="0" cy="10" rx="60" ry="26" />
                <ellipse cx="-38" cy="0" rx="34" ry="24" />
                <ellipse cx="34" cy="-2" rx="38" ry="26" />
                <ellipse cx="0" cy="-16" rx="30" ry="22" />
              </g>
            </g>
          </g>

          {/* turbulencia (partículas) */}
          <g opacity={turbulence} fill="#6366f1">
            {DOTS.map((d) => (
              <circle
                key={d.delay}
                cx={d.x}
                cy={d.y}
                r="1.7"
                className="atlas-drift"
                style={{
                  ...cssVars({ '--d': `${lerp(1.8, 0.8, t)}s`, '--dx': `${d.dx}px`, '--dy': `${d.dy}px` }),
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}
          </g>
        </svg>
      </div>
    </AtlasCard>
  )
}