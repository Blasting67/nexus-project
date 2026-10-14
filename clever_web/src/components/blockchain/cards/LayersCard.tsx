import React, { useState } from 'react'
import { BLOCKCHAIN_TONES, BlockchainCard } from '../BlockchainCard'
import { LAYERS } from '../BlockchainData'
import { LayersIllustration } from '../BlockchainIllustrations'

interface CardProps {
  className?: string
  index?: number
}

/** 4.6 Las 5 capas de Blockchain — al elegir una capa, su losa se desplaza y se muestra qué hace. */
export const LayersCard: React.FC<CardProps> = ({ className, index }) => {
  const [selected, setSelected] = useState(0)
  const layer = LAYERS[selected]
  const st = BLOCKCHAIN_TONES[layer.tone]

  return (
    <BlockchainCard number="4.6" title="Las 5 capas de Blockchain" tone="emerald" className={className} index={index}>
      <div className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-3">
        <LayersIllustration layers={LAYERS} selected={selected} />

        <div role="group" aria-label="Capas" className="space-y-1.5">
          {LAYERS.map((l, i) => {
            const t = BLOCKCHAIN_TONES[l.tone]
            const on = i === selected
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(i)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium ring-1 transition duration-300 hover:translate-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 motion-reduce:transition-none motion-reduce:hover:translate-x-0 ${
                  on ? `${t.selected} text-slate-800 shadow-sm` : 'bg-white text-slate-600 ring-slate-100 hover:bg-slate-50'
                }`}
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full transition-transform duration-300 group-hover:scale-125 ${t.dot}`} />
                {l.name}
              </button>
            )
          })}
        </div>
      </div>

      <div aria-live="polite" className="mt-4">
        <dl key={layer.id} className={`bc-fade space-y-2 rounded-2xl p-4 ring-1 ${st.soft}`}>
          <div className="flex gap-2 text-sm">
            <dt className="w-20 shrink-0 text-slate-400">Qué hace</dt>
            <dd className="font-medium text-slate-700">{layer.does}</dd>
          </div>
          <div className="flex gap-2 text-sm">
            <dt className="w-20 shrink-0 text-slate-400">Analogía</dt>
            <dd className="font-medium text-slate-700">{layer.analogy}</dd>
          </div>
        </dl>
      </div>
    </BlockchainCard>
  )
}
