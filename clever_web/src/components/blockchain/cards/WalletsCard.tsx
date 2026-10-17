import React, { useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { PLATFORMS, WALLETS, WALLETS_INTRO } from '../BlockchainData'
import { Eyebrow, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

/** Tarjeta 2: Carteras — tres tipos que se eligen para ver su detalle, y las plataformas más conocidas. */
export const WalletsCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState(WALLETS[0].id)
  const selected = WALLETS.find((w) => w.id === selectedId) ?? WALLETS[0]

  return (
    <BlockchainCard variant="formal" glow={pastelGlow('violet', 'sky', 'peach')} number="2" title="Carteras" tone="violet" className={className} index={index}>
      <p className="max-w-3xl text-[15px] leading-relaxed text-slate-600">{WALLETS_INTRO}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div role="group" aria-label="Tipos de cartera" className="space-y-2">
          {WALLETS.map((w) => {
            const Icon = BC_ICONS[w.icon]
            const on = w.id === selectedId
            return (
              <button
                key={w.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelectedId(w.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  on ? 'border-indigo-500 bg-indigo-50/60' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors duration-200 ${
                    on ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span className="min-w-0">
                  <span className={`block text-sm font-semibold ${on ? 'text-indigo-900' : 'text-slate-800'}`}>{w.name}</span>
                  <span className="block text-xs leading-snug text-slate-500">{w.summary}</span>
                </span>
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className="min-h-[14.5rem] rounded-xl border border-slate-200 bg-white/70 p-5">
          <div key={selected.id} className="bc-fade">
            <Eyebrow className="text-indigo-500">Cartera</Eyebrow>
            <h4 className="mt-0.5 text-xl font-semibold text-slate-900">{selected.name}</h4>
            <dl className="mt-3 divide-y divide-slate-200">
              {selected.rows.map((r) => (
                <div key={r.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 first:pt-0 last:pb-0">
                  <dt className={`text-xs font-semibold uppercase tracking-wider ${r.risk ? 'text-amber-700' : 'text-slate-400'}`}>{r.label}</dt>
                  <dd className="text-sm leading-relaxed text-slate-700">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
        <Eyebrow className="mr-2 text-slate-400">Plataformas</Eyebrow>
        <ul className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <li key={p.name} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {p.name}
            </li>
          ))}
        </ul>
      </div>
    </BlockchainCard>
  )
}