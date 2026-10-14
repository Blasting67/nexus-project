import React from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { BITCOIN } from '../BlockchainData'
import { BitcoinCoin } from '../BlockchainIllustrations'
import { useReveal } from '../../trading/useReveal'

interface CardProps {
  className?: string
  index?: number
}

const LockIcon = BC_ICONS.lock
const RING_R = 36
const RING_C = 2 * Math.PI * RING_R

/** 4.9 Bitcoin: el oro digital — datos clave, barra de oferta y por qué cuesta tanto atacar la red. */
export const BitcoinGoldCard: React.FC<CardProps> = ({ className, index }) => {
  const { ref, shown } = useReveal<HTMLDivElement>(0.25)
  const circulatingPct = (BITCOIN.circulatingMillions / BITCOIN.maxMillions) * 100

  return (
    <BlockchainCard number="4.9" title="Bitcoin: el oro digital" tone="amber" className={className} index={index}>
      <div ref={ref} className="grid items-center gap-6 lg:grid-cols-[10rem_minmax(0,1fr)_minmax(0,20rem)]">
        <div className="mx-auto w-36 lg:w-full">
          <BitcoinCoin />
        </div>

        <div>
          <dl className="space-y-0.5">
            {BITCOIN.facts.map((f, i) => (
              <div
                key={f.label}
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`group flex items-baseline justify-between gap-4 rounded-lg px-3 py-1.5 text-sm transition duration-500 ease-out hover:bg-amber-50/70 motion-reduce:transition-none ${
                  shown ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
                }`}
              >
                <dt className="flex items-center gap-2 text-slate-500">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 transition-transform duration-300 group-hover:scale-150 motion-reduce:transition-none" />
                  {f.label}
                </dt>
                <dd className="text-right font-semibold text-slate-800">{f.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 px-3">
            <div className="mb-1.5 flex justify-between text-xs text-slate-500">
              <span>En circulación</span>
              <span className="font-medium text-slate-600">
                ~{BITCOIN.circulatingMillions} de {BITCOIN.maxMillions} millones
              </span>
            </div>
            <div
              role="img"
              aria-label={`Aproximadamente ${BITCOIN.circulatingMillions} millones de ${BITCOIN.maxMillions} millones en circulación`}
              className="h-2.5 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                style={{ width: shown ? `${circulatingPct}%` : '0%' }}
                className="h-full rounded-full bg-gradient-to-r from-amber-200 to-amber-400 transition-[width] duration-[1600ms] ease-out motion-reduce:transition-none"
              />
            </div>
          </div>
        </div>

        <aside className="rounded-2xl bg-violet-50/60 p-5 ring-1 ring-violet-100">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-800">{BITCOIN.whyTitle}</h4>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-violet-400">
              <LockIcon className="h-4 w-4" />
            </span>
          </div>
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 96 96" role="img" aria-label="Más del 50% del poder de cómputo mundial" className="h-20 w-20 shrink-0">
              <circle cx="48" cy="48" r={RING_R} fill="none" stroke="#ede9fe" strokeWidth="9" />
              <circle
                cx="48"
                cy="48"
                r={RING_R}
                fill="none"
                stroke="#a78bfa"
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={shown ? RING_C * 0.5 : RING_C}
                transform="rotate(-90 48 48)"
                className="transition-[stroke-dashoffset] duration-[1600ms] ease-out motion-reduce:transition-none"
              />
              <text x="48" y="53" textAnchor="middle" fontSize="16" fontWeight="700" fill="#6d28d9" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                &gt;50%
              </text>
            </svg>
            <p className="text-sm leading-relaxed text-slate-600">{BITCOIN.why}</p>
          </div>
        </aside>
      </div>
    </BlockchainCard>
  )
}
