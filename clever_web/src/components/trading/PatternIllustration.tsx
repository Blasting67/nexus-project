import React, { useId } from 'react'
import type { PatternCandle } from './PatternData'

export type PatternSignal = 'up' | 'down' | 'pause'

const SIZES = { narrow: { W: 300, H: 158 }, wide: { W: 440, H: 162 } }

const UP = { top: '#6ee7b7', bottom: '#10b981', stroke: '#059669' }
const DOWN = { top: '#fda4af', bottom: '#f43f5e', stroke: '#e11d48' }
const NEUTRAL = { top: '#e2e8f0', bottom: '#94a3b8', stroke: '#64748b' }
const SIGNAL = { up: '#059669', down: '#e11d48', pause: '#d97706' }
const FONT = 'ui-sans-serif, system-ui, sans-serif'

const CSS = `
.pi-up{animation:pi-up 1.8s ease-in-out infinite}
.pi-down{animation:pi-down 1.8s ease-in-out infinite}
.pi-pause{animation:pi-pause 1.6s ease-in-out infinite}
@keyframes pi-up{0%,100%{transform:translateY(3px)}50%{transform:translateY(-4px)}}
@keyframes pi-down{0%,100%{transform:translateY(-3px)}50%{transform:translateY(4px)}}
@keyframes pi-pause{0%,100%{opacity:.5}50%{opacity:1}}
@media (prefers-reduced-motion:reduce){.pi-up,.pi-down,.pi-pause{animation:none!important}}
`

interface PatternIllustrationProps {
  candles: PatternCandle[]
  label: string
  shown: boolean
  /** qué anuncia el patrón: sube, baja o pausa (indecisión) */
  signal?: PatternSignal
  /** tarjeta ancha (dos por fila): el dibujo aprovecha más espacio */
  wide?: boolean
}

/**
 * Dibuja las velas de un patrón: las de contexto (la tendencia previa) van atenuadas, un recuadro marca las velas
 * que forman el patrón, cada una lleva su número y una flecha indica qué suele anunciar.
 */
export const PatternIllustration: React.FC<PatternIllustrationProps> = ({ candles, label, shown, signal, wide = false }) => {
  const uid = useId().replace(/:/g, '')
  const { W, H } = wide ? SIZES.wide : SIZES.narrow
  const padX = 14
  const top = 22
  const bottom = 36
  const n = candles.length
  const lo = Math.min(...candles.map((k) => k.l))
  const hi = Math.max(...candles.map((k) => k.h))
  const span = hi - lo || 1
  const yOf = (v: number) => top + ((hi - v) / span) * (H - top - bottom)

  const arrowRoom = signal ? (wide ? 50 : 42) : 0
  const avail = W - 2 * padX - arrowRoom
  const slot = Math.min(wide ? 66 : 50, avail / n)
  const left = padX + (avail - n * slot) / 2
  const bodyW = Math.min(slot * 0.62, wide ? 36 : 30)

  const firstPattern = candles.findIndex((k) => !k.context)
  const patternCount = candles.filter((k) => !k.context).length
  const color = signal ? SIGNAL[signal] : '#64748b'

  // el rótulo de la tendencia previa ocupa ~84 px a la izquierda: va arriba, o abajo, o no se dibuja si estorba a una vela
  const labelRight = left + 88
  const under = candles.filter((k, i) => k.context && left + (i + 0.5) * slot - bodyW / 2 < labelRight)
  const labelY = under.every((k) => yOf(k.h) > 28) ? 15 : under.every((k) => yOf(k.l) < H - 30) ? H - 9 : null
  const ax = W - padX - arrowRoom / 2 + 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-full w-full">
      <style>{CSS}</style>
      <defs>
        {[
          ['u', UP],
          ['d', DOWN],
          ['n', NEUTRAL],
        ].map(([id, c]) => (
          <linearGradient key={id as string} id={`${uid}-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(c as typeof UP).top} />
            <stop offset="100%" stopColor={(c as typeof UP).bottom} />
          </linearGradient>
        ))}
      </defs>

      {/* líneas de referencia */}
      <g stroke="#0f172a" strokeOpacity="0.07" strokeDasharray="3 5">
        {[0.3, 0.55, 0.8].map((f) => (
          <line key={f} x1="8" x2={W - 8} y1={H * f} y2={H * f} />
        ))}
      </g>

      {/* recuadro del patrón */}
      <rect
        x={left + firstPattern * slot + 2}
        y="8"
        width={patternCount * slot - 4}
        height={H - 14}
        rx="11"
        fill="#fff"
        fillOpacity="0.7"
        stroke={color}
        strokeOpacity="0.55"
        strokeDasharray="4 4"
        strokeWidth="1.5"
        className="transition-opacity duration-300 group-hover:[stroke-opacity:1]"
        style={{ opacity: shown ? 1 : 0, transition: 'opacity 600ms ease 300ms' }}
      />

      {firstPattern > 0 && labelY !== null && (
        <text x={left + 4} y={labelY} fontFamily={FONT} fontSize="10.5" fill="#94a3b8">
          Tendencia previa
        </text>
      )}

      {candles.map((k, i) => {
        const x = left + (i + 0.5) * slot
        const c = k.neutral ? NEUTRAL : k.c >= k.o ? UP : DOWN
        const gid = k.neutral ? 'n' : k.c >= k.o ? 'u' : 'd'
        const yOpen = yOf(k.o)
        const yClose = yOf(k.c)
        return (
          <g
            key={i}
            opacity={k.context ? 0.42 : 1}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              transform: shown ? 'scaleY(1)' : 'scaleY(0.05)',
              transition: 'transform 520ms cubic-bezier(.22,1,.36,1), opacity 400ms ease',
              transitionDelay: `${i * 70}ms`,
            }}
          >
            <line x1={x} x2={x} y1={yOf(k.h)} y2={yOf(k.l)} stroke={c.stroke} strokeWidth="2.6" strokeLinecap="round" />
            <rect
              x={x - bodyW / 2}
              y={Math.min(yOpen, yClose)}
              width={bodyW}
              height={Math.max(Math.abs(yClose - yOpen), 3)}
              rx="3.5"
              fill={`url(#${uid}-${gid})`}
              stroke={c.stroke}
              strokeWidth="1.6"
            />
          </g>
        )
      })}

      {/* número de cada vela del patrón */}
      {patternCount > 1 &&
        candles.map((k, i) =>
          k.context ? null : (
            <g key={'n' + i} style={{ opacity: shown ? 1 : 0, transition: 'opacity 500ms ease 700ms' }}>
              <circle cx={left + (i + 0.5) * slot} cy={H - 18} r="9" fill={color} />
              <text x={left + (i + 0.5) * slot} y={H - 14.2} textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="700" fill="#fff">
                {i - firstPattern + 1}
              </text>
            </g>
          ),
        )}

      {/* qué anuncia */}
      {signal && (
        <g transform={`translate(${ax} ${H / 2 - 4})`} style={{ opacity: shown ? 1 : 0, transition: 'opacity 600ms ease 900ms' }}>
          <circle r="19" fill={color} fillOpacity="0.12" />
          {signal === 'pause' ? (
            <g className="pi-pause" fill={color}>
              <rect x="-8" y="-11" width="5.5" height="22" rx="2.5" />
              <rect x="2.5" y="-11" width="5.5" height="22" rx="2.5" />
            </g>
          ) : (
            <g className={signal === 'up' ? 'pi-up' : 'pi-down'} fill="none" stroke={color} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
              {signal === 'up' ? <path d="M0 12V-11M-9 -2L0 -11L9 -2" /> : <path d="M0 -12V11M-9 2L0 11L9 2" />}
            </g>
          )}
        </g>
      )}
    </svg>
  )
}