import React, { useEffect, useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { WHAT_IS } from '../BlockchainData'
import { NetworkIllustration } from '../BlockchainIllustrations'
import type { NetworkDemo } from '../BlockchainIllustrations'

interface CardProps {
  className?: string
  index?: number
}

const Check = BC_ICONS.check

/** 4.1 ¿Qué es Blockchain? — la analogía del cuaderno, con una pequeña demo interactiva. */
export const WhatIsBlockchainCard: React.FC<CardProps> = ({ className, index }) => {
  const [demo, setDemo] = useState<NetworkDemo | null>(null)

  // la demo termina sola y la red vuelve a su estado normal
  useEffect(() => {
    if (!demo) return
    const t = window.setTimeout(() => setDemo(null), 3200)
    return () => window.clearTimeout(t)
  }, [demo])

  const caption =
    demo?.kind === 'write'
      ? 'Se anotó algo: todas las copias se actualizan a la vez.'
      : demo?.kind === 'tamper'
        ? 'Alguien alteró una copia: las otras la detectan.'
        : 'Prueba cómo reacciona la red.'

  return (
    <BlockchainCard number="4.1" title="¿Qué es Blockchain?" tone="violet" className={className} index={index}>
      <div className="mb-5 rounded-2xl bg-violet-50/60 px-4 py-3 ring-1 ring-violet-100">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-500">Analogía</p>
        <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">{WHAT_IS.analogy}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{WHAT_IS.detail}</p>
      </div>

      <div className="grid items-center gap-5 sm:grid-cols-2">
        <div>
          <NetworkIllustration demo={demo} />
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setDemo({ kind: 'write', id: Date.now() })}
              className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 active:scale-95"
            >
              Anotar una transacción
            </button>
            <button
              type="button"
              onClick={() => setDemo({ kind: 'tamper', id: Date.now() })}
              className="rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-100 transition duration-200 hover:-translate-y-0.5 hover:bg-rose-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 active:scale-95"
            >
              Intentar alterar una copia
            </button>
          </div>
          <p aria-live="polite" className="mt-2 min-h-[2.5rem] text-center text-xs leading-relaxed text-slate-500">
            {caption}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-slate-800">{WHAT_IS.usesTitle}</h4>
          <ul className="space-y-2.5">
            {WHAT_IS.uses.map((use) => (
              <li
                key={use}
                className="group flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 transition-transform duration-300 hover:translate-x-1 motion-reduce:transition-none"
              >
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400 transition-colors duration-300 group-hover:text-emerald-500" />
                {use}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BlockchainCard>
  )
}
