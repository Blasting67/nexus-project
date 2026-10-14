import React, { useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BLOCKCHAIN_TONES, BlockchainCard } from '../BlockchainCard'
import { PLATFORMS, WALLETS } from '../BlockchainData'

interface CardProps {
  className?: string
  index?: number
}

/** 4.5 Carteras: caja fuerte vs. bolsillo — tres tipos que se tocan para ver su detalle, y las plataformas. */
export const WalletsCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState(WALLETS[0].id)
  const selected = WALLETS.find((w) => w.id === selectedId) ?? WALLETS[0]
  const st = BLOCKCHAIN_TONES[selected.tone]

  return (
    <BlockchainCard number="4.5" title="Carteras: caja fuerte vs. bolsillo" tone="violet" className={className} index={index}>
      <div role="group" aria-label="Tipos de cartera" className="grid grid-cols-3 gap-2.5">
        {WALLETS.map((w) => {
          const Icon = BC_ICONS[w.icon]
          const t = BLOCKCHAIN_TONES[w.tone]
          const on = w.id === selectedId
          return (
            <button
              key={w.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(w.id)}
              className={`group flex flex-col items-center gap-2 rounded-2xl px-2 py-3.5 text-center ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                on ? `${t.selected} shadow-sm` : t.chip
              }`}
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-110 motion-reduce:transition-none ${t.text}`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold">{w.name}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-3">
        <dl key={selected.id} className={`bc-fade space-y-2 rounded-2xl p-4 ring-1 ${st.soft}`}>
          <div className="flex gap-2 text-sm">
            <dt className="w-16 shrink-0 text-slate-400">Qué es</dt>
            <dd className="font-medium text-slate-700">{selected.what}</dd>
          </div>
          <div className="flex gap-2 text-sm">
            <dt className="w-16 shrink-0 text-slate-400">{selected.extraLabel}</dt>
            <dd className="font-medium text-slate-700">{selected.extra}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-4">
        <h4 className="mb-2 text-sm font-semibold text-slate-800">Plataformas</h4>
        <ul className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => {
            const t = BLOCKCHAIN_TONES[p.tone]
            return (
              <li
                key={p.name}
                className="group flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-xs font-medium text-slate-600 ring-1 ring-slate-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ring-1 transition duration-300 group-hover:scale-110 motion-reduce:transition-none ${t.icon}`}
                >
                  {p.name[0]}
                </span>
                {p.name}
              </li>
            )
          })}
        </ul>
      </div>
    </BlockchainCard>
  )
}
