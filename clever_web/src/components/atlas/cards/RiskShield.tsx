import React from 'react'
import { clamp, lerp, riskColor } from '../atlasData'
import { animVars } from '../animVars'
import { ink, tint } from '../scenes/SceneFrame'

const CRACKS = [
  { d: 'M100 60 L95 90 L108 100 L98 140', at: 25, w: 2.2 },
  { d: 'M75 70 L90 95 L70 120', at: 45, w: 1.8 },
  { d: 'M125 75 L112 100 L130 125', at: 65, w: 1.8 },
  { d: 'M100 60 L118 80', at: 85, w: 1.5 },
]
const SHIELD = 'M100 25 L155 45 V100 C155 135 130 160 100 175 C70 160 45 135 45 100 V45 Z'

export const RiskShield: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const color = riskColor(value)
  const line = ink(color)
  const alarm = clamp((value - 60) / 40)

  return (
    <svg viewBox="30 14 140 176" className={className} aria-hidden="true">
      {alarm > 0.05 && (
        <path
          d={SHIELD}
          fill="none"
          stroke={line}
          strokeWidth="2"
          opacity={alarm * 0.7}
          className="sc-ring sc-fb sc-oc"
          style={animVars({ '--d': `${lerp(3.4, 2.2, alarm)}s` })}
        />
      )}
      <path d={SHIELD} fill={tint(color, 14)} stroke={line} strokeWidth="3.2" strokeLinejoin="round" />
      <path d={SHIELD} fill="none" stroke="var(--ax-line)" strokeWidth="1.4" transform="translate(100 100) scale(.84) translate(-100 -100)" />
      <text x="100" y="114" textAnchor="middle" fontSize="44" fontWeight="700" fill={ink(color, 62)} opacity="0.85">
        ₿
      </text>
      {CRACKS.map((c) => {
        const progress = clamp((value - c.at) / 20)
        return (
          <path
            key={c.d}
            d={c.d}
            pathLength={100}
            fill="none"
            stroke={line}
            strokeWidth={c.w}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - progress)}
            opacity={progress}
          />
        )
      })}
    </svg>
  )
}
