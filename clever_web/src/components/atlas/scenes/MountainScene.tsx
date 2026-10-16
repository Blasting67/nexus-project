import React from 'react'
import { clamp, lerp, sampleColor } from '../atlasData'
import { animVars } from '../animVars'

const SKY_TOP: Array<[number, string]> = [[0, '#bae6fd'], [50, '#cbd5e1'], [100, '#94a3b8']]
const SKY_BOTTOM: Array<[number, string]> = [[0, '#fef9c3'], [50, '#e2e8f0'], [100, '#cbd5e1']]
const FOG = [
  { cx: 22, cy: 0, rx: 52, ry: 14, d: 15, delay: 0 },
  { cx: 96, cy: -6, rx: 58, ry: 15, d: 19, delay: -4 },
  { cx: 158, cy: 2, rx: 50, ry: 14, d: 17, delay: -8 },
]
const QMARKS = [
  { x: 34, y: 92, d: 0 },
  { x: 74, y: 100, d: 1.4 },
  { x: 116, y: 88, d: 2.6 },
  { x: 146, y: 100, d: 0.8 },
]

/** Incertidumbre → montañas: con claridad se ve la bandera de la cima; con incertidumbre sube la niebla y aparecen los "?". */
export const MountainScene: React.FC<{ value: number }> = ({ value }) => {
  const u = value / 100
  const fogOpacity = 0.12 + 0.82 * u
  const fogBase = lerp(124, 66, u)
  const sunny = clamp(1 - u * 1.2)
  const marks = clamp((value - 42) / 40)
  const flag = clamp(1 - u * 1.25)

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="mt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sampleColor(SKY_TOP, value)} />
          <stop offset="100%" stopColor={sampleColor(SKY_BOTTOM, value)} />
        </linearGradient>
        <radialGradient id="mt-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="mt-fog" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b6c3d6" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="mt-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a9bb5" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>
        <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#566277" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      <rect width="168" height="185" fill="url(#mt-sky)" />
      {sunny > 0.03 && <circle cx="46" cy="58" r="34" fill="url(#mt-sun)" opacity={sunny} className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '5s', '--s': 1.1 })} />}

      <g transform="translate(0 -22)">
        <polygon points="0,170 0,100 24,80 44,96 74,66 98,92 124,74 150,94 168,82 168,170" fill="url(#mt-far)" />
        <polygon points="0,170 0,114 26,96 50,112 108,64 134,98 150,88 168,108 168,170" fill="url(#mt-mid)" />
        {/* nieve de la cima */}
        <polygon points="108,64 99,77 104,75 108,81 113,75 118,77" fill="#fff" opacity="0.92" />

        {/* bandera en la cima: se ve solo si hay claridad */}
        {flag > 0.03 && (
        <g opacity={flag}>
          <line x1="108" y1="64" x2="108" y2="42" stroke="#334155" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M108 42 Q116 39 123 43 Q116 47 108 50 Z" fill="#ef4444" className="sc-flag sc-fb sc-ol" />
        </g>
        )}

        <polygon points="0,170 0,138 28,120 60,138 90,112 128,136 168,122 168,170" fill="url(#mt-near)" />
        <polygon points="90,112 82,123 87,121 90,126 94,121 99,123" fill="#fff" opacity="0.85" />
      </g>

      {/* bancos de niebla */}
      <g opacity={fogOpacity} fill="url(#mt-fog)">
        {[0, 1, 2].map((layer) => (
          <g key={layer} transform={`translate(0 ${fogBase - layer * 20})`}>
            {FOG.map((f) => (
              <ellipse
                key={layer + '-' + f.cx}
                cx={(f.cx + layer * 34) % 190}
                cy={f.cy}
                rx={f.rx}
                ry={f.ry}
                className="sc-fog"
                style={{ ...animVars({ '--d': `${f.d + layer * 3}s` }), animationDelay: `${f.delay - layer * 2}s` }}
              />
            ))}
          </g>
        ))}
      </g>

      {/* signos de interrogación que flotan en la niebla */}
      {marks > 0.03 && (
      <g opacity={marks} fill="#475569" fontSize="15" fontWeight="700" textAnchor="middle">
        {QMARKS.map((q) => (
          <text key={q.x} x={q.x} y={q.y} className="sc-qmark" style={{ ...animVars({ '--d': '5.6s' }), animationDelay: `${q.d}s` }}>
            ?
          </text>
        ))}
      </g>
      )}
    </svg>
  )
}