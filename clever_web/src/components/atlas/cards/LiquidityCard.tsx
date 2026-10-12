import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { cssVars, goodColor, lerp, liquidityLabel, wavePath } from '../atlasData'

/** Liquidez → agua (poca: superficie baja e inestable · mucha: profunda y estable) */
export const LiquidityCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const y = 8 + (1 - v / 100) * 84
  const unstable = (100 - v) / 100
  const amp = lerp(1.5, 6, unstable)
  const dur = lerp(5.5, 1.4, unstable)

  return (
    <AtlasCard
      title="Liquidez"
      tip="Qué tan fácil es comprar o vender sin mover mucho el precio. Aguas profundas y calmas indican alta liquidez."
      tint="rgba(45,212,191,0.10)"
    >
      <div className="flex flex-col gap-2">
        <svg viewBox="0 0 100 100" className="h-24 w-24 self-center" aria-hidden="true">
          <defs>
            <clipPath id="atlas-water-clip">
              <rect x="12" y="8" width="76" height="84" rx="12" />
            </clipPath>
            <linearGradient id="atlas-water-a" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="atlas-water-b" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0e7490" />
            </linearGradient>
          </defs>

          <rect x="12" y="8" width="76" height="84" rx="12" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <g clipPath="url(#atlas-water-clip)">
            <path
              d={wavePath(y, amp * 1.2, -80, 200, 110)}
              fill="url(#atlas-water-a)"
              opacity="0.6"
              className="atlas-wave"
              style={cssVars({ '--d': `${dur * 1.3}s` })}
            />
            <path
              d={wavePath(y + 1.5, amp, -80, 200, 110)}
              fill="url(#atlas-water-b)"
              opacity="0.92"
              className="atlas-wave"
              style={cssVars({ '--d': `${dur}s` })}
            />
          </g>
          <rect x="12" y="8" width="76" height="84" rx="12" fill="none" stroke="#0f172a" strokeOpacity="0.06" />
        </svg>

        <Readout value={Math.round(v)} suffix="/100" label={liquidityLabel(v)} labelColor={goodColor(v)} />
      </div>
    </AtlasCard>
  )
}