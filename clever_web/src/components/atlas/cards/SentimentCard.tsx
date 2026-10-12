import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { clamp, cssVars, goodColor, sampleColor, sentimentLabel } from '../atlasData'

const SKY_TOP: Array<[number, string]> = [
  [0, '#334155'],
  [35, '#64748b'],
  [55, '#93b4d6'],
  [75, '#5fb0ee'],
  [100, '#3b9ae8'],
]
const SKY_BOTTOM: Array<[number, string]> = [
  [0, '#1e293b'],
  [35, '#475569'],
  [55, '#c7dcf0'],
  [75, '#cfeaff'],
  [100, '#e6f4ff'],
]
const CLOUD: Array<[number, string]> = [
  [0, '#475569'],
  [35, '#94a3b8'],
  [60, '#f8fafc'],
  [100, '#ffffff'],
]
const RAIN_X = [30, 44, 58, 72, 86, 100]
const SPARKLES = [
  { x: 20, y: 20, d: 0 },
  { x: 44, y: 60, d: 0.6 },
  { x: 78, y: 12, d: 1.1 },
  { x: 112, y: 58, d: 1.7 },
  { x: 106, y: 80, d: 0.3 },
  { x: 28, y: 82, d: 2 },
]

/** Sentimiento → clima (0 tormenta … 100 muy optimista) */
export const SentimentCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const sun = clamp((v - 40) / 60)
  const clouds = Math.max(0.18, 1 - v / 100)
  const rain = v < 30 ? (30 - v) / 30 : 0
  const sparkle = v > 78 ? (v - 78) / 22 : 0

  return (
    <AtlasCard
      title="Sentimiento"
      tip="Resume el ánimo general de quienes operan. Puedes guiarte con el tipo de mercado actual (Bull o Bear Market) y noticias."
      tint="rgba(56,189,248,0.10)"
    >
      <div className="flex items-center justify-between gap-3">
        <Readout value={Math.round(v)} suffix="/100" label={sentimentLabel(v)} labelColor={goodColor(v)} />

        <svg viewBox="0 0 132 96" className="h-24 w-[132px] shrink-0" aria-hidden="true">
          <defs>
            <linearGradient id="atlas-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={sampleColor(SKY_TOP, v)} />
              <stop offset="100%" stopColor={sampleColor(SKY_BOTTOM, v)} />
            </linearGradient>
            <filter id="atlas-sun-blur" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            <clipPath id="atlas-sky-clip">
              <rect width="132" height="96" rx="14" />
            </clipPath>
          </defs>

          <g clipPath="url(#atlas-sky-clip)">
            <rect width="132" height="96" fill="url(#atlas-sky)" />

            {/* sol */}
            <g opacity={sun}>
              <circle cx="98" cy="30" r={20 + sun * 8} fill="#fde68a" opacity="0.45" filter="url(#atlas-sun-blur)" />
              <circle cx="98" cy="30" r="13" fill="#fde7a0" />
            </g>

            {/* partículas suaves (muy optimista) */}
            <g opacity={sparkle} fill="#fff3d6">
              {SPARKLES.map((s) => (
                <circle
                  key={`${s.x}-${s.y}`}
                  cx={s.x}
                  cy={s.y}
                  r="1.8"
                  className="atlas-twinkle"
                  style={{ ...cssVars({ '--d': '3s' }), animationDelay: `${s.d}s` }}
                />
              ))}
            </g>

            {/* nubes */}
            <g opacity={clouds} fill={sampleColor(CLOUD, v)}>
              <g className="atlas-bob" style={cssVars({ '--d': '7s' })}>
                <ellipse cx="44" cy="30" rx="22" ry="10" />
                <ellipse cx="28" cy="36" rx="16" ry="8" />
                <ellipse cx="62" cy="36" rx="14" ry="7" />
                <ellipse cx="96" cy="58" rx="18" ry="8" />
                <ellipse cx="84" cy="63" rx="12" ry="6" />
              </g>
            </g>

            {/* lluvia */}
            <g opacity={rain} stroke="#bfdbfe" strokeWidth="1.6" strokeLinecap="round">
              {RAIN_X.map((x, i) => (
                <line
                  key={x}
                  x1={x}
                  y1={44}
                  x2={x - 3}
                  y2={54}
                  className="atlas-rain"
                  style={{ ...cssVars({ '--d': '0.9s' }), animationDelay: `${i * 0.13}s` }}
                />
              ))}
            </g>

            {/* relámpago (tormenta) */}
            {v < 22 && (
              <path
                d="M52 40 L45 56 L52 56 L43 76"
                fill="none"
                stroke="#fde047"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="atlas-flash"
                style={{ ...cssVars({ '--d': '3.6s' }), filter: 'drop-shadow(0 0 4px rgba(253,224,71,.9))' }}
              />
            )}
          </g>
        </svg>
      </div>
    </AtlasCard>
  )
}