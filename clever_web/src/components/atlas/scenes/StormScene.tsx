import React from 'react'
import { clamp, lerp, riskColor, sampleColor } from '../atlasData'
import { animVars } from '../animVars'

const SKY_TOP: Array<[number, string]> = [[0, '#c7d2fe'], [50, '#818cf8'], [100, '#312e81']]
const SKY_BOTTOM: Array<[number, string]> = [[0, '#eef2ff'], [50, '#c7d2fe'], [100, '#4338ca']]
const CLOUD_TOP: Array<[number, string]> = [[0, '#ffffff'], [50, '#dbe2ff'], [100, '#9aa2f7']]
const CLOUD_BOT: Array<[number, string]> = [[0, '#c7d2fe'], [50, '#6366f1'], [100, '#1e1b4b']]

const RAIN = [52, 62, 72, 82, 92, 102, 112, 122]
// patrón repetible de 168 px para el sismógrafo
const NOISE = [0.1, -0.6, 0.9, -0.3, 0.5, -1, 0.7, -0.2, 0.3, -0.8, 1, -0.5, 0.2, -0.9, 0.6, -0.1, 0.8, -0.7, 0.4, -1, 0.9, -0.4, 0.1, -0.6, 0.7, -0.3, 0.5, -0.8]

const seismo = (amp: number) => {
  let d = ''
  for (let i = 0; i <= 56; i++) {
    const x = i * 6
    const y = 116 + amp * NOISE[i % 28]
    d += `${i === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)} `
  }
  return d
}

/** Volatilidad → tormenta: la nube crece y se agita, caen rayos y el sismógrafo oscila más. */
export const StormScene: React.FC<{ value: number }> = ({ value }) => {
  const t = value / 100
  const scale = 0.68 + 0.4 * t
  const billow = lerp(4.6, 1.5, t)
  const rain = clamp((value - 32) / 40)
  const bolts = clamp((value - 46) / 30)
  const wind = clamp((value - 25) / 60)
  const amp = 3 + 11 * t
  const line = riskColor(value)
  const path = seismo(amp)

  return (
    <svg viewBox="0 0 168 185" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sampleColor(SKY_TOP, value)} />
          <stop offset="100%" stopColor={sampleColor(SKY_BOTTOM, value)} />
        </linearGradient>
        <linearGradient id="st-cloud" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={sampleColor(CLOUD_TOP, value)} />
          <stop offset="100%" stopColor={sampleColor(CLOUD_BOT, value)} />
        </linearGradient>
      </defs>

      <rect width="168" height="185" fill="url(#st-sky)" />

      {/* ráfagas de viento */}
      {wind > 0.03 && (
      <g stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity={wind}>
        {[52, 66, 82].map((y, i) => (
          <line key={y} x1="0" y1={y} x2={22 + i * 6} y2={y} className="sc-wind" style={{ ...animVars({ '--d': `${lerp(3.4, 1.3, t)}s` }), animationDelay: `${i * 0.7}s` }} />
        ))}
      </g>
      )}

      {/* lluvia */}
      {rain > 0.03 && (
      <g stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" opacity={rain}>
        {RAIN.map((x, i) => (
          <line key={x} x1={x} y1={94} x2={x - 3} y2={103} className="sc-rain" style={{ ...animVars({ '--d': `${lerp(1, 0.55, t)}s` }), animationDelay: `${(i % 4) * 0.2}s` }} />
        ))}
      </g>
      )}

      {/* rayos */}
      {bolts > 0.03 && (
      <g opacity={bolts} fill="none" strokeLinecap="round" strokeLinejoin="round">
        <g className="sc-bolt" style={animVars({ '--d': `${lerp(4.2, 2.2, t)}s` })}>
          <path d="M70 90 L62 106 L70 106 L58 130" stroke="#fde047" strokeWidth="5" opacity="0.35" />
          <path d="M70 90 L62 106 L70 106 L58 130" stroke="#fffbeb" strokeWidth="2.2" />
        </g>
        <g className="sc-bolt" style={{ ...animVars({ '--d': `${lerp(5, 2.8, t)}s` }), animationDelay: '1.3s' }}>
          <path d="M104 90 L111 105 L103 105 L113 126" stroke="#fde047" strokeWidth="5" opacity="0.35" />
          <path d="M104 90 L111 105 L103 105 L113 126" stroke="#fffbeb" strokeWidth="2.2" />
        </g>
      </g>
      )}

      {/* nube */}
      <g transform={`translate(84 64) scale(${scale})`}>
        <ellipse cx="0" cy="24" rx="58" ry="9" fill="#1e1b4b" opacity={0.12 + 0.2 * t} />
        <g fill="url(#st-cloud)" stroke="#fff" strokeOpacity="0.55" strokeWidth="2">
          {[
            { cx: 0, cy: 10, rx: 60, ry: 25, d: 0 },
            { cx: -38, cy: 0, rx: 33, ry: 23, d: 0.5 },
            { cx: 34, cy: -2, rx: 37, ry: 25, d: 1 },
            { cx: 0, cy: -16, rx: 29, ry: 21, d: 1.5 },
          ].map((e) => (
            <ellipse
              key={e.cx + '-' + e.cy}
              cx={e.cx}
              cy={e.cy}
              rx={e.rx}
              ry={e.ry}
              className="sc-billow sc-fb sc-oc"
              style={{ ...animVars({ '--d': `${billow}s` }), animationDelay: `-${e.d}s` }}
            />
          ))}
        </g>
        <ellipse cx="-10" cy="-22" rx="22" ry="8" fill="#fff" opacity={0.5 - 0.3 * t} />
        <ellipse cx="30" cy="-12" rx="16" ry="6" fill="#fff" opacity={0.35 - 0.2 * t} />
      </g>

      {/* sismógrafo: la línea oscila más cuanto más volátil */}
      <rect x="0" y="98" width="168" height="36" fill="#0f172a" opacity="0.16" />
      <line x1="0" y1="116" x2="168" y2="116" stroke="#fff" strokeOpacity="0.3" strokeDasharray="3 4" />
      <g className="sc-seis" style={animVars({ '--d': `${lerp(5.4, 1.9, t)}s` })}>
        <path d={path} fill="none" stroke={line} strokeWidth="5" strokeLinejoin="round" opacity="0.28" />
        <path d={path} fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    </svg>
  )
}