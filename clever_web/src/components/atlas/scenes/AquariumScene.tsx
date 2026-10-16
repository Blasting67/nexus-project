import React from 'react'
import { clamp, lerp, wavePath } from '../atlasData'
import { animVars } from '../animVars'

const BUBBLES = [
  { x: 28, r: 2, d: 0, t: 3.6 },
  { x: 52, r: 1.4, d: -1.4, t: 3 },
  { x: 76, r: 2.3, d: -0.6, t: 4 },
  { x: 108, r: 1.6, d: -2.2, t: 3.3 },
  { x: 132, r: 2.1, d: -1, t: 3.8 },
  { x: 150, r: 1.3, d: -2.8, t: 2.9 },
]
const FISH = [
  { dy: 22, color: '#fb923c', fin: '#f97316', t: 11, d: -2, dir: 'r' },
  { dy: 40, color: '#facc15', fin: '#eab308', t: 14, d: -8, dir: 'l' },
  { dy: 56, color: '#f472b6', fin: '#ec4899', t: 17, d: -5, dir: 'r' },
]
const WEEDS = [
  { x: 14, h: 30, d: 0 },
  { x: 24, h: 22, d: -1 },
  { x: 150, h: 28, d: -2 },
  { x: 160, h: 20, d: -0.5 },
]

/** Liquidez → acuario: con liquidez alta el agua es profunda y tranquila (con peces); con poca, baja y agitada. */
export const AquariumScene: React.FC<{ value: number }> = ({ value }) => {
  const level = 132 - (value / 100) * 90
  const unstable = (100 - value) / 100
  const amp = lerp(1.6, 6.5, unstable)
  const dur = lerp(5.8, 1.5, unstable)
  const deep = clamp((value - 30) / 50)

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="aq-air" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f9ff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="aq-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="aq-water-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#0e7490" />
        </linearGradient>
        <linearGradient id="aq-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id="aq-clip">
          <rect width="168" height="185" />
        </clipPath>
      </defs>

      <rect width="168" height="185" fill="url(#aq-air)" />

      <g clipPath="url(#aq-clip)">
        {/* agua de fondo */}
        <path d={wavePath(level, amp * 1.2, -80, 260, 190)} fill="url(#aq-water)" opacity="0.7" className="atlas-wave" style={animVars({ '--d': `${dur * 1.35}s` })} />

        {/* rayos de luz que se mecen */}
        <g opacity={0.3 + 0.5 * deep}>
          {[28, 70, 112].map((x, i) => (
            <polygon key={x} points={`${x},${level} ${x + 16},${level} ${x + 34},190 ${x + 8},190`} fill="url(#aq-ray)" className="sc-caustic" style={{ ...animVars({ '--d': `${4.4 + i * 1.3}s` }), animationDelay: `${-i * 1.4}s` }} />
          ))}
        </g>

        {/* algas */}
        <g fill="none" stroke="#16a34a" strokeWidth="3.2" strokeLinecap="round">
          {WEEDS.map((w) => (
            <path key={w.x} d={`M${w.x} 150 C${w.x - 6} ${150 - w.h * 0.4} ${w.x + 6} ${150 - w.h * 0.7} ${w.x} ${150 - w.h}`} className="sc-sway sc-fb sc-ob" style={{ ...animVars({ '--d': '3.6s' }), animationDelay: `${w.d}s` }} />
          ))}
        </g>

        {/* burbujas */}
        <g fill="#fff" fillOpacity="0.8">
          {BUBBLES.map((b) => {
            const start = 150
            return (
              <circle
                key={b.x}
                cx={b.x}
                cy={start}
                r={b.r}
                className="sc-bubble"
                style={{ ...animVars({ '--d': `${b.t}s`, '--h': `${-(start - level - 4)}px` }), animationDelay: `${b.d}s` }}
              />
            )
          })}
        </g>

        {/* agua de frente, con el oleaje */}
        <path d={wavePath(level + 1.5, amp, -80, 260, 190)} fill="url(#aq-water-b)" opacity="0.28" className="atlas-wave" style={animVars({ '--d': `${dur}s` })} />
        <path d={wavePath(level, amp * 0.7, -80, 260, 200).replace(/ L[^L]*L[^Z]*Z$/, '')} fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="1.6" className="atlas-wave" style={animVars({ '--d': `${dur * 1.35}s` })} />
        {/* peces: solo si hay agua suficiente */}
        {FISH.map((f) => {
          const y = level + f.dy
          if (y > 128) return null
          return (
            <g key={f.dy} transform={`translate(0 ${y})`} opacity={clamp((130 - y) / 26)}>
              <g className={f.dir === 'r' ? 'sc-swim-r' : 'sc-swim-l'} style={{ ...animVars({ '--d': `${f.t}s` }), animationDelay: `${f.d}s` }}>
                <g transform={f.dir === 'l' ? 'scale(-1 1)' : undefined}>
                  <g className="atlas-bob" style={animVars({ '--d': '1.6s' })}>
                    <path d="M-9 0 L-16 -5 L-16 5 Z" fill={f.fin} />
                    <ellipse cx="0" cy="0" rx="10" ry="5.6" fill={f.color} />
                    <path d="M-2 -5 Q2 -10 6 -5 Z" fill={f.fin} />
                    <circle cx="5.5" cy="-1.2" r="1.7" fill="#fff" />
                    <circle cx="6" cy="-1.2" r="0.85" fill="#0f172a" />
                  </g>
                </g>
              </g>
            </g>
          )
        })}

      </g>

      {/* reflejos del vidrio */}
      <rect x="8" y="30" width="3" height="110" rx="1.5" fill="#fff" opacity="0.35" />
      <rect x="14" y="40" width="1.6" height="70" rx="0.8" fill="#fff" opacity="0.25" />
    </svg>
  )
}