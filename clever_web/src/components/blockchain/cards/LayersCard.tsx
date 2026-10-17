import React, { useState } from 'react'
import { BlockchainCard } from '../BlockchainCard'
import { LAYERS } from '../BlockchainData'
import { LayersIllustration } from '../BlockchainIllustrations'
import { Callout, Eyebrow, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

/** Tarjeta 6: Las 5 capas de Blockchain — al elegir una capa, su losa se desplaza y se explica con qué hace, qué incluye y un ejemplo. */
export const LayersCard: React.FC<CardProps> = ({ className, index }) => {
  const [selected, setSelected] = useState(0)
  const layer = LAYERS[selected]

  return (
    <BlockchainCard variant="formal" glow={pastelGlow('mint', 'sky', 'violet')} number="6" title="Las 5 capas de Blockchain" tone="emerald" className={className} index={index}>
      <div className="grid items-start gap-5 md:grid-cols-[8.5rem_12.5rem_minmax(0,1fr)]">
        <div className="mx-auto w-full max-w-[8.5rem] md:pt-2">
          <LayersIllustration layers={LAYERS} selected={selected} />
        </div>

        <div role="group" aria-label="Capas" className="space-y-1.5">
          {LAYERS.map((l, i) => {
            const on = i === selected
            return (
              <button
                key={l.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  on ? 'bg-indigo-50 font-semibold text-indigo-900 ring-1 ring-indigo-200' : 'font-medium text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-semibold tabular-nums transition-colors duration-200 ${
                    on ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {i + 1}
                </span>
                {l.name}
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className="min-h-[22rem] rounded-xl border border-slate-200 bg-white/70 p-5">
          <div key={layer.id} className="bc-fade">
            <Eyebrow className="text-indigo-500">{layer.label}</Eyebrow>
            <h4 className="mt-0.5 text-xl font-semibold text-slate-900">Capa de {layer.name}</h4>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{layer.does}</p>

            <Eyebrow className="mt-4">Incluye</Eyebrow>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {layer.includes.map((x) => (
                <li key={x} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700">
                  {x}
                </li>
              ))}
            </ul>

            <Callout label="Ejemplo" className="mt-4">
              {layer.example}
            </Callout>
            <p className="mt-3 text-xs text-slate-400">
              Analogía: <span className="font-medium text-slate-500">{layer.analogy}</span>
            </p>
          </div>
        </div>
      </div>
    </BlockchainCard>
  )
}