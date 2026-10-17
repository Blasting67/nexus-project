import React, { useId, useState } from 'react'

/* ------------------------------------------------------------------ */
/* Estructura de una vela japonesa: anatomía grande e interactiva     */
/* ------------------------------------------------------------------ */

type PartId = 'wickTop' | 'body' | 'wickBottom' | 'high' | 'low' | 'openClose'

const PARTS: Record<PartId, { title: string; text: string }> = {
  wickTop: {
    title: 'Mecha superior',
    text: 'Va del cuerpo hasta el precio máximo. Una mecha superior larga indica que el precio subió, pero no logró mantenerse arriba.',
  },
  body: {
    title: 'Cuerpo',
    text: 'Muestra la diferencia entre el precio de apertura y el de cierre. Es verde si el precio cerró por encima de donde abrió y rojo si cerró por debajo.',
  },
  wickBottom: {
    title: 'Mecha inferior',
    text: 'Va del cuerpo hasta el precio mínimo. Una mecha inferior pronunciada sugiere que los compradores lograron rechazar precios más bajos antes del cierre.',
  },
  high: { title: 'Máximo', text: 'El precio más alto alcanzado durante el periodo evaluado.' },
  low: { title: 'Mínimo', text: 'El precio más bajo alcanzado durante el periodo evaluado.' },
  openClose: {
    title: 'Apertura y cierre',
    text: 'En una vela alcista se abre abajo y se cierra arriba (cierre mayor que apertura). En una bajista ocurre al revés.',
  },
}

const CHIPS: PartId[] = ['wickTop', 'body', 'wickBottom', 'high', 'low', 'openClose']

const VW = 680
const VH = 470
const C1 = 210 // centro de la vela alcista
const C2 = 470 // centro de la vela bajista
const MID = (C1 + C2) / 2
const Y = { high: 52, top: 130, bottom: 296, low: 376 }
const BW = 88 // ancho del cuerpo
const FONT = 'ui-sans-serif, system-ui, sans-serif'

const UP = { top: '#6ee7b7', bottom: '#10b981', stroke: '#059669' }
const DOWN = { top: '#fda4af', bottom: '#f43f5e', stroke: '#e11d48' }

const CSS = `
.cs-pulse{animation:cs-pulse 1.8s ease-in-out infinite}
@keyframes cs-pulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:.9;transform:scale(1.06)}}
@media (prefers-reduced-motion:reduce){.cs-pulse{animation:none!important}}
`

/**
 * Parte "Estructura de una Vela Japonesa".
 * Dos velas grandes con sus partes rotuladas. Al pasar el mouse (o tocar) una parte, o su botón, se resalta en ambas
 * velas y se explica a la derecha.
 *
 *   import { CandlestickStructure } from '../components/analysis/CandlestickStructure'
 *   <CandlestickStructure />
 */
export const CandlestickStructure: React.FC = () => {
  const uid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<PartId | null>(null)
  const [pinned, setPinned] = useState<PartId | null>(null)
  const active = hover ?? pinned

  const bind = (id: PartId) => ({
    onPointerEnter: () => setHover(id),
    onPointerLeave: () => setHover(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
    style: { cursor: 'pointer', opacity: active && active !== id ? 0.28 : 1, transition: 'opacity 250ms ease' } as React.CSSProperties,
  })
  const on = (id: PartId) => active === id

  /** Rótulo con línea guía hacia un punto de la vela. side: izquierda o derecha del dibujo. */
  const Callout: React.FC<{ part: PartId; text: string; y: number; tx: number; side: 'l' | 'r'; color: string }> = ({ part, text, y, tx, side, color }) => {
    const lx = side === 'l' ? 138 : 542
    return (
      <g {...bind(part)}>
        <line x1={side === 'l' ? lx + 8 : lx - 8} x2={tx} y1={y} y2={y} stroke="#94a3b8" strokeWidth="1.8" strokeDasharray="4 4" />
        <circle cx={tx} cy={y} r={on(part) ? 7 : 5} fill="#fff" stroke={color} strokeWidth="3" style={{ transition: 'r 200ms ease' }} />
        <text x={lx} y={y + 5.5} textAnchor={side === 'l' ? 'end' : 'start'} fontFamily={FONT} fontSize="17.5" fontWeight="700" fill={on(part) ? '#312e81' : '#334155'}>
          {text}
        </text>
      </g>
    )
  }

  /** Etiqueta del centro (nombre de la parte) con guías hacia las dos velas. */
  const Mid: React.FC<{ part: PartId; text: string; y: number }> = ({ part, text, y }) => {
    const w = text.length * 9.4 + 38
    return (
      <g {...bind(part)}>
        <line x1={C1 + BW / 2 + 4} x2={MID - w / 2} y1={y} y2={y} stroke="#a5b4fc" strokeWidth="1.8" strokeDasharray="3 5" />
        <line x1={MID + w / 2} x2={C2 - BW / 2 - 4} y1={y} y2={y} stroke="#a5b4fc" strokeWidth="1.8" strokeDasharray="3 5" />
        <rect x={MID - w / 2} y={y - 17} width={w} height="34" rx="17" fill={on(part) ? '#4f46e5' : '#fff'} stroke={on(part) ? '#4f46e5' : '#c7d2fe'} strokeWidth="1.8" />
        <text x={MID} y={y + 5.6} textAnchor="middle" fontFamily={FONT} fontSize="15.5" fontWeight="700" fill={on(part) ? '#fff' : '#4338ca'}>
          {text}
        </text>
      </g>
    )
  }

  /** Una vela: mecha superior, cuerpo y mecha inferior (cada parte reacciona al puntero). */
  const Candle: React.FC<{ cx: number; up: boolean; delay: number }> = ({ cx, up, delay }) => {
    const c = up ? UP : DOWN
    const g = `url(#${uid}-${up ? 'u' : 'd'})`
    const grow = (d: number): React.CSSProperties => ({ transformBox: 'fill-box', transformOrigin: 'center', animation: `cs-in 700ms cubic-bezier(.22,1,.36,1) ${delay + d}ms both` })
    return (
      <g>
        <g {...bind('wickTop')}>
          <line x1={cx} x2={cx} y1={Y.high} y2={Y.top} stroke={c.stroke} strokeWidth={on('wickTop') ? 11 : 7} strokeLinecap="round" style={grow(0)} />
        </g>
        <g {...bind('wickBottom')}>
          <line x1={cx} x2={cx} y1={Y.bottom} y2={Y.low} stroke={c.stroke} strokeWidth={on('wickBottom') ? 11 : 7} strokeLinecap="round" style={grow(80)} />
        </g>
        <g {...bind('body')}>
          {on('body') && <rect x={cx - BW / 2 - 8} y={Y.top - 8} width={BW + 16} height={Y.bottom - Y.top + 16} rx="16" fill="none" stroke={c.stroke} strokeWidth="3" className="cs-pulse" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />}
          <rect x={cx - BW / 2} y={Y.top} width={BW} height={Y.bottom - Y.top} rx="9" fill={g} stroke={c.stroke} strokeWidth="2.6" style={grow(40)} />
          <rect x={cx - BW / 2 + 8} y={Y.top + 8} width={BW - 16} height="18" rx="6" fill="#fff" fillOpacity="0.3" />
        </g>
      </g>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80">
      <style>{CSS + '@keyframes cs-in{from{opacity:0;transform:scaleY(.05)}to{opacity:1;transform:scaleY(1)}}'}</style>
      <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.3) 0%, transparent 68%)' }} />

      <div className="relative grid grid-cols-1 items-center gap-7 lg:grid-cols-[1.85fr_1fr]">
        {/* dibujo */}
        <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-violet-50 p-3 ring-1 ring-white/80">
          <svg viewBox={`0 0 ${VW} ${VH}`} role="img" aria-label="Anatomía de una vela alcista y una vela bajista, con sus partes rotuladas" className="h-full w-full">
            <defs>
              <linearGradient id={`${uid}-u`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={UP.top} />
                <stop offset="100%" stopColor={UP.bottom} />
              </linearGradient>
              <linearGradient id={`${uid}-d`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={DOWN.top} />
                <stop offset="100%" stopColor={DOWN.bottom} />
              </linearGradient>
            </defs>

            <g stroke="#0f172a" strokeOpacity="0.06" strokeDasharray="3 6">
              {[120, 220, 320].map((y) => (
                <line key={y} x1="14" x2={VW - 14} y1={y} y2={y} />
              ))}
            </g>

            <Candle cx={C1} up delay={0} />
            <Candle cx={C2} up={false} delay={160} />

            {/* nombres de las partes, en el centro */}
            <Mid part="wickTop" text="Mecha superior" y={(Y.high + Y.top) / 2 + 4} />
            <Mid part="body" text="Cuerpo" y={(Y.top + Y.bottom) / 2} />
            <Mid part="wickBottom" text="Mecha inferior" y={(Y.bottom + Y.low) / 2 - 4} />

            {/* precios: vela alcista (izquierda) y bajista (derecha) */}
            <Callout part="high" text="Máximo" y={Y.high} tx={C1 - 2} side="l" color={UP.stroke} />
            <Callout part="openClose" text="Cierre" y={Y.top} tx={C1 - BW / 2} side="l" color={UP.stroke} />
            <Callout part="openClose" text="Apertura" y={Y.bottom} tx={C1 - BW / 2} side="l" color={UP.stroke} />
            <Callout part="low" text="Mínimo" y={Y.low} tx={C1 - 2} side="l" color={UP.stroke} />
            <Callout part="high" text="Máximo" y={Y.high} tx={C2 + 2} side="r" color={DOWN.stroke} />
            <Callout part="openClose" text="Apertura" y={Y.top} tx={C2 + BW / 2} side="r" color={DOWN.stroke} />
            <Callout part="openClose" text="Cierre" y={Y.bottom} tx={C2 + BW / 2} side="r" color={DOWN.stroke} />
            <Callout part="low" text="Mínimo" y={Y.low} tx={C2 + 2} side="r" color={DOWN.stroke} />

            {/* nombres de cada vela */}
            {[
              { cx: C1, name: 'Vela Alcista', sub: 'Cierre > Apertura', color: UP.stroke, bg: '#d1fae5' },
              { cx: C2, name: 'Vela Bajista', sub: 'Cierre < Apertura', color: DOWN.stroke, bg: '#ffe4e6' },
            ].map((v) => (
              <g key={v.name} fontFamily={FONT} textAnchor="middle">
                <rect x={v.cx - 70} y="404" width="140" height="34" rx="17" fill={v.bg} stroke={v.color} strokeOpacity="0.5" />
                <text x={v.cx} y="426" fontSize="16" fontWeight="800" fill={v.color}>
                  {v.name}
                </text>
                <text x={v.cx} y="461" fontSize="14.5" fill="#64748b" fontFamily="ui-monospace, monospace">
                  {v.sub}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* explicación */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-500">Anatomía</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Estructura de una Vela Japonesa</h2>

          {/* todas las explicaciones ocupan la misma celda: la altura no cambia al pasar de una a otra y los botones no se mueven */}
          <div className="mt-4 grid rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100" aria-live="polite">
            {([null, ...CHIPS] as Array<PartId | null>).map((id) => {
              const visible = active === id
              return (
                <div
                  key={id ?? 'general'}
                  aria-hidden={!visible}
                  className={`col-start-1 row-start-1 transition-opacity duration-300 ${visible ? 'opacity-100' : 'invisible opacity-0'}`}
                >
                  {id ? (
                    <>
                      <p className="flex items-center gap-2 text-[15px] font-bold text-indigo-700">
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100" />
                        {PARTS[id].title}
                      </p>
                      <p className="mt-2 text-[14px] leading-relaxed text-slate-700">{PARTS[id].text}</p>
                    </>
                  ) : (
                    <div className="space-y-3 text-[14px] leading-relaxed text-slate-600">
                      <p>
                        El cuerpo muestra la diferencia entre el precio de apertura y el de cierre. Las mechas señalan los precios extremos alcanzados durante el periodo evaluado.
                      </p>
                      <p>Una mecha inferior pronunciada sugiere que los compradores lograron rechazar precios más bajos antes del cierre.</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mt-4 text-xs font-medium text-slate-400">Pasa el mouse o toca una parte para resaltarla:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CHIPS.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={pinned === id}
                onPointerEnter={() => setHover(id)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(id)}
                onBlur={() => setHover(null)}
                onClick={() => setPinned((p) => (p === id ? null : id))}
                className={`rounded-full px-3 py-1.5 text-[13px] font-semibold ring-1 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  active === id ? 'bg-indigo-600 text-white ring-indigo-600 shadow-md shadow-indigo-200' : 'bg-white text-indigo-700 ring-indigo-200 hover:bg-indigo-50'
                }`}
              >
                {PARTS[id].title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}