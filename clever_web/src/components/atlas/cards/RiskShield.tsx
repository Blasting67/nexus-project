import React from 'react'
import { clamp } from '../atlasData'

const CRACKS = [
  { d: 'M100 60 L95 90 L108 100 L98 140', at: 25, w: 2.4 },
  { d: 'M75 70 L90 95 L70 120', at: 45, w: 1.9 },
  { d: 'M125 75 L112 100 L130 125', at: 65, w: 1.9 },
  { d: 'M100 60 L118 80', at: 85, w: 1.6 },
]

/**
 * Escudo de riesgo: sólido con riesgo bajo, grietas progresivas y leve vibración con riesgo alto.
 * `value` ya debe venir suavizado (lo hace PressureCard).
 */
export const RiskShield: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const danger = clamp((value - 55) / 45)

  return (
    <svg viewBox="40 20 120 160" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="atlas-shield" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#334278" />
          <stop offset="100%" stopColor="#151c30" />
        </linearGradient>
        <radialGradient id="atlas-shield-sheen" cx="35%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className={value > 70 ? 'atlas-shake' : ''}>
        <path
          d="M100 25 L155 45 V100 C155 135 130 160 100 175 C70 160 45 135 45 100 V45 Z"
          fill="url(#atlas-shield)"
          stroke="#64748b"
          strokeWidth="3"
          style={{ filter: `drop-shadow(0 0 ${danger * 14}px rgba(248,113,113,${danger * 0.6}))` }}
        />
        <path
          d="M100 25 L155 45 V100 C155 135 130 160 100 175 C70 160 45 135 45 100 V45 Z"
          fill="url(#atlas-shield-sheen)"
        />
        {CRACKS.map((c) => {
          const progress = clamp((value - c.at) / 20)
          return (
            <path
              key={c.d}
              d={c.d}
              pathLength={100}
              fill="none"
              stroke="#f87171"
              strokeWidth={c.w}
              strokeLinecap="round"
              strokeDasharray={100}
              strokeDashoffset={100 * (1 - progress)}
              opacity={progress}
              style={{ filter: 'drop-shadow(0 0 4px rgba(248,113,113,.8))' }}
            />
          )
        })}
      </g>
    </svg>
  )
}
