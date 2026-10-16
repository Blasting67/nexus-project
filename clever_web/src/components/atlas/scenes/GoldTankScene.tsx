import React from 'react'
import { MAX_SUPPLY, clamp, wavePath } from '../atlasData'
import { animVars } from '../animVars'

const TOP = 46 // borde superior interior del contenedor (lleno)
const BOTTOM = 130 // fondo interior
const TICKS = [0, 5, 10, 15, MAX_SUPPLY]
const BUBBLES = [
  { x: 50, r: 2.2, d: 0, t: 3.4 },
  { x: 70, r: 1.5, d: -1.2, t: 2.8 },
  { x: 96, r: 2.5, d: -0.5, t: 3.8 },
  { x: 116, r: 1.7, d: -2, t: 3.1 },
  { x: 84, r: 1.3, d: -2.6, t: 2.6 },
]
const COINS = [
  { x: 96, d: 0, t: 2.9 },
  { x: 112, d: -1, t: 3.3 },
  { x: 124, d: -2, t: 2.6 },
]

const levelY = (supply: number) => BOTTOM - clamp(supply / MAX_SUPPLY) * (BOTTOM - TOP)

/** Suministro → contenedor de oro que se va llenando hasta el máximo de 21 millones. */
export const GoldTankScene: React.FC<{ value: number }> = ({ value }) => {
  const level = levelY(value)
  const filled = clamp(value / MAX_SUPPLY)
  const full = clamp((filled - 0.85) / 0.15) // brillo extra cuando está casi lleno

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="gt-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffbeb" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <radialGradient id="gt-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="gt-liquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
        <linearGradient id="gt-liquid-b" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <radialGradient id="gt-coin" cx="35%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#fff3b0" />
          <stop offset="55%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </radialGradient>
        <clipPath id="gt-clip">
          <rect x="36" y="46" width="96" height="84" rx="12" />
        </clipPath>
      </defs>

      <rect width="168" height="185" fill="url(#gt-bg)" />
      <ellipse cx="84" cy="92" rx="76" ry="62" fill="url(#gt-glow)" opacity={0.5 + 0.5 * full} className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '3.6s', '--s': 1.08 })} />

      {/* escala: de 0 al máximo de 21 millones */}
      <g stroke="#a16207" strokeWidth="1.3" strokeLinecap="round" opacity="0.75">
        {TICKS.map((k) => {
          const y = levelY(k)
          return <line key={k} x1="26" y1={y} x2={k % 10 === 0 || k === MAX_SUPPLY ? 33 : 30} y2={y} />
        })}
      </g>
      <g fontSize="7.5" fontWeight="700" fill="#854d0e" textAnchor="end">
        {TICKS.map((k) => (
          <text key={k} x="23" y={levelY(k) + 2.6}>
            {k === MAX_SUPPLY ? `${k}M` : k}
          </text>
        ))}
      </g>

      {/* contenedor de vidrio */}
      <rect x="32" y="42" width="104" height="92" rx="16" fill="#fff" fillOpacity="0.42" stroke="#cbd5e1" strokeWidth="1.6" />

      <g clipPath="url(#gt-clip)">
        {/* oro líquido que sube (dos capas de oleaje) */}
        <path d={wavePath(level, 2.6, -80, 260, 150)} fill="url(#gt-liquid)" className="atlas-wave" style={animVars({ '--d': '4.4s' })} />
        <path d={wavePath(level + 1.6, 2.2, -80, 260, 150)} fill="url(#gt-liquid-b)" opacity="0.55" className="atlas-wave" style={animVars({ '--d': '3.1s' })} />

        {/* burbujas que suben dentro del oro */}
        <g fill="#fff7c2">
          {BUBBLES.map((b) => (
            <circle key={b.x} cx={b.x} cy={BOTTOM - 4} r={b.r} className="sc-bubble" style={{ ...animVars({ '--d': `${b.t}s`, '--h': `${-(BOTTOM - 8 - level)}px` }), animationDelay: `${b.d}s` }} />
          ))}
        </g>

        {/* brillo de la superficie */}
        <rect x="36" y={level - 1} width="96" height="2" fill="#fff" opacity="0.5" />
      </g>

      {/* moneda que flota en la superficie */}
      <g transform={`translate(70 ${Math.max(level - 2, TOP + 14)})`}>
        <g className="atlas-bob" style={animVars({ '--d': '2.6s' })}>
          <circle r="11" fill="url(#gt-coin)" stroke="#78350f" strokeWidth="1.2" />
          <circle r="8.2" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="0.9" />
          <text y="5.2" textAnchor="middle" fontSize="14" fontWeight="700" fill="#78350f">
            ₿
          </text>
        </g>
      </g>

      {/* monedas que caen al contenedor y ondas al llegar */}
      {COINS.map((c) => {
        const fall = Math.max(10, level - 8 - 6)
        return (
          <g key={c.x}>
            <circle cx={c.x} cy="6" r="4.2" fill="url(#gt-coin)" stroke="#92400e" strokeWidth="0.8" className="sc-drop sc-fb sc-oc" style={{ ...animVars({ '--d': `${c.t}s`, '--h': `${fall}px` }), animationDelay: `${c.d}s` }} />
            <ellipse cx={c.x} cy={level + 0.5} rx="9" ry="2.2" fill="none" stroke="#fff" strokeWidth="1.2" className="sc-ripple sc-fb sc-oc" style={{ ...animVars({ '--d': `${c.t}s` }), animationDelay: `${c.d}s` }} />
          </g>
        )
      })}

      {/* borde superior del contenedor y reflejos del vidrio */}
      <rect x="28" y="38" width="112" height="8" rx="4" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.2" />
      <rect x="40" y="52" width="3.4" height="68" rx="1.7" fill="#fff" opacity="0.5" />
      <rect x="47" y="58" width="1.8" height="40" rx="0.9" fill="#fff" opacity="0.35" />

      {/* destellos cuando está casi lleno */}
      <g fill="#fff" opacity={0.25 + 0.75 * full}>
        {[{ x: 150, y: 60, d: 0 }, { x: 18, y: 76, d: 0.8 }, { x: 148, y: 108, d: 1.5 }].map((s) => (
          <path key={s.x} d={`M${s.x} ${s.y - 4} L${s.x + 1.2} ${s.y - 1.2} L${s.x + 4} ${s.y} L${s.x + 1.2} ${s.y + 1.2} L${s.x} ${s.y + 4} L${s.x - 1.2} ${s.y + 1.2} L${s.x - 4} ${s.y} L${s.x - 1.2} ${s.y - 1.2} Z`} className="atlas-twinkle" style={{ ...animVars({ '--d': '2.6s' }), animationDelay: `${s.d}s` }} />
        ))}
      </g>
    </svg>
  )
}
