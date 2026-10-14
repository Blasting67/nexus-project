import React from 'react'
import type { PatternCandle } from './PatternData'

const W = 160
const H = 110
const PAD_X = 12
const PAD_Y = 12

// misma paleta pastel que los gráficos de la parte 2
const UP = { fill: '#a7f3d0', stroke: '#34d399' }
const DOWN = { fill: '#fecdd3', stroke: '#fb7185' }
const NEUTRAL = { fill: '#e2e8f0', stroke: '#94a3b8' }

const rev = (shown: boolean) =>
  `transition duration-500 ease-out motion-reduce:transition-none ${
    shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
  }`

interface PatternIllustrationProps {
  candles: PatternCandle[]
  label: string
  shown: boolean
}

/**
 * Dibuja las velas de un patrón. Las velas de contexto (la tendencia previa) van atenuadas y
 * un recuadro suave marca las velas que forman el patrón.
 */
export const PatternIllustration: React.FC<PatternIllustrationProps> = ({ candles, label, shown }) => {
  const n = candles.length
  const lo = Math.min(...candles.map((k) => k.l))
  const hi = Math.max(...candles.map((k) => k.h))
  const span = hi - lo || 1
  const yOf = (v: number) => PAD_Y + ((hi - v) / span) * (H - 2 * PAD_Y)

  const slot = Math.min(28, (W - 2 * PAD_X) / n)
  const left = (W - n * slot) / 2
  const bodyW = Math.min(slot * 0.56, 15)

  const firstPattern = candles.findIndex((k) => !k.context)
  const patternCount = candles.filter((k) => !k.context).length

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-full w-full">
      {/* líneas de referencia */}
      <g stroke="#0f172a" strokeOpacity="0.06">
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1="6" x2={W - 6} y1={H * f} y2={H * f} />
        ))}
      </g>

      {/* recuadro del patrón */}
      <rect
        x={left + firstPattern * slot + 1.5}
        y="4"
        width={patternCount * slot - 3}
        height={H - 8}
        rx="9"
        fill="#fff"
        fillOpacity="0.65"
        stroke="#cbd5e1"
        strokeDasharray="3 3"
        className={`opacity-70 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none`}
      />

      {candles.map((k, i) => {
        const x = left + (i + 0.5) * slot
        const color = k.neutral ? NEUTRAL : k.c >= k.o ? UP : DOWN
        const yOpen = yOf(k.o)
        const yClose = yOf(k.c)

        return (
          <g key={i} className={rev(shown)} style={{ transitionDelay: `${i * 70}ms` }}>
            <g opacity={k.context ? 0.45 : 1}>
              <line
                x1={x}
                x2={x}
                y1={yOf(k.h)}
                y2={yOf(k.l)}
                stroke={color.stroke}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <rect
                x={x - bodyW / 2}
                y={Math.min(yOpen, yClose)}
                width={bodyW}
                height={Math.max(Math.abs(yClose - yOpen), 2)}
                rx="1.5"
                fill={color.fill}
                stroke={color.stroke}
                strokeWidth="1.5"
              />
            </g>
          </g>
        )
      })}
    </svg>
  )
}
