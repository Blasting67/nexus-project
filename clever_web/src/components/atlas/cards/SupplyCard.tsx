import React from 'react'
import { AtlasCard } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { MAX_SUPPLY, clamp, cssVars, wavePath } from '../atlasData'

const BUBBLES = [
  { x: 46, r: 2, d: 0, dur: 3.2 },
  { x: 62, r: 1.6, d: 1.1, dur: 2.8 },
  { x: 78, r: 2.3, d: 0.5, dur: 3.6 },
  { x: 92, r: 1.8, d: 1.7, dur: 3 },
  { x: 56, r: 1.5, d: 2.2, dur: 3.4 },
]

/** Suministro → tanque que se llena (emitido / máximo) */
export const SupplyCard: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const s = useSmoothNumber(value, 0.12)
  const pct = clamp(s / MAX_SUPPLY)
  const top = 14 + 130 * (1 - pct)

  return (
    <AtlasCard
      title="Suministro"
      tip="Cuántos bitcoins existen ya respecto al máximo que jamás podrá existir: 21 millones."
      tint="rgba(251,191,36,0.12)"
      className={className}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <svg viewBox="0 0 140 160" className="h-44 w-auto" aria-hidden="true">
          <defs>
            <clipPath id="atlas-tank-clip">
              <rect x="30" y="10" width="80" height="134" rx="16" />
            </clipPath>
            <linearGradient id="atlas-tank-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fcd34d" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <radialGradient id="atlas-supply-coin" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>
          </defs>

          <rect x="30" y="10" width="80" height="134" rx="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />

          <g clipPath="url(#atlas-tank-clip)">
            <path
              d={wavePath(top, 2.2, -80, 220, 160)}
              fill="url(#atlas-tank-fill)"
              opacity="0.9"
              className="atlas-wave"
              style={cssVars({ '--d': '4s' })}
            />
            {pct > 0.04 &&
              BUBBLES.map((b) => (
                <circle
                  key={b.x}
                  cx={b.x}
                  cy={136}
                  r={b.r}
                  fill="#fef3c7"
                  className="atlas-rise"
                  style={{ ...cssVars({ '--d': `${b.dur}s` }), animationDelay: `${b.d}s` }}
                />
              ))}
          </g>

          <rect x="30" y="10" width="80" height="134" rx="16" fill="none" stroke="#0f172a" strokeOpacity="0.06" />

          {/* moneda con anillo giratorio */}
          <g transform="translate(70 78)">
            <circle
              r="31"
              fill="none"
              stroke="#fbbf24"
              strokeOpacity="0.5"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              className="atlas-box atlas-spin"
            />
            <g className="atlas-bob" style={cssVars({ '--d': '3.5s' })}>
              <g style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,.75))' }}>
                <circle r="21" fill="url(#atlas-supply-coin)" stroke="#78350f" strokeWidth="1.5" />
                <circle r="16.5" fill="none" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.2" />
                <text y="8.5" textAnchor="middle" fontSize="24" fontWeight="700" fill="#451a03">
                  ₿
                </text>
              </g>
            </g>
          </g>
        </svg>

        <div className="text-center">
          <div className="text-xl font-semibold tabular-nums text-slate-900">
            {s.toFixed(1)}M{' '}
            <span className="text-sm font-normal text-slate-500">/ {MAX_SUPPLY}M BTC</span>
          </div>
          <div className="text-sm font-medium text-amber-600">{(pct * 100).toFixed(1)}% emitido</div>
        </div>
      </div>
    </AtlasCard>
  )
}