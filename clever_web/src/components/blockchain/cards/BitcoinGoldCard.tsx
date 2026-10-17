import React, { useEffect, useState } from 'react'
import { BlockchainCard } from '../BlockchainCard'
import { BITCOIN } from '../BlockchainData'
import { BC_ICONS } from '../BlockchainIcons'
import { BitcoinCoin } from '../BlockchainIllustrations'
import { Callout, Eyebrow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

const CheckIcon = BC_ICONS.check
const RING_R = 36
const RING_C = 2 * Math.PI * RING_R

/** Manchas pastel difuminadas que se desvanecen solas dentro de la tarjeta. */
const GLOW =
  'radial-gradient(ellipse 40% 55% at 6% 8%, rgba(253,230,138,0.5) 0%, rgba(253,230,138,0) 100%),' +
  'radial-gradient(ellipse 40% 55% at 96% 96%, rgba(221,214,254,0.5) 0%, rgba(221,214,254,0) 100%),' +
  'radial-gradient(ellipse 28% 40% at 94% 6%, rgba(186,230,253,0.4) 0%, rgba(186,230,253,0) 100%)'

const PANEL = 'rounded-xl border border-slate-200 bg-white/70 p-5'

/** Pasa a `true` justo después de montarse: permite que las barras crezcan una vez al aparecer. */
function useGrown(): boolean {
  const [grown, setGrown] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setGrown(true), 60)
    return () => window.clearTimeout(id)
  }, [])
  return grown
}

/* 1. Escasez y datos clave */
const DataPanel: React.FC = () => {
  const grown = useGrown()
  const pct = (BITCOIN.circulatingMillions / BITCOIN.maxMillions) * 100

  return (
    <>
      <Eyebrow className="text-indigo-500">Escasez</Eyebrow>
      <h4 className="mt-0.5 text-2xl font-semibold text-slate-900">Un suministro limitado y programado</h4>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{BITCOIN.intro}</p>

      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          <span className="font-medium text-amber-700">
            En circulación ~{BITCOIN.circulatingMillions} millones ({BITCOIN.updated})
          </span>
          <span className="text-slate-500">Límite: {BITCOIN.maxMillions} millones</span>
        </div>
        <div
          role="img"
          aria-label={`Aproximadamente ${BITCOIN.circulatingMillions} millones de ${BITCOIN.maxMillions} millones en circulación`}
          className="h-3 overflow-hidden rounded-full bg-slate-200/70"
        >
          <div
            style={{ width: grown ? `${pct}%` : '0%' }}
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-400 transition-[width] duration-[1400ms] ease-out motion-reduce:transition-none"
          />
        </div>
      </div>

      <dl className="mt-4 grid gap-2.5 sm:grid-cols-3">
        {BITCOIN.facts.map((f) => (
          <div key={f.label} className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{f.label}</dt>
            <dd className="mt-0.5 text-[15px] font-semibold leading-snug text-slate-900">{f.value}</dd>
            {f.note && <p className="text-xs text-slate-500">{f.note}</p>}
          </div>
        ))}
      </dl>
    </>
  )
}

/* 2. Emisión y halving */
const HalvingPanel: React.FC = () => {
  const grown = useGrown()
  const H = BITCOIN.halving
  const max = H.steps[0].reward

  return (
    <>
      <Eyebrow className="text-indigo-500">Emisión</Eyebrow>
      <h4 className="mt-0.5 text-2xl font-semibold text-slate-900">Halving: la recompensa se reduce a la mitad</h4>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{H.text}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem]">
        <figure className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
          <figcaption className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Recompensa por bloque (BTC)</figcaption>
          <div className="mt-3 flex h-40 items-end gap-3" role="img" aria-label="Recompensa por bloque: 50, 25, 12.5, 6.25, 3.125 y, en el próximo halving, 1.5625 bitcoins">
            {H.steps.map((s) => (
              <div key={s.year} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
                <span className={`mb-1 text-xs tabular-nums ${s.current ? 'font-semibold text-amber-700' : 'text-slate-500'}`}>{s.reward}</span>
                <div
                  style={{ height: grown ? `${Math.max(4, (s.reward / max) * 100)}%` : '0%' }}
                  className={`w-full rounded-t-md transition-[height] duration-[1200ms] ease-out motion-reduce:transition-none ${
                    s.current ? 'bg-gradient-to-t from-amber-400 to-amber-300' : s.next ? 'border border-dashed border-slate-300 bg-slate-50' : 'bg-slate-200'
                  }`}
                />
              </div>
            ))}
          </div>
          <div className="mt-1.5 flex gap-3 text-[11px] text-slate-500">
            {H.steps.map((s) => (
              <span key={s.year} className="min-w-0 flex-1 text-center">
                {s.year}
                {s.current && <span className="block font-semibold text-amber-700">actual</span>}
                {s.next && <span className="block text-slate-400">próximo</span>}
              </span>
            ))}
          </div>
        </figure>

        <dl className="space-y-2.5">
          {H.facts.map((f) => (
            <div key={f.label} className="rounded-lg border border-slate-200 bg-white px-3.5 py-2.5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{f.label}</dt>
              <dd className="mt-0.5 text-lg font-semibold text-slate-900">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}

/* 3. ¿Por qué vale tanto? */
const WhyPanel: React.FC = () => {
  const grown = useGrown()
  const W = BITCOIN.why

  return (
    <>
      <Eyebrow className="text-indigo-500">Valor</Eyebrow>
      <h4 className="mt-0.5 text-2xl font-semibold leading-tight text-slate-900">{W.question}</h4>
      <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{W.lead}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 96 96" role="img" aria-label="Más del 50 % del poder de cómputo global" className="h-20 w-20 shrink-0">
              <circle cx="48" cy="48" r={RING_R} fill="none" stroke="#e2e8f0" strokeWidth="9" />
              <circle
                cx="48"
                cy="48"
                r={RING_R}
                fill="none"
                stroke="#818cf8"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={grown ? RING_C * 0.5 : RING_C}
                transform="rotate(-90 48 48)"
                className="transition-[stroke-dashoffset] duration-[1400ms] ease-out motion-reduce:transition-none"
              />
              <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill="#4338ca" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                &gt;50%
              </text>
            </svg>
            <div>
              <h5 className="text-base font-semibold text-slate-900">{W.attackTitle}</h5>
              <p className="mt-1 text-sm leading-snug text-slate-600">{W.attack}</p>
            </div>
          </div>
          <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
            {W.costs.map((c, i) => (
              <li key={c} className="flex items-start gap-2.5 text-sm leading-snug text-slate-700">
                <span aria-hidden="true" className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-slate-900 text-[11px] font-semibold text-white">
                  {i + 1}
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h5 className="text-base font-semibold text-slate-900">{W.goldTitle}</h5>
          <ul className="mt-2.5 space-y-2">
            {W.gold.map((g) => (
              <li key={g} className="flex items-start gap-2.5 text-sm leading-snug text-slate-700">
                <CheckIcon className="mt-px h-4 w-4 shrink-0 text-amber-600" />
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Callout className="mt-4">{W.secure}</Callout>
    </>
  )
}

/** Tarjeta 9: Bitcoin, el oro digital — escasez, emisión (halving) y por qué vale tanto. */
export const BitcoinGoldCard: React.FC<CardProps> = ({ className, index }) => {
  const [selected, setSelected] = useState('data')

  return (
    <BlockchainCard variant="formal" glow={GLOW} number="9" title="Bitcoin: el oro digital" tone="amber" className={className} index={index}>
      <div className="grid gap-5 md:grid-cols-[16rem_minmax(0,1fr)]">
        <div>
          <div className="mx-auto w-28">
            <BitcoinCoin />
          </div>
          <div role="group" aria-label="Temas de Bitcoin" className="mt-2 space-y-1.5">
            {BITCOIN.topics.map((t, i) => {
              const on = t.id === selected
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelected(t.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                    on ? 'bg-white shadow-sm ring-1 ring-indigo-200' : 'hover:bg-white/60'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-semibold tabular-nums transition-colors duration-200 ${on ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-sm leading-tight ${on ? 'font-semibold text-indigo-900' : 'font-medium text-slate-700'}`}>{t.label}</span>
                    <span className="sr-only">: </span>
                    <span className="block text-xs leading-tight text-slate-500">{t.sub}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div aria-live="polite" className={`${PANEL} min-h-[25rem] min-w-0`}>
          <div key={selected} className="bc-fade">
            {selected === 'data' && <DataPanel />}
            {selected === 'halving' && <HalvingPanel />}
            {selected === 'why' && <WhyPanel />}
          </div>
        </div>
      </div>
    </BlockchainCard>
  )
}