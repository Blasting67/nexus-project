import React, { useState } from 'react'
import { BLOCKCHAIN_TONES, BlockchainCard } from '../BlockchainCard'
import { CONSENSUS, CONSENSUS_INTRO, CONSENSUS_PROBLEMS, CONSENSUS_TABLE, RATING_LABEL } from '../BlockchainData'
import type { ConsensusMechanism, Rating } from '../BlockchainData'
import { BC_ICONS } from '../BlockchainIcons'
import { Callout, Eyebrow, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

const CheckIcon = BC_ICONS.check

/** Ventaja o limitación: el icono y el color de acento (suave) las distinguen. */
const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12h7" />
  </svg>
)

/** Pestañas, en el orden pedido: introducción, problemas, los cinco mecanismos y la tabla. */
const TABS: Array<{ id: string; label: string; sub?: string; mechanism?: ConsensusMechanism }> = [
  { id: 'intro', label: 'Introducción' },
  { id: 'problems', label: 'Problemas que resuelve' },
  ...CONSENSUS.map((m) => ({ id: m.id, label: m.name, sub: m.full, mechanism: m })),
  { id: 'table', label: 'Tabla de comparación' },
]

const METER: Record<'energy' | 'speed' | 'decentralization', string> = {
  energy: 'bg-amber-500',
  speed: 'bg-sky-500',
  decentralization: 'bg-indigo-500',
}

/** Cinco barritas: cuántas están llenas indica el nivel. */
const Meter: React.FC<{ level: Rating; color: string }> = ({ level, color }) => (
  <span className="flex items-center gap-2.5">
    <span aria-hidden="true" className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={`h-1.5 w-3.5 rounded-sm ${i <= level ? color : 'bg-slate-200'}`} />
      ))}
    </span>
    <span className="text-sm text-slate-700">{RATING_LABEL[level]}</span>
  </span>
)

/** Tarjeta 8: Pruebas de consenso — lista de temas a la izquierda; al elegir uno se despliega su información. */
export const ConsensusCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState('intro')
  const tab = TABS.find((t) => t.id === selectedId) ?? TABS[0]
  const m = tab.mechanism

  return (
    <BlockchainCard variant="formal" glow={pastelGlow('peach', 'violet', 'sky')} number="8" title="Pruebas de consenso" tone="rose" className={className} index={index}>
      <div className="grid gap-6 md:grid-cols-[18rem_minmax(0,1fr)]">
        <div role="group" aria-label="Temas de consenso" className="space-y-1">
          {TABS.map((t, i) => {
            const on = t.id === selectedId
            const tone = t.mechanism ? BLOCKCHAIN_TONES[t.mechanism.tone] : null
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={on}
                onClick={() => setSelectedId(t.id)}
                className={`flex min-h-[3rem] w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  on ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'hover:bg-slate-50'
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
                <span className="min-w-0 flex-1">
                  <span className={`block text-[15px] leading-tight ${on ? 'font-semibold text-indigo-900' : 'font-medium text-slate-700'}`}>{t.label}</span>
                  {t.sub && (
                    <>
                      <span className="sr-only">: </span>
                      <span className="block text-xs leading-tight text-slate-500">{t.sub}</span>
                    </>
                  )}
                </span>
                {tone && <span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />}
              </button>
            )
          })}
        </div>

        <div aria-live="polite" className="min-h-[27rem] min-w-0 rounded-xl border border-slate-200 bg-white/70 p-6">
          <div key={tab.id} className="bc-fade">
            {tab.id === 'intro' && (
              <>
                <Eyebrow className="text-indigo-500">Introducción</Eyebrow>
                <h4 className="mt-0.5 text-2xl font-semibold text-slate-900">¿Qué es el consenso?</h4>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{CONSENSUS_INTRO.text}</p>

                <Eyebrow className="mt-6">{CONSENSUS_INTRO.mapTitle}</Eyebrow>
                <ul className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                  {CONSENSUS.map((x) => (
                    <li key={x.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(x.id)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400"
                      >
                        <span className={`w-14 shrink-0 rounded-md px-2 py-0.5 text-center text-xs font-bold ring-1 ${BLOCKCHAIN_TONES[x.tone].chip}`}>{x.name}</span>
                        <span className="min-w-0 flex-1 text-sm">
                          <span className="font-medium text-slate-800">{x.full}</span>
                          <span className="text-slate-500"> · {x.how}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">
                          ›
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {tab.id === 'problems' && (
              <>
                <Eyebrow className="text-indigo-500">Problemas que resuelve</Eyebrow>
                <h4 className="mt-0.5 text-2xl font-semibold text-slate-900">¿Para qué sirve el consenso?</h4>
                <p className="mt-3 text-base leading-relaxed text-slate-700">{CONSENSUS_PROBLEMS.lead}</p>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {CONSENSUS_PROBLEMS.items.map((p, i) => (
                    <li key={p.title} className="rounded-lg border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2.5">
                        <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-xs font-semibold text-white">
                          {i + 1}
                        </span>
                        <h5 className="text-[15px] font-semibold leading-tight text-slate-900">
                          {p.title}
                          {p.english && <span className="font-normal text-slate-400"> ({p.english})</span>}
                        </h5>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.text}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {m && (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`rounded-md px-2.5 py-1 text-sm font-bold ring-1 ${BLOCKCHAIN_TONES[m.tone].chip}`}>{m.name}</span>
                  <div>
                    <h4 className="text-2xl font-semibold leading-tight text-slate-900">{m.english}</h4>
                    <p className="text-sm text-slate-500">
                      {m.full} · {m.how}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                  <Eyebrow>Utilizado por</Eyebrow>
                  {m.usedBy.map((u) => (
                    <span key={u} className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                      {u}
                    </span>
                  ))}
                  {m.usedByNote && <span className="text-xs text-slate-500">{m.usedByNote}</span>}
                </div>

                <p className="mt-4 text-base leading-relaxed text-slate-700">{m.description}</p>

                <div className={`mt-4 grid gap-6 ${m.steps.length ? 'sm:grid-cols-2' : ''}`}>
                  {m.steps.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-800">{m.stepsLabel}</p>
                      {m.ordered ? (
                        <ol className="mt-2 space-y-1.5">
                          {m.steps.map((st, i) => (
                            <li key={st} className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                              <span aria-hidden="true" className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white text-[11px] font-semibold tabular-nums text-slate-600 ring-1 ring-slate-300">
                                {i + 1}
                              </span>
                              {st}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="mt-2 space-y-1.5">
                          {m.steps.map((st) => (
                            <li key={st} className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                              <span aria-hidden="true" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                              {st}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-medium text-slate-800">Características</p>
                      <span className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <CheckIcon className="h-3 w-3 text-emerald-600" />
                          Ventaja
                        </span>
                        {m.traits.some((t) => t.kind === 'con') && (
                          <span className="flex items-center gap-1">
                            <MinusIcon className="h-3 w-3 text-amber-600" />
                            Limitación
                          </span>
                        )}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1.5">
                      {m.traits.map((t) => (
                        <li key={t.text} className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                          {t.kind === 'pro' ? (
                            <CheckIcon className="mt-px h-4 w-4 shrink-0 text-emerald-600" />
                          ) : (
                            <MinusIcon className="mt-px h-4 w-4 shrink-0 text-amber-600" />
                          )}
                          {t.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {m.note && <Callout className="mt-4">{m.note}</Callout>}
                {m.analogy && (
                  <Callout label="Analogía" className="mt-4">
                    {m.analogy}
                  </Callout>
                )}
              </>
            )}

            {tab.id === 'table' && (
              <>
                <Eyebrow className="text-indigo-500">Tabla de comparación</Eyebrow>
                <h4 className="mt-0.5 text-2xl font-semibold text-slate-900">{CONSENSUS_TABLE.title}</h4>
                <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 bg-white">
                  <table className="w-full min-w-[34rem] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {CONSENSUS_TABLE.columns.map((c) => (
                          <th key={c} scope="col" className="px-3 py-2.5">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {CONSENSUS.map((x) => (
                        <tr key={x.id} className="transition-colors duration-200 hover:bg-slate-50">
                          <th scope="row" className="px-3 py-3 font-normal">
                            <button
                              type="button"
                              onClick={() => setSelectedId(x.id)}
                              aria-label={`${x.name}: ver detalle`}
                              className={`rounded-md px-2.5 py-0.5 text-xs font-bold ring-1 transition-colors duration-200 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${BLOCKCHAIN_TONES[x.tone].chip}`}
                            >
                              {x.name}
                            </button>
                          </th>
                          <td className="px-3 py-3 text-sm font-medium text-slate-800">{x.example}</td>
                          <td className="px-3 py-3">
                            <Meter level={x.energy} color={METER.energy} />
                          </td>
                          <td className="px-3 py-3">
                            <Meter level={x.speed} color={METER.speed} />
                          </td>
                          <td className="px-3 py-3">
                            <Meter level={x.decentralization} color={METER.decentralization} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </BlockchainCard>
  )
}