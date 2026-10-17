import React, { useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { CONCEPTS, CONCEPT_HIERARCHY } from '../BlockchainData'
import { Callout, Eyebrow, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

/** Tarjeta 3: Conceptos básicos — lista de términos; al elegir uno se muestra su definición completa. */
export const BasicConceptsCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState(CONCEPTS[0].id)
  const selected = CONCEPTS.find((c) => c.id === selectedId) ?? CONCEPTS[0]
  const SelectedIcon = BC_ICONS[selected.icon]
  const inHierarchy = CONCEPT_HIERARCHY.includes(selected.id)

  return (
    <BlockchainCard variant="formal" glow={pastelGlow('sky', 'indigo', 'mint')} number="3" title="Conceptos básicos" tone="sky" className={className} index={index}>
      <div className="grid gap-5 md:grid-cols-[17rem_minmax(0,1fr)]">
        <div role="group" aria-label="Términos" className="space-y-1">
          {CONCEPTS.map((c, i) => {
            const Icon = BC_ICONS[c.icon]
            const on = c.id === selectedId
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelectedId(c.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  on ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
                }`}
              >
                <span aria-hidden="true" className={`w-5 text-[11px] font-semibold tabular-nums ${on ? 'text-indigo-500' : 'text-slate-300'}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <Icon className={`h-[18px] w-[18px] shrink-0 ${on ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className={`text-sm leading-tight ${on ? 'font-semibold text-indigo-900' : 'font-medium text-slate-600'}`}>{c.name}</span>
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className="min-h-[19rem] rounded-xl border border-slate-200 bg-white/70 p-6">
          <div key={selected.id} className="bc-fade">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-indigo-600">
                <SelectedIcon className="h-5 w-5" />
              </span>
              <div>
                <Eyebrow className="text-indigo-500">Concepto</Eyebrow>
                <h4 className="text-xl font-semibold leading-tight text-slate-900">{selected.name}</h4>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-slate-700">{selected.detail}</p>
            {selected.note && <Callout className="mt-4">{selected.note}</Callout>}

            {inHierarchy && (
              <div className="mt-5 border-t border-slate-200 pt-4">
                <Eyebrow>Cada nivel está dentro del anterior</Eyebrow>
                <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-xs font-medium">
                  {CONCEPT_HIERARCHY.map((id, i) => {
                    const c = CONCEPTS.find((x) => x.id === id)
                    if (!c) return null
                    return (
                      <React.Fragment key={id}>
                        {i > 0 && (
                          <li aria-hidden="true" className="text-slate-300">
                            ›
                          </li>
                        )}
                        <li className={`rounded-md border px-2.5 py-1 ${id === selected.id ? 'border-indigo-300 bg-indigo-50 text-indigo-800' : 'border-slate-200 bg-white text-slate-500'}`}>
                          {c.name}
                        </li>
                      </React.Fragment>
                    )
                  })}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </BlockchainCard>
  )
}