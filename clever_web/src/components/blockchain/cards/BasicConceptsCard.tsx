import React, { useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BLOCKCHAIN_TONES, BlockchainCard } from '../BlockchainCard'
import { CONCEPTS } from '../BlockchainData'

interface CardProps {
  className?: string
  index?: number
}

/** 4.2 Conceptos básicos — fichas que se tocan para ver la definición de cada término. */
export const BasicConceptsCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState(CONCEPTS[0].id)
  const selected = CONCEPTS.find((c) => c.id === selectedId) ?? CONCEPTS[0]
  const SelectedIcon = BC_ICONS[selected.icon]
  const st = BLOCKCHAIN_TONES[selected.tone]

  return (
    <BlockchainCard number="4.2" title="Conceptos básicos" tone="sky" className={className} index={index}>
      <div role="group" aria-label="Términos" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {CONCEPTS.map((c) => {
          const Icon = BC_ICONS[c.icon]
          const t = BLOCKCHAIN_TONES[c.tone]
          const on = c.id === selectedId
          return (
            <button
              key={c.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(c.id)}
              className={`group flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm font-medium ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                on ? `${t.selected} shadow-sm` : t.chip
              }`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/70 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none ${t.text}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="leading-tight">{c.name}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-4">
        <div key={selected.id} className={`bc-fade flex items-start gap-3 rounded-2xl p-4 ring-1 ${st.soft}`}>
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 ${st.text}`}>
            <SelectedIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Qué es</p>
            <p className="text-sm font-semibold text-slate-800">{selected.name}</p>
            <p className="mt-0.5 text-sm leading-relaxed text-slate-600">{selected.meaning}</p>
          </div>
        </div>
      </div>
    </BlockchainCard>
  )
}
