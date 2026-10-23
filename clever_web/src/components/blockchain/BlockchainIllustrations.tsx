import React from 'react'
import type { Layer, NetworkStandard } from './BlockchainData'

const vars = (v: Record<string, string | number>) => v as unknown as React.CSSProperties
const FONT = { fontFamily: 'ui-sans-serif, system-ui, sans-serif' }

/* ------------------------------------------------------------------ */
/* 4.1 Red de computadoras con un cuaderno compartido                  */
/* ------------------------------------------------------------------ */

export interface NetworkDemo {
  kind: 'write' | 'tamper'
  id: number
}

const CENTER = { x: 130, y: 105 }
const LAPTOPS = [
  { x: 52, y: 46 },
  { x: 208, y: 46 },
  { x: 52, y: 164 },
  { x: 208, y: 164 },
]
const TAMPERED = 3 // la copia que alguien intenta alterar

type LaptopState = 'idle' | 'write' | 'ok' | 'bad'

const Laptop: React.FC<{ x: number; y: number; state: LaptopState; demoId: number }> = ({ x, y, state, demoId }) => (
  <g transform={`translate(${x - 24} ${y - 20})`}>
    <g className={state === 'bad' ? 'bc-shake' : ''} key={state === 'bad' ? `bad-${demoId}` : 'still'}>
      <rect x="0" y="0" width="48" height="31" rx="4" fill="#fff" stroke={state === 'bad' ? '#fda4af' : '#94a3b8'} strokeWidth="1.6" />
      <rect x="6" y="6" width="28" height="3" rx="1.5" fill={state === 'bad' ? '#fecdd3' : '#e2e8f0'} />
      <rect x="6" y="12" width="21" height="3" rx="1.5" fill={state === 'bad' ? '#fecdd3' : '#e2e8f0'} />
      <rect x="6" y="18" width="32" height="3" rx="1.5" fill={state === 'bad' ? '#fecdd3' : '#e2e8f0'} />
      {state === 'write' && (
        <rect
          key={`line-${demoId}`}
          className="bc-grow bc-origin-l"
          x="6"
          y="24"
          width="26"
          height="3"
          rx="1.5"
          fill="#10b981"
        />
      )}
      <rect x="-5" y="33" width="58" height="4" rx="2" fill={state === 'bad' ? '#fecdd3' : '#cbd5e1'} />
    </g>

    {state === 'ok' && (
      <g key={`ok-${demoId}`} className="bc-pop">
        <circle cx="48" cy="2" r="7" fill="#d1fae5" stroke="#6ee7b7" />
        <path d="M44.5 2.2l2.3 2.3 4-4.4" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    )}
    {state === 'bad' && (
      <g key={`bad-badge-${demoId}`} className="bc-pop">
        <circle cx="48" cy="2" r="7" fill="#ffe4e6" stroke="#fda4af" />
        <path d="M45 -1l6 6M51 -1l-6 6" fill="none" stroke="#f43f5e" strokeWidth="1.8" strokeLinecap="round" />
      </g>
    )}
  </g>
)

/** Cuaderno compartido en cuatro computadoras. La demo escribe una línea en todas las copias o intenta alterar una. */
export const NetworkIllustration: React.FC<{ demo: NetworkDemo | null }> = ({ demo }) => {
  const kind = demo?.kind ?? null
  const id = demo?.id ?? 0

  const stateOf = (i: number): LaptopState => {
    if (kind === 'write') return 'write'
    if (kind === 'tamper') return i === TAMPERED ? 'bad' : 'ok'
    return 'idle'
  }

  return (
    <svg
      viewBox="0 0 260 210"
      role="img"
      aria-label="Cuatro computadoras conectadas que guardan la misma copia de un cuaderno compartido"
      className="h-auto w-full"
    >
      {/* conexiones */}
      <g fill="none" strokeLinecap="round" strokeWidth="1.8">
        {LAPTOPS.map((l, i) => {
          const bad = kind === 'tamper' && i === TAMPERED
          const good = kind === 'write'
          return (
            <line
              key={i}
              className={`bc-flow ${kind ? 'bc-flow-fast' : ''}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={l.x}
              y2={l.y + (i < 2 ? 12 : -8)}
              stroke={bad ? '#f43f5e' : good ? '#10b981' : '#94a3b8'}
            />
          )
        })}
      </g>

      {/* ondas al anotar */}
      {kind === 'write' &&
        [0, 0.25, 0.5].map((d) => (
          <circle
            key={`${id}-${d}`}
            className="bc-ring bc-origin-c"
            style={{ animationDelay: `${d}s` }}
            cx={CENTER.x}
            cy={CENTER.y}
            r="46"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.6"
          />
        ))}

      {/* cuaderno central */}
      <g className="bc-pulse bc-origin-c">
        <rect x="106" y="76" width="48" height="58" rx="7" fill="#fff" stroke="#4f46e5" strokeWidth="1.8" />
        <path d="M106 90h-4M106 104h-4M106 118h-4" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" />
        <rect x="116" y="88" width="28" height="3" rx="1.5" fill="#c7d2fe" />
        <rect x="116" y="97" width="20" height="3" rx="1.5" fill="#c7d2fe" />
        <rect x="116" y="106" width="28" height="3" rx="1.5" fill="#c7d2fe" />
        <rect x="116" y="115" width="14" height="3" rx="1.5" fill="#c7d2fe" />
        {kind === 'write' && (
          <rect key={`nb-${id}`} className="bc-grow bc-origin-l" x="116" y="123" width="22" height="3" rx="1.5" fill="#10b981" />
        )}
      </g>

      {LAPTOPS.map((l, i) => (
        <Laptop key={i} x={l.x} y={l.y} state={stateOf(i)} demoId={id} />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* 4.6 Pila de capas                                                   */
/* ------------------------------------------------------------------ */

// losas sobrias: grises, y la capa elegida en índigo
const SLAB = {
  idle: { top: '#f1f5f9', left: '#cbd5e1', right: '#94a3b8' },
  on: { top: '#e0e7ff', left: '#a5b4fc', right: '#6366f1' },
}

/** Cinco losas en perspectiva; la capa elegida se desplaza hacia afuera. */
export const LayersIllustration: React.FC<{ layers: Layer[]; selected: number }> = ({ layers, selected }) => (
  <svg viewBox="0 0 150 160" role="img" aria-label="Pila de cinco capas de blockchain" className="h-auto w-full">
    {[...layers]
      .map((layer, i) => ({ layer, i }))
      .reverse()
      .map(({ layer, i }) => {
        const cy = 26 + i * 25
        const on = i === selected
        const c = on ? SLAB.on : SLAB.idle
        return (
          <g
            key={layer.id}
            className="transition-transform duration-500 ease-out motion-reduce:transition-none"
            style={{ transform: `translate(${on ? 14 : 0}px, ${on ? -3 : 0}px)` }}
          >
            <path d={`M19 ${cy}L71 ${cy + 18}V${cy + 27}L19 ${cy + 9}Z`} fill={c.left} />
            <path d={`M71 ${cy + 18}L123 ${cy}V${cy + 9}L71 ${cy + 27}Z`} fill={c.right} />
            <path
              d={`M71 ${cy - 18}L123 ${cy}L71 ${cy + 18}L19 ${cy}Z`}
              fill={c.top}
              stroke={on ? c.right : '#ffffff'}
              strokeWidth={on ? 1.6 : 1}
              style={{ filter: on ? `drop-shadow(0 3px 4px ${c.right}66)` : 'none' }}
            />
          </g>
        )
      })}
  </svg>
)

/* ------------------------------------------------------------------ */
/* 4.7 Tres carreteras para el mismo dólar digital                     */
/* ------------------------------------------------------------------ */

const ROADS = [
  { id: 'erc20', label: 'ERC20', seconds: 4.6 },
  { id: 'trc20', label: 'TRC20', seconds: 3.2 }, // "rápido"
  { id: 'bep20', label: 'BEP20', seconds: 4.6 },
]

/** Un mismo USDT viajando por tres redes. La red elegida se resalta; con BTC (que no usa estándares de token) ninguna. */
export const RoadsIllustration: React.FC<{ selected: NetworkStandard['id'] }> = ({ selected }) => (
  <svg
    viewBox="0 0 240 92"
    role="img"
    aria-label="Un mismo USDT viajando por tres redes distintas, como carreteras paralelas: ERC20, TRC20 y BEP20"
    className="h-auto w-full"
  >
    {ROADS.map((r, i) => {
      const y = 8 + i * 28
      const on = selected === r.id
      return (
        <g key={r.id}>
          <text x="2" y={y + 14} fontSize="8.5" fontWeight="700" className={on ? 'fill-indigo-700' : 'fill-slate-400'} style={FONT}>
            {r.label}
          </text>
          <rect
            x="44"
            y={y}
            width="190"
            height="20"
            rx="10"
            className={`transition-colors duration-500 motion-reduce:transition-none ${on ? 'fill-indigo-100 stroke-indigo-300' : 'fill-slate-100 stroke-slate-200'}`}
          />
          <line x1="54" x2="224" y1={y + 10} y2={y + 10} className="stroke-white" strokeWidth="1.6" strokeDasharray="5 6" />
          <g className="bc-travel" style={vars({ '--bc-dist': '166px', '--bc-t': `${r.seconds}s` })}>
            <circle cx="56" cy={y + 10} r="7.5" className={on ? 'fill-indigo-200 stroke-indigo-400' : 'fill-slate-200 stroke-slate-300'} />
            <text x="56" y={y + 13} textAnchor="middle" fontSize="9" fontWeight="700" className={on ? 'fill-indigo-800' : 'fill-slate-500'} style={FONT}>
              $
            </text>
          </g>
        </g>
      )
    })}
  </svg>
)

/* ------------------------------------------------------------------ */
/* 4.9 Moneda de Bitcoin                                               */
/* ------------------------------------------------------------------ */

export const BitcoinCoin: React.FC = () => (
  <svg viewBox="0 0 160 170" role="img" aria-label="Moneda de Bitcoin" className="h-auto w-full">
    <defs>
      <radialGradient id="bc-coin-face" cx="35%" cy="28%" r="80%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="55%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#f59e0b" />
      </radialGradient>
      <radialGradient id="bc-coin-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="80" cy="154" rx="46" ry="6" fill="#0f172a" opacity="0.07" />
    <circle cx="80" cy="80" r="72" fill="url(#bc-coin-glow)" />
    <g className="bc-float">
      <circle cx="80" cy="80" r="52" fill="url(#bc-coin-face)" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="80" cy="80" r="42" fill="none" stroke="#fff" strokeOpacity="0.65" strokeWidth="2" />
      <g className="bc-spin bc-origin-c">
        <path d="M80 28a52 52 0 0 1 36.8 15.2" fill="none" stroke="#fff" strokeOpacity="0.75" strokeWidth="4" strokeLinecap="round" />
      </g>
      <text x="80" y="98" textAnchor="middle" fontSize="58" fontWeight="700" fill="#b45309" style={FONT}>
        ₿
      </text>
    </g>
  </svg>
)