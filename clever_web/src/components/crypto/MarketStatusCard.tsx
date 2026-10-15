import React from 'react'
import { InfoTip } from '../atlas/AtlasCard'
import { AltcoinsOrb, BitcoinCoin, DominanceBeam, SPARKS_LEFT, SPARKS_RIGHT } from './MarketVisuals'
import { useCountUp } from './useCountUp'

/** Dominancia simulada de Bitcoin (0-100). Cámbialo para probar cómo se inclina la barra. */
const BTC_DOMINANCE = 54

const INFO_TEXT =
  'El Estado del mercado muestra la dominancia actual de las criptomonedas, Altcoins son todas las criptomonedas que no sean Bitcoin.'

/* ------------------------------------------------------------------ */
/* Tarjeta "Estado del Mercado"                                        */
/* ------------------------------------------------------------------ */

export const MarketStatusCard: React.FC = () => {
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
