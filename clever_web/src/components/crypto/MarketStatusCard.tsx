import React, { useState } from 'react'
import { InfoTip } from '../atlas/AtlasCard'
import { AltcoinsMark, BitcoinMark, DominanceDonut, MarketStyles } from './MarketVisuals'
import type { MarketFocus } from './MarketVisuals'
import { useCountUp } from './useCountUp'

/** Dominancia simulada de Bitcoin (0-100). Cámbialo para probar cómo cambian la dona y la barra. */
const BTC_DOMINANCE = 54

const INFO_TEXT =
  'El Estado del mercado muestra la dominancia actual de las criptomonedas, Altcoins son todas las criptomonedas que no sean Bitcoin.'

/* ------------------------------------------------------------------ */
/* Tarjeta "Estado del Mercado": sin marco, sobre un resplandor suave   */
/* ------------------------------------------------------------------ */

/** Dos resplandores pastel que se desvanecen por completo antes de llegar a los bordes (no hay marco). */
const AURA =
  'radial-gradient(ellipse 26% 46% at 25% 52%, rgba(253,230,138,0.5) 0%, rgba(254,243,199,0.22) 55%, rgba(255,255,255,0) 100%),' +
  'radial-gradient(ellipse 26% 46% at 75% 52%, rgba(199,210,254,0.6) 0%, rgba(224,231,255,0.26) 55%, rgba(255,255,255,0) 100%)'

const Arrow: React.FC<{ up: boolean }> = ({ up }) => (
  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {up ? <path d="M8 13V3M4 7l4-4 4 4" /> : <path d="M8 3v10M4 9l4 4 4-4" />}
  </svg>
)

/** Entrada escalonada: se espera a que la pantalla termine de llegar y cada pieza aparece en su turno. */
const delay = (s: number): React.CSSProperties => ({ animationDelay: `${s}s` })

export const MarketStatusCard: React.FC = () => {
  const btc = BTC_DOMINANCE
  const alt = 100 - btc
  // el conteo espera a que las columnas y la dona terminen de aparecer
  const btcShown = useCountUp(btc, 1600, 550)
  const altShown = useCountUp(alt, 1600, 550)
  const diff = Math.abs(btc - alt)

  // al pasar el mouse (o tocar) Bitcoin o Altcoins, la dona y la barra resaltan esa parte
  const [hover, setHover] = useState<MarketFocus>(null)
  const [pinned, setPinned] = useState<MarketFocus>(null)
  const focus = hover ?? pinned
  const who = focus ?? 'btc'
  const bind = (id: 'btc' | 'alt') => ({
    onMouseEnter: () => setHover(id),
    onMouseLeave: () => setHover(null),
    onFocus: () => setHover(id),
    onBlur: () => setHover(null),
    onClick: () => setPinned((p) => (p === id ? null : id)),
    'aria-pressed': pinned === id,
  })

  const summary =
    diff === 0
      ? 'Mercado equilibrado'
      : btc > alt
        ? `Bitcoin domina el mercado por ${diff} ${diff === 1 ? 'punto' : 'puntos'}`
        : `Las altcoins dominan el mercado por ${diff} ${diff === 1 ? 'punto' : 'puntos'}`

  const panel = 'group flex flex-col items-center rounded-2xl px-2 py-3 text-center transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300'

  return (
    <section aria-label="Estado del mercado" className="relative z-10 px-2 py-2 sm:px-6">
      <MarketStyles />
      <div aria-hidden="true" className="ms-breathe pointer-events-none absolute inset-0" style={{ background: AURA }} />

      <header className="ms-in relative text-center" style={delay(0.35)}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Dominancia de mercado</p>
        <div className="mt-1 flex items-center justify-center gap-2">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Estado del Mercado</h2>
          <InfoTip text={INFO_TEXT} align="right" />
        </div>
        <p className="mt-1 text-[15px] text-slate-500">Participación del mercado global</p>
      </header>

      <div className="relative mt-5 grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
        <button type="button" {...bind('btc')} className={`${panel} ms-in-l ${focus === 'btc' ? 'bg-amber-50/70' : ''}`} style={delay(0.5)}>
          <BitcoinMark />
          <span className="mt-2 block text-xl font-semibold text-slate-900">Bitcoin</span>
          <span className="block text-6xl font-semibold tabular-nums tracking-tight text-amber-600">{Math.round(btcShown)}%</span>
          <span className="mt-1 block min-h-[2.5rem] text-sm text-slate-500">del mercado global</span>
        </button>

        <DominanceDonut btc={btc} btcShown={btcShown} altShown={altShown} focus={focus}>
          <div key={who} className="ms-fade flex flex-col items-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{who === 'btc' ? 'Bitcoin' : 'Altcoins'}</span>
            <span className="text-7xl font-semibold tabular-nums tracking-tight text-slate-900">{Math.round(who === 'btc' ? btcShown : altShown)}%</span>
            <span className="mt-1 text-xs text-slate-500">dominancia</span>
            <span className="mt-3 h-px w-14 bg-slate-200" />
            <span className="mt-2 text-xs text-slate-500">
              {who === 'btc' ? 'Altcoins' : 'Bitcoin'}{' '}
              <span className={`font-semibold tabular-nums ${who === 'btc' ? 'text-indigo-700' : 'text-amber-700'}`}>{Math.round(who === 'btc' ? altShown : btcShown)}%</span>
            </span>
          </div>
        </DominanceDonut>

        <button type="button" {...bind('alt')} className={`${panel} ms-in-r ${focus === 'alt' ? 'bg-indigo-50/70' : ''}`} style={delay(0.5)}>
          <AltcoinsMark />
          <span className="mt-2 block text-xl font-semibold text-slate-900">Altcoins</span>
          <span className="block text-6xl font-semibold tabular-nums tracking-tight text-indigo-600">{Math.round(altShown)}%</span>
          <span className="mt-1 block min-h-[2.5rem] max-w-[15rem] text-sm text-slate-500">Todas las criptomonedas que no son Bitcoin</span>
        </button>
      </div>

      <div className="relative mt-2">
        <p className="ms-in flex justify-center" style={delay(1.1)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm text-slate-600">
            {diff > 0 && <Arrow up={btc > alt} />}
            {summary}
          </span>
        </p>
      </div>
    </section>
  )
}