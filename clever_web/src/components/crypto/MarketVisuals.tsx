import React from 'react'

/* Piezas visuales de la tarjeta "Estado del Mercado".
   Movimiento sobrio: entrada escalonada (una vez), un reflejo y una órbita muy lentos, y resaltado al interactuar.
   Todo se desactiva con "reducir movimiento". */

export type MarketFocus = 'btc' | 'alt' | null

const CSS = `
@keyframes ms-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
@keyframes ms-in-l{from{opacity:0;transform:translateX(-22px)}to{opacity:1;transform:none}}
@keyframes ms-in-r{from{opacity:0;transform:translateX(22px)}to{opacity:1;transform:none}}
@keyframes ms-pop{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:none}}
@keyframes ms-tick{from{opacity:0}to{opacity:1}}
@keyframes ms-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@keyframes ms-sheen{0%,60%{transform:translateX(-170%) skewX(-18deg)}100%{transform:translateX(440%) skewX(-18deg)}}
@keyframes ms-spin{to{transform:rotate(360deg)}}
@keyframes ms-spin-rev{to{transform:rotate(-360deg)}}
@keyframes ms-breathe{0%,100%{opacity:.78}50%{opacity:1}}
@keyframes ms-ring{0%{opacity:.5;transform:scale(.7)}100%{opacity:0;transform:scale(2.4)}}
.ms-in{animation:ms-in .9s cubic-bezier(.22,1,.36,1) both}
.ms-in-l{animation:ms-in-l .95s cubic-bezier(.22,1,.36,1) both}
.ms-in-r{animation:ms-in-r .95s cubic-bezier(.22,1,.36,1) both}
.ms-pop{animation:ms-pop 1s cubic-bezier(.22,1,.36,1) both}
.ms-tick{animation:ms-tick .5s ease-out both}
.ms-fade{animation:ms-fade .35s ease-out both}
.ms-sheen{animation:ms-sheen 9s ease-in-out infinite}
.ms-orbit{animation:ms-spin 90s linear infinite}
.ms-orbit-rev{animation:ms-spin-rev 90s linear infinite}
.ms-breathe{animation:ms-breathe 12s ease-in-out infinite}
.ms-ring{animation:ms-ring 4s ease-out infinite;transform-box:fill-box;transform-origin:center}
@media (prefers-reduced-motion:reduce){
  .ms-in,.ms-in-l,.ms-in-r,.ms-pop,.ms-tick,.ms-fade,.ms-sheen,.ms-orbit,.ms-orbit-rev,.ms-breathe,.ms-ring{animation:none!important}
}
`

export const MarketStyles: React.FC = () => <style>{CSS}</style>

/** Moneda de Bitcoin: degradado suave, anillo fino y un reflejo metálico que la cruza cada pocos segundos. */
export const BitcoinMark: React.FC = () => (
  <div aria-hidden="true" className="relative flex h-40 w-40 items-center justify-center">
    <span className="absolute inset-0 rounded-full border border-amber-200" />
    <span className="absolute inset-3 rounded-full border border-dashed border-amber-200/80" />
    <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 shadow-sm ring-1 ring-amber-300/70 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none">
      <span className="absolute inset-1.5 rounded-full border border-white/60" />
      <span className="text-6xl font-semibold text-amber-900/70">₿</span>
      <span className="ms-sheen pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/55 to-transparent" />
    </div>
  </div>
)

const ORBIT = 64
const SATELLITES = ['◎', '✕', '◈', '⬡', '▲', '◆'].map((glyph, i, all) => {
  const a = (i / all.length) * Math.PI * 2 - Math.PI / 2
  return { glyph, x: Math.cos(a) * ORBIT, y: Math.sin(a) * ORBIT }
})

/** Altcoins: una moneda central (Ξ) y seis más en una órbita muy lenta (cada una se contra-rota para mantenerse derecha). */
export const AltcoinsMark: React.FC = () => (
  <div aria-hidden="true" className="relative flex h-40 w-40 items-center justify-center">
    <span className="absolute inset-[16px] rounded-full border border-dashed border-indigo-200" />
    <div className="ms-orbit absolute inset-0">
      {SATELLITES.map((s) => (
        <span key={s.glyph} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}>
          <span className="ms-orbit-rev flex h-8 w-8 items-center justify-center rounded-full bg-white text-[13px] text-indigo-500 shadow-sm ring-1 ring-indigo-200">{s.glyph}</span>
        </span>
      ))}
    </div>
    <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-gradient-to-br from-indigo-200 via-indigo-300 to-indigo-400 shadow-sm ring-1 ring-indigo-300/70 transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none">
      <span className="absolute inset-1 rounded-full border border-white/60" />
      <span className="text-4xl font-semibold text-indigo-900/70">Ξ</span>
    </div>
  </div>
)

const SIZE = 300
const CENTER = SIZE / 2
const RADIUS = 112
const STROKE = 24
const GAP = 0.8 // separación entre los dos arcos (en % de la circunferencia)

/**
 * Gráfico de dona con la dominancia. Los arcos crecen junto con el número (btcShown + altShown suman 100 al terminar).
 * Bitcoin ocupa el lado IZQUIERDO y Altcoins el DERECHO, igual que sus columnas; ambos parten de la marca superior.
 * La marca inferior es el 50 %: la perilla (el límite entre los dos arcos) queda más allá de ella hacia el lado que domina.
 * El arco de la parte enfocada se engrosa y el otro se atenúa.
 */
export const DominanceDonut: React.FC<{ btc: number; btcShown: number; altShown: number; focus: MarketFocus; children: React.ReactNode }> = ({ btc, btcShown, altShown, focus, children }) => {
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2 - Math.PI / 2
    const major = i % 10 === 0
    const mid = i % 5 === 0
    const half = i === 20 // la marca inferior es el 50 %
    const r1 = RADIUS + STROKE / 2 + 8
    const r2 = r1 + (half ? 15 : major ? 11 : mid ? 7 : 4)
    return { x1: CENTER + Math.cos(a) * r1, y1: CENTER + Math.sin(a) * r1, x2: CENTER + Math.cos(a) * r2, y2: CENTER + Math.sin(a) * r2, major, half }
  })

  const knobAngle = -(btcShown / 100) * Math.PI * 2 - Math.PI / 2 // Bitcoin crece hacia la izquierda
  const knob = { x: CENTER + Math.cos(knobAngle) * RADIUS, y: CENTER + Math.sin(knobAngle) * RADIUS }
  const arc = (on: boolean, dim: boolean): React.CSSProperties => ({
    strokeWidth: on ? STROKE + 6 : STROKE,
    opacity: dim ? 0.4 : 1,
    transition: 'stroke-width 300ms ease, opacity 300ms ease',
  })

  return (
    <div className="ms-pop relative mb-7 h-[21rem] w-[21rem] shrink-0" style={{ animationDelay: '0.45s' }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-full w-full overflow-visible" role="img" aria-label={`Gráfico de dona: Bitcoin ${btc}%, Altcoins ${100 - btc}%`}>
        <defs>
          <linearGradient id="md-btc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id="md-alt" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a5b4fc" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <line
            key={i}
            className="ms-tick"
            style={{ animationDelay: `${0.7 + i * 0.03}s` }}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={t.half ? '#64748b' : t.major ? '#94a3b8' : '#cbd5e1'}
            strokeWidth={t.half ? 2 : t.major ? 1.4 : 1}
            strokeLinecap="round"
          />
        ))}

        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#e2e8f0" strokeOpacity="0.7" strokeWidth={STROKE} />
        {/* reflejo horizontal: así Bitcoin queda a la izquierda y Altcoins a la derecha */}
        <g transform={`translate(${SIZE} 0) scale(-1 1) rotate(-90 ${CENTER} ${CENTER})`} fill="none">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} pathLength={100} stroke="url(#md-btc)" strokeDasharray={`${Math.max(0, btcShown - GAP)} 100`} strokeDashoffset={-GAP / 2} style={arc(focus === 'btc', focus === 'alt')} />
          <circle cx={CENTER} cy={CENTER} r={RADIUS} pathLength={100} stroke="url(#md-alt)" strokeDasharray={`${Math.max(0, altShown - GAP)} 100`} strokeDashoffset={-(btcShown + GAP / 2)} style={arc(focus === 'alt', focus === 'btc')} />
        </g>

        {/* perilla en el borde del arco de Bitcoin */}
        {btcShown > 0.5 && (
          <g>
            {btcShown >= btc - 0.05 && <circle className="ms-ring" cx={knob.x} cy={knob.y} r="9" fill="none" stroke="#f59e0b" strokeWidth="1.5" />}
            <circle cx={knob.x} cy={knob.y} r="7.5" fill="#fff" stroke="#cbd5e1" strokeWidth="1.5" />
            <circle cx={knob.x} cy={knob.y} r="2.6" fill="#f59e0b" />
          </g>
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
      <span className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap text-xs text-slate-400">50 % · equilibrio</span>
    </div>
  )
}