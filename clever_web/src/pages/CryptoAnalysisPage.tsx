import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BitcoinAtlas } from '../components/atlas/BitcoinAtlas'
import { InfoTip } from '../components/atlas/AtlasCard'

/* ------------------------------------------------------------------ */
/* Datos simulados                                                     */
/* ------------------------------------------------------------------ */

/** Dominancia simulada de Bitcoin (0-100). Cámbialo para probar cómo se inclina la barra. */
const BTC_DOMINANCE = 54

const MAX_TILT = 8 // grados máximos de inclinación
const TILT_PER_POINT = 1.2 // grados por cada punto de diferencia con 50%

const INFO_TEXT =
  'El Estado del mercado muestra la dominancia actual de las criptomonedas, Altcoins son todas las criptomonedas que no sean Bitcoin.'

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

/** Cuenta de 0 al valor final con una desaceleración suave. */
function useCountUp(target: number, duration = 1400): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return value
}

/* ------------------------------------------------------------------ */
/* Piezas visuales (solo se usan en esta página)                       */
/* ------------------------------------------------------------------ */

const SPARKS_LEFT = [
  { x: '10%', y: '18%', s: 'h-1.5 w-1.5', d: 0 },
  { x: '22%', y: '62%', s: 'h-1 w-1', d: 0.7 },
  { x: '6%', y: '48%', s: 'h-1 w-1', d: 1.3 },
  { x: '30%', y: '14%', s: 'h-1 w-1', d: 1.9 },
  { x: '18%', y: '82%', s: 'h-1.5 w-1.5', d: 0.4 },
]
const SPARKS_RIGHT = [
  { x: '88%', y: '20%', s: 'h-1.5 w-1.5', d: 0.3 },
  { x: '76%', y: '66%', s: 'h-1 w-1', d: 1 },
  { x: '94%', y: '52%', s: 'h-1 w-1', d: 1.6 },
  { x: '68%', y: '12%', s: 'h-1 w-1', d: 2.1 },
  { x: '82%', y: '84%', s: 'h-1.5 w-1.5', d: 0.6 },
]

const ORBIT_RADIUS = 54
const SATELLITES = [
  { glyph: '◎', bg: 'bg-teal-500' },
  { glyph: '✕', bg: 'bg-slate-700' },
  { glyph: '◈', bg: 'bg-violet-500' },
  { glyph: '⬡', bg: 'bg-sky-500' },
  { glyph: '▲', bg: 'bg-rose-500' },
  { glyph: '◆', bg: 'bg-orange-500' },
  { glyph: '✦', bg: 'bg-fuchsia-500' },
  { glyph: '●', bg: 'bg-indigo-400' },
].map((s, i, all) => {
  const a = (i / all.length) * Math.PI * 2 - Math.PI / 2
  return { ...s, x: Math.cos(a) * ORBIT_RADIUS, y: Math.sin(a) * ORBIT_RADIUS }
})

const BitcoinCoin: React.FC = () => (
  <div className="relative flex h-44 w-44 items-center justify-center">
    <span className="absolute h-36 w-36 animate-pulse rounded-full bg-amber-300/50 blur-2xl motion-reduce:animate-none" />
    <span className="absolute h-40 w-40 rounded-full border border-amber-200" />
    <span className="absolute h-36 w-36 animate-[spin_24s_linear_infinite] rounded-full border border-dashed border-amber-400/70 motion-reduce:animate-none" />

    <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 shadow-lg shadow-amber-400/40 ring-4 ring-amber-100 transition-transform duration-500 group-hover:scale-105">
      <span className="absolute inset-2 rounded-full border-2 border-white/50" />
      <span className="text-6xl font-bold text-white drop-shadow-[0_2px_4px_rgba(180,83,9,0.5)]">₿</span>
    </div>
  </div>
)

const AltcoinsOrb: React.FC = () => (
  <div className="relative flex h-44 w-44 items-center justify-center">
    <span className="absolute h-36 w-36 animate-pulse rounded-full bg-indigo-300/50 blur-2xl motion-reduce:animate-none" />
    <span className="absolute h-40 w-40 rounded-full border border-indigo-200" />
    <span className="absolute h-36 w-36 animate-[spin_30s_linear_infinite_reverse] rounded-full border border-dashed border-indigo-400/70 motion-reduce:animate-none" />

    <div className="relative h-36 w-36 rounded-full bg-gradient-to-br from-indigo-100 via-indigo-200 to-violet-300 shadow-lg shadow-indigo-300/50 ring-4 ring-indigo-50 transition-transform duration-500 group-hover:scale-105">
      {/* satélites en órbita lenta (cada uno se contra-rota para mantenerse derecho) */}
      <div className="absolute inset-0 animate-[spin_40s_linear_infinite] motion-reduce:animate-none">
        {SATELLITES.map((s) => (
          <span
            key={s.glyph}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `calc(50% + ${s.x}px)`, top: `calc(50% + ${s.y}px)` }}
          >
            <span
              className={`flex h-6 w-6 animate-[spin_40s_linear_infinite_reverse] items-center justify-center rounded-full text-[11px] text-white shadow motion-reduce:animate-none ${s.bg}`}
            >
              {s.glyph}
            </span>
          </span>
        ))}
      </div>

      <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-md shadow-indigo-500/40 ring-2 ring-white/70">
        Ξ
      </span>
    </div>
  </div>
)

/** Barra inferior tipo balanza: se inclina hacia el lado con más dominancia. */
const DominanceBeam: React.FC<{ btc: number }> = ({ btc }) => {
  const alt = 100 - btc
  const [settled, setSettled] = useState(false)

  // Al montar parte nivelada (50/50) y luego se inclina con una animación suave
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), 200)
    return () => window.clearTimeout(id)
  }, [])

  const angle = settled ? clamp(-(btc - 50) * TILT_PER_POINT, -MAX_TILT, MAX_TILT) : 0
  const leftPct = settled ? btc : 50

  return (
    <div
      className="relative mx-auto h-24 w-full max-w-xl"
      role="img"
      aria-label={`Dominancia: Bitcoin ${btc}%, Altcoins ${alt}%`}
    >
      {/* base y punto de apoyo */}
      <span className="absolute left-1/2 top-[70px] h-1 w-20 -translate-x-1/2 rounded-full bg-slate-200" />
      <svg viewBox="0 0 32 24" className="absolute left-1/2 top-[46px] h-6 w-8 -translate-x-1/2" aria-hidden="true">
        <path d="M16 0 L32 24 H0 Z" className="fill-slate-300" />
      </svg>

      {/* barra que se inclina */}
      <div
        className="absolute inset-x-0 top-[40px] h-3 transition-transform duration-[1400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        <div className="flex h-full w-full overflow-hidden rounded-full shadow-md ring-1 ring-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
            style={{ width: `${leftPct}%` }}
          />
          <div className="h-full flex-1 bg-gradient-to-r from-indigo-400 to-violet-500" />
        </div>

        {/* "pesas" en cada extremo */}
        <span className="absolute -top-6 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-[11px] font-bold text-white shadow">
          ₿
        </span>
        <span className="absolute -top-6 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 text-[11px] font-bold text-white shadow">
          Ξ
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tarjeta "Estado del Mercado"                                        */
/* ------------------------------------------------------------------ */

const MarketStatusCard: React.FC = () => {
  const btc = BTC_DOMINANCE
  const alt = 100 - btc
  const btcShown = useCountUp(btc)
  const altShown = useCountUp(alt)
  const diff = Math.abs(btc - alt)

  const summary =
    diff === 0
      ? 'Mercado equilibrado'
      : btc > alt
        ? `Bitcoin domina el mercado por ${diff} ${diff === 1 ? 'punto' : 'puntos'}`
        : `Las altcoins dominan el mercado por ${diff} ${diff === 1 ? 'punto' : 'puntos'}`

  return (
    <section
      aria-label="Estado del mercado"
      className="relative z-10 rounded-3xl border border-slate-200 bg-white px-4 pb-6 pt-6 shadow-sm sm:px-8"
    >
      {/* fondo decorativo (recortado al borde redondeado) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute -right-24 top-1/4 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        {SPARKS_LEFT.map((p) => (
          <span
            key={`l-${p.x}-${p.y}`}
            className={`absolute animate-pulse rounded-full bg-amber-400/70 motion-reduce:animate-none ${p.s}`}
            style={{ left: p.x, top: p.y, animationDelay: `${p.d}s` }}
          />
        ))}
        {SPARKS_RIGHT.map((p) => (
          <span
            key={`r-${p.x}-${p.y}`}
            className={`absolute animate-pulse rounded-full bg-indigo-400/70 motion-reduce:animate-none ${p.s}`}
            style={{ left: p.x, top: p.y, animationDelay: `${p.d}s` }}
          />
        ))}
      </div>

      <div className="absolute right-4 top-4 z-20">
        <InfoTip text={INFO_TEXT} align="right" />
      </div>

      <header className="relative text-center">
        <h2 className="text-lg font-semibold text-slate-900">Estado del Mercado</h2>
        <p className="text-sm text-slate-500">Participación del mercado global</p>
      </header>

      <div className="relative mt-4 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-slate-200 to-transparent sm:block"
        />

        <div className="group flex w-full flex-col items-center sm:flex-1">
          <BitcoinCoin />
          <div className="text-lg font-semibold text-slate-900">Bitcoin</div>
          <div className="text-3xl font-bold tabular-nums text-amber-600">{Math.round(btcShown)}%</div>
        </div>

        <span className="relative z-10 bg-white px-3 py-2 text-4xl font-black italic tracking-tight sm:w-24 sm:text-center">
          <span className="bg-gradient-to-br from-amber-500 to-indigo-600 bg-clip-text text-transparent">VS</span>
        </span>

        <div className="group flex w-full flex-col items-center sm:flex-1">
          <AltcoinsOrb />
          <div className="text-lg font-semibold text-slate-900">Altcoins</div>
          <div className="text-3xl font-bold tabular-nums text-indigo-600">{Math.round(altShown)}%</div>
        </div>
      </div>

      <div className="relative mt-4">
        <DominanceBeam btc={btc} />
        <p className="-mt-1 text-center text-xs text-slate-500">{summary}</p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export const CryptoAnalysisPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          to="/analisis"
          className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition duration-200 hover:border-amber-300 hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-95"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 4l-6 6 6 6" />
          </svg>
          Volver
        </Link>

        
      </div>
      <h1 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
        Análisis Técnico de Criptomonedas
        <h2 className="mt-1 text-sm font-normal text-[var(--text-muted)]">
          Haz click en las botones de ? para obtener más información sobre cada sección.
        </h2>
      </h1>

      <MarketStatusCard />
      <h2 className="mt-1 text-sm font-normal text-[var(--text-muted)]">
          Como interpretar indicadores de una Criptomoneda
      </h2>
      <BitcoinAtlas />
      
    </div>
  )
}