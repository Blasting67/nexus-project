import React, { useState } from 'react'
import { BLOCKCHAIN_TONES, BlockchainCard } from '../BlockchainCard'
import { STANDARDS, STANDARDS_EXAMPLE } from '../BlockchainData'
import { RoadsIllustration } from '../BlockchainIllustrations'

interface CardProps {
  className?: string
  index?: number
}

/** 4.7 Estándares de redes — cuatro estándares; el ejemplo muestra el mismo dólar digital en tres "carreteras". */
export const NetworkStandardsCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState(STANDARDS[0].id)
  const selected = STANDARDS.find((s) => s.id === selectedId) ?? STANDARDS[0]
  const st = BLOCKCHAIN_TONES[selected.tone]

  return (
    <BlockchainCard number="4.7" title="Estándares de redes" tone="sky" className={className} index={index}>
      <div role="group" aria-label="Estándares" className="grid grid-cols-4 gap-2">
        {STANDARDS.map((s) => {
          const t = BLOCKCHAIN_TONES[s.tone]
          const on = s.id === selectedId
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(s.id)}
              className={`group flex flex-col items-center gap-1.5 rounded-2xl px-1 py-3 text-center ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
                on ? `${t.selected} shadow-sm` : t.chip
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-base font-bold transition duration-300 group-hover:scale-110 motion-reduce:transition-none ${t.text}`}
              >
                {s.glyph}
              </span>
              <span className="text-[11px] font-semibold">{s.label}</span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite" className="mt-3">
        <p key={selected.id} className={`bc-fade rounded-2xl px-4 py-3 text-sm leading-relaxed ring-1 ${st.soft}`}>
          <span className="font-semibold text-slate-800">{selected.chain}.</span>{' '}
          <span className="text-slate-600">{selected.note}</span>
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50/70 p-4 ring-1 ring-slate-100">
        <h4 className="mb-2 text-sm font-semibold text-slate-800">{STANDARDS_EXAMPLE.title}</h4>
        <RoadsIllustration selected={selected.id} />
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{STANDARDS_EXAMPLE.text}</p>
      </div>
    </BlockchainCard>
  )
}
