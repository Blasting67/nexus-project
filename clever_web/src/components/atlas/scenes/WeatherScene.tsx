import React from 'react'
import { clamp, lerp, sampleColor } from '../atlasData'
import { animVars } from '../animVars'

const SKY_TOP: Array<[number, string]> = [[0, '#334155'], [35, '#64748b'], [55, '#93b4d6'], [75, '#5fb0ee'], [100, '#3b9ae8']]
const SKY_BOTTOM: Array<[number, string]> = [[0, '#1e293b'], [35, '#475569'], [55, '#c7dcf0'], [75, '#cfeaff'], [100, '#e6f4ff']]
const CLOUD: Array<[number, string]> = [[0, '#475569'], [35, '#94a3b8'], [60, '#f8fafc'], [100, '#ffffff']]
const RAIN_X = [14, 30, 46, 62, 78, 94, 110, 126, 142, 156]
const RAYS = Array.from({ length: 12 }, (_, i) => i * 30)
const SPARKS = [
  { x: 26, y: 44, d: 0 },
  { x: 60, y: 96, d: 0.7 },
  { x: 90, y: 40, d: 1.3 },
  { x: 140, y: 100, d: 0.4 },
  { x: 150, y: 70, d: 1.9 },
]
const HILL_FAR: Array<[number, string]> = [[0, '#334155'], [40, '#6b7f7a'], [60, '#86efac'], [100, '#4ade80']]
const HILL_NEAR: Array<[number, string]> = [[0, '#1e293b'], [40, '#4b5d58'], [60, '#4ade80'], [100, '#22c55e']]
const BOW = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#a78bfa']

const Cloud: React.FC<{ fill: string; shade: number }> = ({ fill, shade }) => (
  <g>
    <g fill={fill}>
      <ellipse cx="0" cy="0" rx="26" ry="11" />
      <ellipse cx="-16" cy="5" rx="16" ry="8" />
      <ellipse cx="18" cy="5" rx="18" ry="8" />
      <ellipse cx="0" cy="-7" rx="16" ry="10" />
    </g>
    <ellipse cx="0" cy="7" rx="30" ry="6" fill="#334155" opacity={shade} />
  </g>
)

/** Sentimiento → clima: de tormenta con relámpagos a un día radiante con sol, pájaros y arcoíris. */
export const WeatherScene: React.FC<{ value: number }> = ({ value }) => {
  const sun = clamp((value - 35) / 65)
  const cloudFill = sampleColor(CLOUD, value)
  const cloudOpacity = 0.55 + 0.45 * (1 - value / 100)
  const shade = clamp((55 - value) / 55) * 0.5
  const rain = clamp((35 - value) / 35)
  const sparkle = clamp((value - 76) / 24)
  const birds = clamp((value - 60) / 25)
  const bow = clamp((value - 80) / 20)

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="wx-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sampleColor(SKY_TOP, value)} />
          <stop offset="100%" stopColor={sampleColor(SKY_BOTTOM, value)} />
        </linearGradient>
        <radialGradient id="wx-sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="wx-sun" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fffbe0" />
          <stop offset="100%" stopColor="#fbbf24" />
        </radialGradient>
      </defs>

      <rect width="168" height="185" fill="url(#wx-sky)" />

      {/* arcoíris (muy optimista) */}
      {bow > 0.03 && (
      <g fill="none" strokeWidth="3.2" opacity={bow * 0.6}>
        {BOW.map((c, i) => (
          <path key={c} d={`M${-8 + i * 3.2} 150 A${86 - i * 3.2} ${86 - i * 3.2} 0 0 1 ${176 - i * 3.2} 150`} stroke={c} />
        ))}
      </g>
      )}

      {/* sol con rayos que giran */}
      {sun > 0.03 && (
      <g opacity={sun}>
        <circle cx="116" cy="62" r={30 + sun * 14} fill="url(#wx-sun-glow)" className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '4s', '--s': 1.12 })} />
        <g className="sc-spin" style={{ transformOrigin: '116px 62px', ...animVars({ '--d': '26s' }) }}>
          {RAYS.map((a) => (
            <path key={a} d="M116 24 L119.4 38 L112.6 38 Z" fill="#fde68a" opacity="0.85" transform={`rotate(${a} 116 62)`} />
          ))}
        </g>
        <circle cx="116" cy="62" r="16" fill="url(#wx-sun)" className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '3s', '--s': 1.06 })} />
      </g>
      )}

      {/* destellos */}
      {sparkle > 0.03 && (
      <g opacity={sparkle} fill="#fff7d6">
        {SPARKS.map((s) => (
          <circle key={s.x} cx={s.x} cy={s.y} r="1.9" className="atlas-twinkle" style={{ ...animVars({ '--d': '3s' }), animationDelay: `${s.d}s` }} />
        ))}
      </g>
      )}

      {/* colinas y molino: el viento sopla más fuerte en la tormenta */}
      <path d="M0 140 C30 112 62 108 92 120 C122 132 150 112 168 120 L168 190 L0 190 Z" fill={sampleColor(HILL_FAR, value)} />
      <g>
        <path d="M29 124 L31 104 L35 104 L37 124 Z" fill="#f8fafc" opacity="0.95" />
        <g className="sc-spin" style={{ transformOrigin: '33px 103px', ...animVars({ '--d': `${lerp(9, 2.6, 1 - value / 100)}s` }) }}>
          {[0, 90, 180, 270].map((a) => (
            <path key={a} d="M33 103 L30.6 90 L35.4 90 Z" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.6" transform={`rotate(${a} 33 103)`} />
          ))}
        </g>
        <circle cx="33" cy="103" r="2.2" fill="#64748b" />
      </g>
      <path d="M0 152 C28 128 70 124 104 136 C130 144 150 134 168 132 L168 190 L0 190 Z" fill={sampleColor(HILL_NEAR, value)} />

      {/* nubes que cruzan el cielo */}
      <g opacity={cloudOpacity}>
        <g transform="translate(0 52)">
          <g className="sc-cloud-x" style={{ ...animVars({ '--d': '30s' }), animationDelay: '-8s' }}>
            <Cloud fill={cloudFill} shade={shade} />
          </g>
        </g>
        <g transform="translate(0 100) scale(.78)">
          <g className="sc-cloud-x" style={{ ...animVars({ '--d': '22s' }), animationDelay: '-15s' }}>
            <Cloud fill={cloudFill} shade={shade} />
          </g>
        </g>
        <g transform="translate(0 76) scale(.6)">
          <g className="sc-cloud-x" style={{ ...animVars({ '--d': '16s' }), animationDelay: '-3s' }}>
            <Cloud fill={cloudFill} shade={shade} />
          </g>
        </g>
      </g>

      {/* pájaros */}
      {birds > 0.03 && (
      <g opacity={birds} fill="none" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round">
        {[
          { y: 44, d: 0, t: 13 },
          { y: 60, d: -4, t: 17 },
          { y: 36, d: -9, t: 15 },
        ].map((b) => (
          <g key={b.y} transform={`translate(0 ${b.y})`}>
            <g className="sc-glide" style={{ ...animVars({ '--d': `${b.t}s` }), animationDelay: `${b.d}s` }}>
              <path d="M-5 0 Q-2.5 -4 0 0 Q2.5 -4 5 0" className="sc-flap sc-fb sc-ob" />
            </g>
          </g>
        ))}
      </g>
      )}

      {/* lluvia y relámpago */}
      {rain > 0.03 && (
      <g opacity={rain} stroke="#bfdbfe" strokeWidth="1.6" strokeLinecap="round">
        {RAIN_X.map((x, i) => (
          <line key={x} x1={x} y1={70} x2={x - 3} y2={80} className="sc-rain" style={{ ...animVars({ '--d': '0.8s' }), animationDelay: `${(i % 5) * 0.16}s` }} />
        ))}
      </g>
      )}
      {value < 24 && (
        <g fill="none" strokeLinecap="round" strokeLinejoin="round" className="sc-bolt" style={animVars({ '--d': '3.4s' })}>
          <path d="M60 72 L52 92 L60 92 L48 116" stroke="#fde047" strokeWidth="5.5" opacity="0.35" />
          <path d="M60 72 L52 92 L60 92 L48 116" stroke="#fffbeb" strokeWidth="2.4" />
        </g>
      )}
    </svg>
  )
}