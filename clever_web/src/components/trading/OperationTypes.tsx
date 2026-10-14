import React from 'react'
import { SectionHeading } from './SectionHeading'
import { useReveal } from './useReveal'

type Direction = 'up' | 'down'

interface OperationStyle {
  stroke: string
  areaStop: string
  badgeFill: string
  badgeStroke: string
  arrow: string
}

const STYLES: Record<Direction, OperationStyle> = {
  up: { stroke: '#34d399', areaStop: '#a7f3d0', badgeFill: '#d1fae5', badgeStroke: '#6ee7b7', arrow: '#10b981' },
  down: { stroke: '#fb7185', areaStop: '#fecdd3', badgeFill: '#ffe4e6', badgeStroke: '#fda4af', arrow: '#f43f5e' },
}

/** Pequeña ilustración de un movimiento ascendente (BUY) o descendente (SELL). */
const TrendIllustration: React.FC<{ direction: Direction; shown: boolean }> = ({ direction, shown }) => {
  const s = STYLES[direction]
  const up = direction === 'up'
  const line = up
    ? 'M12 72 L36 58 L52 64 L76 42 L92 50 L112 26 L126 32'
    : 'M12 18 L36 32 L52 26 L76 48 L92 40 L112 64 L126 58'
  const area = `${line} L126 84 L12 84 Z`
  const start = up ? { x: 12, y: 72 } : { x: 12, y: 18 }
  const badgeY = up ? 18 : 72
  const arrow = up ? 'M142 24 V12 M137 17 L142 12 L147 17' : 'M142 66 V78 M137 73 L142 78 L147 73'
  const gradId = `tp-${direction}-area`

  return (
    <svg
      viewBox="0 0 160 90"
      role="img"
      aria-label={up ? 'Ilustración de un precio que sube' : 'Ilustración de un precio que baja'}
      className="h-full w-full"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.areaStop} stopOpacity="0.75" />
          <stop offset="100%" stopColor={s.areaStop} stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={area}
        fill={`url(#${gradId})`}
        className={`transition-opacity duration-1000 motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <path
        d={line}
        fill="none"
        stroke={s.stroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        style={{ strokeDashoffset: shown ? 0 : 1, transition: 'stroke-dashoffset 1400ms ease-out' }}
      />
      <circle cx={start.x} cy={start.y} r="3.5" fill="#fff" stroke={s.stroke} strokeWidth="2" />

      {/* flecha: se desplaza un poco al pasar el mouse */}
      <g
        className={`transition-transform duration-500 motion-reduce:transition-none ${
          up ? 'group-hover:-translate-y-1' : 'group-hover:translate-y-1'
        }`}
      >
        <circle cx="142" cy={badgeY} r="11" fill={s.badgeFill} stroke={s.badgeStroke} strokeWidth="1.5" />
        <path d={arrow} fill="none" stroke={s.arrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

const OPERATIONS: Array<{
  direction: Direction
  label: string
  alias: string
  text: string
  panel: string
  tag: string
}> = [
  {
    direction: 'up',
    label: 'BUY',
    alias: 'Largo',
    text: 'Compras esperando que suba',
    panel: 'bg-emerald-50/60',
    tag: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  },
  {
    direction: 'down',
    label: 'SELL',
    alias: 'Corto',
    text: 'Vendes prestado esperando que baje',
    panel: 'bg-rose-50/60',
    tag: 'bg-rose-50 text-rose-700 ring-rose-100',
  },
]

/** Parte 1: tipos de operación (BUY y SELL). */
export const OperationTypes: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.2)

  return (
    <section ref={ref} aria-label="Tipos de operación">
      <SectionHeading title="Tipos de operación" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {OPERATIONS.map((op, i) => (
          <article
            key={op.label}
            style={{ transitionDelay: `${i * 100}ms` }}
            className={`transition duration-700 ease-out motion-reduce:transition-none ${
              shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <div className="group h-full rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
              <div className={`mb-4 h-28 rounded-xl p-2 ${op.panel}`}>
                <TrendIllustration direction={op.direction} shown={shown} />
              </div>

              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ring-1 ${op.tag}`}>
                  {op.label}
                </span>
                <span className="text-sm text-slate-400">{op.alias}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{op.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
