import React from 'react'
import { lerp } from '../atlasData'
import { animVars } from '../animVars'

const STARS = [
  { x: 12, d: 0, k: 1 }, { x: 30, d: -1.2, k: 0.7 }, { x: 46, d: -2.4, k: 1.2 }, { x: 62, d: -0.6, k: 0.8 },
  { x: 100, d: -1.8, k: 1 }, { x: 118, d: -3, k: 0.7 }, { x: 134, d: -0.9, k: 1.25 }, { x: 152, d: -2.1, k: 0.85 },
  { x: 20, d: -3.3, k: 0.9 }, { x: 70, d: -2.7, k: 1.1 }, { x: 92, d: -0.3, k: 0.75 }, { x: 146, d: -3.6, k: 1 },
]
const SMOKE = [0, 0.4, 0.8, 1.2]

/** Momentum → cohete: más impulso = llama más larga, estrellas que pasan más rápido y estela. */
export const RocketScene: React.FC<{ value: number }> = ({ value }) => {
  const t = value / 100
  const flameLen = 14 + 36 * t
  const tilt = lerp(7, -6, t)
  const starDur = lerp(7.5, 1.15, t)
  const streak = lerp(1.4, 16, t * t)

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="rk-space" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="60%" stopColor="#3b1d8a" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id="rk-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="45%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="rk-flame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7d1" />
          <stop offset="45%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="rk-planet" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </radialGradient>
        <radialGradient id="rk-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="168" height="185" fill="url(#rk-space)" />

      {/* planeta y luna */}
      <circle cx="20" cy="156" r="40" fill="url(#rk-planet)" opacity="0.9" />
      <ellipse cx="20" cy="150" rx="58" ry="9" fill="none" stroke="#f5d0fe" strokeOpacity="0.5" strokeWidth="2" transform="rotate(-14 20 150)" />
      <g className="atlas-bob" style={animVars({ '--d': '6s' })}>
        <circle cx="142" cy="54" r="10" fill="#e2e8f0" />
        <circle cx="139" cy="51" r="2.4" fill="#cbd5e1" />
        <circle cx="146" cy="58" r="1.8" fill="#cbd5e1" />
      </g>

      {/* estrellas que pasan: más rápidas y largas con más momentum */}
      <g stroke="#fff" strokeLinecap="round">
        {STARS.map((s) => (
          <line
            key={s.x + '-' + s.d}
            x1={s.x}
            y1={0}
            x2={s.x}
            y2={streak * s.k}
            strokeWidth={1.1 + 0.5 * s.k}
            className="sc-star"
            style={{ ...animVars({ '--d': `${starDur * (0.75 + s.k * 0.3)}s` }), animationDelay: `${s.d}s` }}
          />
        ))}
      </g>

      {/* cohete */}
      <g transform={`translate(84 74) rotate(${tilt}) scale(1.12)`}>
        <g className="atlas-bob" style={animVars({ '--d': `${lerp(3.2, 1.1, t)}s` })}>
          {/* humo y llama */}
          <g transform="translate(0 28)">
            {SMOKE.map((d) => (
              <circle key={d} cx={(d - 0.6) * 5} cy="12" r="5" fill="#e9d5ff" className="sc-smoke sc-fb sc-oc" style={{ ...animVars({ '--d': `${lerp(2, 0.9, t)}s` }), animationDelay: `${d}s` }} />
            ))}
            <ellipse cx="0" cy={flameLen * 0.45} rx={12 + 6 * t} ry={flameLen * 0.7} fill="url(#rk-glow)" />
            <path d={`M-8 0 Q0 ${flameLen * 1.2} 8 0 Z`} fill="url(#rk-flame)" className="sc-flicker sc-fb sc-ot" />
            <path d={`M-4.5 0 Q0 ${flameLen * 0.72} 4.5 0 Z`} fill="#fffbe6" opacity="0.9" className="sc-flicker sc-fb sc-ot" style={{ animationDelay: '-.07s' }} />
          </g>

          {/* aletas */}
          <path d="M-10 6 L-24 28 L-10 22 Z" fill="#ef4444" />
          <path d="M10 6 L24 28 L10 22 Z" fill="#ef4444" />
          {/* cuerpo */}
          <path d="M0 -38 C15 -28 15 8 10 26 L-10 26 C-15 8 -15 -28 0 -38 Z" fill="url(#rk-body)" stroke="#94a3b8" strokeWidth="0.8" />
          <path d="M0 -38 C7 -34 11 -28 12 -22 L-12 -22 C-11 -28 -7 -34 0 -38 Z" fill="#ef4444" />
          <rect x="-8" y="26" width="16" height="4" rx="1.5" fill="#475569" />
          {/* ventana */}
          <circle cx="0" cy="-8" r="7.5" fill="#e2e8f0" />
          <circle cx="0" cy="-8" r="5.6" fill="#38bdf8" />
          <circle cx="-1.8" cy="-10" r="1.8" fill="#fff" opacity="0.7" />
          <rect x="-12" y="4" width="24" height="2.4" fill="#ef4444" opacity="0.85" />
        </g>
      </g>
    </svg>
  )
}