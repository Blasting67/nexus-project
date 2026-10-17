import React, { useEffect, useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { WHAT_IS } from '../BlockchainData'
import { NetworkIllustration } from '../BlockchainIllustrations'
import type { NetworkDemo } from '../BlockchainIllustrations'
import { Callout, Eyebrow, Term, joinEs, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

const Check = BC_ICONS.check

/** Ejemplo ilustrativo: cada bloque guarda el hash del anterior. */
const BLOCKS = [
  { n: 1, prev: '0000…0000', hash: '00a4…f19c' },
  { n: 2, prev: '00a4…f19c', hash: '7be1…02d8' },
  { n: 3, prev: '7be1…02d8', hash: 'c93f…a65b' },
]

const BTN =
  'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400'
const IDLE = 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50'

/** Tarjeta 1: ¿Qué es Blockchain? — definición, analogía, hash de cada bloque y una pequeña demo de la red. */
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
    <BlockchainCard variant="formal" glow={pastelGlow('sky', 'violet', 'mint')} number="1" title="¿Qué es Blockchain?" tone="violet" className={className} index={index}>
      <div className="grid items-center gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="min-w-0">
          <Eyebrow>{WHAT_IS.definitionTitle}</Eyebrow>
          <p className="mt-2 text-[17px] font-medium leading-snug text-slate-900">{WHAT_IS.definition}</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            Está compuesto por {joinEs(WHAT_IS.ecosystem.map((t) => <Term key={t}>{t}</Term>))} que, en conjunto, {WHAT_IS.purpose}
          </p>
          <Callout label={WHAT_IS.analogyTitle} className="mt-4">
            {WHAT_IS.analogy} {WHAT_IS.detail}
          </Callout>
        </div>

        <div className="min-w-0">
          <div className="mx-auto max-w-[17.5rem]">
            <NetworkIllustration demo={demo} />
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setDemo({ kind: 'write', id: Date.now() })}
              className={`${BTN} ${demo?.kind === 'write' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : IDLE}`}
            >
              Anotar una transacción
            </button>
            <button
              type="button"
              onClick={() => setDemo({ kind: 'tamper', id: Date.now() })}
              className={`${BTN} ${demo?.kind === 'tamper' ? 'border-rose-500 bg-rose-50 text-rose-700' : IDLE}`}
            >
              Intentar alterar una copia
            </button>
          </div>
          <p aria-live="polite" className="mt-2 min-h-[2.25rem] text-center text-xs leading-relaxed text-slate-500">
            {caption}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 border-t border-slate-100 pt-5 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-8">
        <div className="min-w-0">
          <Eyebrow>{WHAT_IS.hashTitle}</Eyebrow>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{WHAT_IS.hashText}</p>
          <div className="mt-3 flex flex-col gap-1.5 md:flex-row md:items-stretch" role="img" aria-label="Tres bloques encadenados: cada uno guarda el hash del anterior">
            {BLOCKS.map((b, i) => (
              <React.Fragment key={b.n}>
                <div className="min-w-0 flex-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-[10.5px] leading-[1.35rem] text-slate-500">
                  <p className="font-sans text-[11px] font-semibold text-slate-700">Bloque {b.n}</p>
                  <p className="truncate">
                    Anterior <span className="text-slate-400">{b.prev}</span>
                  </p>
                  <p className="truncate">
                    Hash <span className="font-semibold text-indigo-600">{b.hash}</span>
                  </p>
                </div>
                {i < BLOCKS.length - 1 && (
                  <span aria-hidden="true" className="flex items-center justify-center text-slate-300 max-md:rotate-90">
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6h8M6.5 2.5L10 6l-3.5 3.5" />
                    </svg>
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="min-w-0">
          <Eyebrow>{WHAT_IS.usesTitle}</Eyebrow>
          <ul className="mt-2 space-y-2">
            {WHAT_IS.uses.map((use) => (
              <li key={use} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {use}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </BlockchainCard>
  )
}