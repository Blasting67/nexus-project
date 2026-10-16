import React from 'react'
import { clamp, sampleColor } from '../atlasData'
import { animVars } from '../animVars'

const STOPS: Array<[number, string]> = [[0, '#2563eb'], [30, '#0891b2'], [50, '#d97706'], [75, '#ea580c'], [100, '#dc2626']]
const FLAKES = [
  { x: 10, s: 1.8, d: 0, t: 6.5, dx: 8 },
  { x: 22, s: 1.2, d: -2, t: 5.2, dx: -6 },
  { x: 34, s: 2.2, d: -4, t: 7.4, dx: 10 },
  { x: 46, s: 1.4, d: -1, t: 5.8, dx: -8 },
  { x: 58, s: 2, d: -5, t: 6.9, dx: 6 },
  { x: 66, s: 1.3, d: -3, t: 5.4, dx: -5 },
  { x: 16, s: 1.5, d: -6, t: 6.1, dx: 7 },
  { x: 40, s: 1.1, d: -2.5, t: 7.8, dx: -9 },
]
const FLAMES = [
  { x: 124, k: 1, d: 0 },
  { x: 140, k: 0.8, d: -0.3 },
  { x: 154, k: 0.92, d: -0.6 },
]
const EMBERS = [
  { x: 124, d: 0, dx: 8 },
  { x: 138, d: -1, dx: -6 },
  { x: 150, d: -2, dx: 9 },
  { x: 132, d: -1.6, dx: -4 },
]
const ZONES = ['#2563eb', '#0891b2', '#d97706', '#ea580c', '#dc2626']
const TICKS = [104, 87.5, 71, 54.5, 38]

/** Miedo y codicia → termómetro entre el hielo (miedo) y el fuego (codicia). */
export const ThermoScene: React.FC<{ value: number }> = ({ value }) => {
  const color = sampleColor(STOPS, value)
  const top = 104 - (value / 100) * 66
  const cold = clamp((55 - value) / 55)
  const hot = clamp((value - 45) / 55)
  const shiver = value < 28

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="th-bg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="50%" stopColor="#fefce8" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <radialGradient id="th-ice" cx="20%" cy="55%" r="55%">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="th-fire" cx="82%" cy="70%" r="55%">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="th-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="55%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <clipPath id="th-merc">
          <rect x="79" y={top} width="10" height={112 - top} rx="5" />
          <circle cx="84" cy="114" r="10" />
        </clipPath>
      </defs>

      <rect width="168" height="185" fill="url(#th-bg)" />
      <rect width="168" height="185" fill="url(#th-ice)" opacity={cold} />
      <rect width="168" height="185" fill="url(#th-fire)" opacity={hot} />

      {/* nieve (miedo) */}
      {cold > 0.03 && (
      <g opacity={cold} fill="#fff" stroke="#93c5fd" strokeWidth="0.6">
        {FLAKES.map((f) => (
          <circle key={f.x} cx={f.x} cy="0" r={f.s} className="sc-snow" style={{ ...animVars({ '--d': `${f.t}s`, '--dx': `${f.dx}px` }), animationDelay: `${f.d}s` }} />
        ))}
      </g>
      )}

      {/* llamas y brasas (codicia) */}
      {hot > 0.03 && (
      <g opacity={hot}>
        {FLAMES.map((f) => (
          <g key={f.x} transform={`translate(${f.x} 134) scale(${f.k})`}>
            <path
              d="M0 0 C-9 -8 -8 -20 0 -34 C3 -22 10 -16 8 -7 C7 -2 3 0 0 0 Z"
              fill="url(#th-flame)"
              className="sc-flame sc-fb sc-ob"
              style={{ ...animVars({ '--d': `${0.8 + f.k * 0.2}s` }), animationDelay: `${f.d}s` }}
            />
          </g>
        ))}
        <g fill="#fde047">
          {EMBERS.map((e) => (
            <circle key={e.x} cx={e.x} cy="122" r="1.5" className="sc-ember" style={{ ...animVars({ '--d': '3s', '--dx': `${e.dx}px` }), animationDelay: `${e.d}s` }} />
          ))}
        </g>
      </g>
      )}

      {/* termómetro */}
      <g transform="translate(-16 0)">
      <g className={shiver ? 'sc-shiver' : ''}>
        {/* escala por zonas: de Miedo (abajo) a Codicia (arriba) */}
        <g strokeWidth="2.6" strokeLinecap="round">
          {TICKS.map((y, i) => (
            <line key={y} x1="98" y1={y} x2="105" y2={y} stroke={ZONES[i]} />
          ))}
        </g>
        <g fontSize="8.5" fontWeight="700">
          <text x="110" y="41" fill="#dc2626">Codicia</text>
          <text x="110" y="107" fill="#2563eb">Miedo</text>
        </g>

        {/* vidrio */}
        <rect x="75" y="34" width="18" height="78" rx="9" fill="#fff" fillOpacity="0.82" stroke="#cbd5e1" strokeWidth="1.5" />
        <circle cx="84" cy="114" r="14" fill="#fff" fillOpacity="0.88" stroke="#cbd5e1" strokeWidth="1.5" />

        {/* resplandor y mercurio */}
        <g opacity="0.3" fill={color}>
          <rect x="77" y={top - 2} width="14" height={116 - top} rx="7" />
          <circle cx="84" cy="114" r="13" />
        </g>
        <rect x="79" y={top} width="10" height={112 - top} rx="5" fill={color} />
        <circle cx="84" cy="114" r="10.5" fill={color} />

        {/* burbujas dentro del mercurio */}
        <g clipPath="url(#th-merc)" fill="#fff" fillOpacity="0.55">
          {[82, 86, 84].map((x, i) => (
            <circle key={i} cx={x} cy="114" r={1.4 + i * 0.3} className="sc-bubble" style={{ ...animVars({ '--d': `${2.2 + i * 0.7}s`, '--h': `${-(114 - top)}px` }), animationDelay: `${i * 0.8}s` }} />
          ))}
        </g>

        {/* brillo y menisco */}
        <rect x="80.5" y={top + 3} width="2" height={Math.max(0, 100 - top)} rx="1" fill="#fff" opacity="0.4" />
        <ellipse cx="84" cy={top + 0.5} rx="5" ry="1.7" fill="#fff" opacity="0.5" />
        <circle cx="80" cy="110" r="3" fill="#fff" opacity="0.4" />
      </g>
      </g>
    </svg>
  )
}