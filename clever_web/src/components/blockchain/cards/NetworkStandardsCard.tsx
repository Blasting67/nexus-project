import React, { useState } from 'react'
import { BlockchainCard } from '../BlockchainCard'
import { STANDARDS, STANDARDS_EXAMPLE, STANDARDS_INTRO } from '../BlockchainData'
import { BC_ICONS } from '../BlockchainIcons'
import { RoadsIllustration } from '../BlockchainIllustrations'
import { Callout, Eyebrow, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

const CheckIcon = BC_ICONS.check

/** Limitación: círculo con un guion. */
const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 12h7" />
  </svg>
)

/** Dato neutro: un punto. */
const DotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
)

const KIND = {
  pro: { Icon: CheckIcon, color: 'text-emerald-600', label: 'Ventaja' },
  con: { Icon: MinusIcon, color: 'text-amber-600', label: 'Limitación' },
  info: { Icon: DotIcon, color: 'text-slate-400', label: 'Dato' },
}

/** Tarjeta 7: Estándares de redes — se elige una red arriba y debajo aparece su información; el ejemplo muestra el mismo USDT en tres redes. */
export const NetworkStandardsCard: React.FC<CardProps> = ({ className, index }) => {
  const [selectedId, setSelectedId] = useState(STANDARDS[0].id)
  const selected = STANDARDS.find((s) => s.id === selectedId) ?? STANDARDS[0]
  const kinds = (['pro', 'con', 'info'] as const).filter((k) => selected.traits.some((t) => t.kind === k))

  return (
    <BlockchainCard
      variant="formal"
      glow={pastelGlow('sky', 'indigo', 'violet')}
      number="7"
      title="Estándares de redes"
      tone="sky"
      className={className}
      index={index}
    >
      <p className="max-w-4xl text-[15px] leading-relaxed text-slate-600">{STANDARDS_INTRO}</p>

      <div role="group" aria-label="Estándares de red" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STANDARDS.map((s) => {
          const on = s.id === selectedId
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={on}
              onClick={() => setSelectedId(s.id)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                on ? 'border-indigo-500 bg-white shadow-sm' : 'border-slate-200 bg-white/60 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <span
                aria-hidden="true"
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-base font-semibold transition-colors duration-200 ${
                  on ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-white text-slate-500'
                }`}
              >
                {s.glyph}
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-semibold ${on ? 'text-indigo-900' : 'text-slate-800'}`}>{s.label}</span>
                <span className="sr-only">: </span>
                <span className="block truncate text-xs text-slate-500">{s.chain}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div aria-live="polite" className="min-h-[17.5rem] min-w-0 rounded-xl border border-slate-200 bg-white/70 p-5">
          <div key={selected.id} className="bc-fade">
            <Eyebrow className="text-indigo-500">Estándar de red</Eyebrow>
            <h4 className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-xl font-semibold text-slate-900">
              {selected.label}
              <span className="text-sm font-normal text-slate-500">· {selected.chain}</span>
            </h4>
            <p className="mt-2 text-[15px] leading-relaxed text-slate-700">{selected.what}</p>
            {selected.meaning && <p className="mt-1 text-xs text-slate-500">{selected.meaning}</p>}

            {selected.examples.length > 0 && (
              <>
                <Eyebrow className="mt-4">Ejemplos de tokens</Eyebrow>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {selected.examples.map((e) => (
                    <li key={e} className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700">
                      {e}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="mt-4 flex items-baseline justify-between gap-2">
              <Eyebrow>Características</Eyebrow>
              <span className="flex items-center gap-3 text-[11px] text-slate-400">
                {kinds.map((k) => {
                  const { Icon, color, label } = KIND[k]
                  return (
                    <span key={k} className="flex items-center gap-1">
                      <Icon className={`h-3 w-3 ${color}`} />
                      {label}
                    </span>
                  )
                })}
              </span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {selected.traits.map((t) => {
                const { Icon, color } = KIND[t.kind]
                return (
                  <li key={t.text} className="flex items-start gap-2.5 text-sm leading-snug text-slate-600">
                    <Icon className={`mt-px h-4 w-4 shrink-0 ${color}`} />
                    {t.text}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-slate-200 bg-white/70 p-5">
          <Eyebrow className="text-indigo-500">{STANDARDS_EXAMPLE.title}</Eyebrow>
          <div className="mt-3">
            <RoadsIllustration selected={selected.id} />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{STANDARDS_EXAMPLE.text}</p>
          <Callout className="mt-3">
            <span className="font-medium text-slate-800">{STANDARDS_EXAMPLE.question}</span> {STANDARDS_EXAMPLE.answer}
          </Callout>
        </div>
      </div>
    </BlockchainCard>
  )
}