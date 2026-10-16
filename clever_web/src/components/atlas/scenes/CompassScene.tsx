import React from 'react'
import { clamp, goodColor } from '../atlasData'
import { animVars } from '../animVars'

const CX = 84
const CY = 81
const R = 45
const TICKS = Array.from({ length: 36 }, (_, i) => i * 10)

const polar = (a: number, r: number): [number, number] => {
  const rad = (a * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}
const arc = (a1: number, a2: number, r: number) => {
  const [x1, y1] = polar(a1, r)
  const [x2, y2] = polar(a2, r)
  return `M${x1.toFixed(2)} ${y1.toFixed(2)} A${r} ${r} 0 0 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

const CHEVRONS = [
  { x: 20, y: 56, d: 0 },
  { x: 148, y: 50, d: 0.8 },
  { x: 18, y: 112, d: 1.6 },
  { x: 150, y: 116, d: 0.4 },
  { x: 40, y: 34, d: 2.1 },
  { x: 128, y: 128, d: 1.2 },
]

/** Tendencia → brújula: la aguja apunta hacia donde va el mercado y el fondo fluye en esa dirección. */
export const CompassScene: React.FC<{ value: number }> = ({ value }) => {
  const t = (value - 50) / 50 // -1 … 1
  const strength = Math.abs(t)
  const angle = -t * 65
  const color = goodColor(value)
  const up = value >= 50
  const flowDur = 3.4 - strength * 2

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="cp-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
        <radialGradient id="cp-glow" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor={color} stopOpacity={0.12 + 0.2 * strength} />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cp-bezel" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>
        <radialGradient id="cp-face" cx="42%" cy="34%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#dbe3ee" />
        </radialGradient>
        <radialGradient id="cp-tip" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="168" height="185" fill="url(#cp-bg)" />
      <rect width="168" height="185" fill="url(#cp-glow)" />

      {/* el fondo fluye en la dirección de la tendencia */}
      <g fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {CHEVRONS.map((c) => (
          <g key={c.x + '-' + c.y} transform={`translate(${c.x} ${c.y})`}>
            <path
              d={up ? 'M-5 3 L0 -3 L5 3' : 'M-5 -3 L0 3 L5 -3'}
              className={strength < 0.12 ? 'sc-flow-x' : up ? 'sc-flow-up' : 'sc-flow-down'}
              style={{ ...animVars({ '--d': `${flowDur}s` }), animationDelay: `${c.d}s` }}
            />
          </g>
        ))}
      </g>

      {/* sombra */}
      <ellipse cx={CX} cy={CY + R + 6} rx="34" ry="4.5" fill="#0f172a" opacity="0.14" />

      {/* bisel y cara */}
      <circle cx={CX} cy={CY} r={R} fill="url(#cp-bezel)" />
      <circle cx={CX} cy={CY} r={R - 4} fill="url(#cp-face)" />

      {/* aro de marcas que gira despacio */}
      <g className="sc-spin" style={{ transformOrigin: `${CX}px ${CY}px`, ...animVars({ '--d': '120s' }) }}>
        {TICKS.map((a) => {
          const [x1, y1] = polar(a, R - 5)
          const [x2, y2] = polar(a, R - (a % 90 === 0 ? 13 : a % 30 === 0 ? 10 : 8))
          return (
            <line
              key={a}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={a % 90 === 0 ? '#475569' : '#94a3b8'}
              strokeWidth={a % 90 === 0 ? 1.8 : 1}
              strokeLinecap="round"
            />
          )
        })}
      </g>

      {/* zonas: alcista (arriba) y bajista (abajo) */}
      <path d={arc(-68, -14, 33)} fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" opacity={0.2 + 0.7 * clamp(t)} />
      <path d={arc(14, 68, 33)} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" opacity={0.2 + 0.7 * clamp(-t)} />
      <path d="M116 46 l4 -7 l4 7 z" fill="#16a34a" opacity={0.35 + 0.65 * clamp(t)} />
      <path d="M116 116 l4 7 l4 -7 z" fill="#dc2626" opacity={0.35 + 0.65 * clamp(-t)} />

      {/* aguja */}
      <g transform={`rotate(${angle} ${CX} ${CY})`}>
        <g className="sc-needle" style={{ transformOrigin: `${CX}px ${CY}px`, ...animVars({ '--d': `${2.9 - strength * 1.2}s` }) }}>
          <circle cx={CX + 34} cy={CY} r="9" fill="url(#cp-tip)" className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '1.6s', '--s': 1.45 })} />
          <polygon points={`${CX - 24},${CY} ${CX},${CY - 4.6} ${CX},${CY + 4.6}`} fill="#94a3b8" />
          <polygon points={`${CX + 38},${CY} ${CX},${CY - 4.6} ${CX},${CY + 4.6}`} fill={color} />
          <polygon points={`${CX + 38},${CY} ${CX},${CY - 4.6} ${CX},${CY}`} fill="#fff" opacity="0.32" />
        </g>
      </g>
      <circle cx={CX} cy={CY} r="6.8" fill="url(#cp-bezel)" stroke="#78350f" strokeWidth="1" />
      <circle cx={CX} cy={CY} r="2.4" fill="#451a03" />

      {/* destello que recorre el bisel */}
      <g className="sc-spin" style={{ transformOrigin: `${CX}px ${CY}px`, ...animVars({ '--d': '6s' }) }}>
        <circle cx={CX} cy={CY - R + 1.5} r="2.4" fill="#fff" />
      </g>
    </svg>
  )
}