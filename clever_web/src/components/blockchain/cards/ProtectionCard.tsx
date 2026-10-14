import React, { useMemo, useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { PROTECTION } from '../BlockchainData'
import { sha256Hex } from '../sha256'

interface CardProps {
  className?: string
  index?: number
}

const ORIGINAL = 'Hola'
const SHOWN_CHARS = 16
const HashIcon = BC_ICONS.hash
const SignatureIcon = BC_ICONS.signature
const LockIcon = BC_ICONS.lock

/** Las dieciséis primeras letras de la huella; las que difieren de la original se resaltan. */
const HashLine: React.FC<{ source: string; compareWith?: string }> = ({ source, compareWith }) => {
  const hash = sha256Hex(source).slice(0, SHOWN_CHARS)
  return (
    <p className="font-mono text-[13px] tracking-wider text-slate-700" aria-label={`Huella de ${source}: ${hash}`}>
      {[...hash].map((ch, i) => (
        <span
          key={`${source}-${i}`}
          className={compareWith !== undefined && ch !== compareWith[i] ? 'bc-mark rounded-sm' : ''}
        >
          {ch}
        </span>
      ))}
    </p>
  )
}

/** 4.3 ¿Cómo se protege la información? — hash real (SHA-256) y firma digital, con una demo de cada una. */
export const ProtectionCard: React.FC<CardProps> = ({ className, index }) => {
  const [text, setText] = useState(ORIGINAL)
  const [altered, setAltered] = useState(false)
  const originalHash = useMemo(() => sha256Hex(ORIGINAL).slice(0, SHOWN_CHARS), [])

  return (
    <BlockchainCard number="4.3" title="¿Cómo se protege la información?" tone="emerald" className={className} index={index}>
      <div className="space-y-4">
        {/* Hash */}
        <article className="rounded-2xl bg-emerald-50/60 p-4 ring-1 ring-emerald-100">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-emerald-500">
              <HashIcon className="h-5 w-5" />
            </span>
            <h4 className="text-sm font-semibold text-slate-800">{PROTECTION.hash.title}</h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{PROTECTION.hash.text}</p>

          <div className="mt-3 space-y-2 rounded-xl bg-white/80 p-3 ring-1 ring-emerald-100">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Original: “{ORIGINAL}”</p>
              <HashLine source={ORIGINAL} />
            </div>
            <div>
              <label htmlFor="bc-hash-input" className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Cambia una letra
              </label>
              <input
                id="bc-hash-input"
                value={text}
                maxLength={20}
                onChange={(e) => setText(e.target.value)}
                className="mt-1 w-full rounded-lg border border-emerald-100 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              />
              <div className="mt-1.5">
                <HashLine source={text} compareWith={text === ORIGINAL ? undefined : originalHash} />
              </div>
            </div>
          </div>
        </article>

        {/* Firma digital */}
        <article className="rounded-2xl bg-sky-50/60 p-4 ring-1 ring-sky-100">
          <div className="mb-2 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 text-sky-500">
              <SignatureIcon className="h-5 w-5" />
            </span>
            <h4 className="text-sm font-semibold text-slate-800">{PROTECTION.signature.title}</h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-600">{PROTECTION.signature.text}</p>

          <div className="mt-3 rounded-xl bg-white/80 p-3 ring-1 ring-sky-100">
            <div key={String(altered)} className={`flex items-center justify-between gap-3 ${altered ? 'bc-shake' : ''}`}>
              <p className="text-sm text-slate-700">
                Ana <span className="text-slate-400">→</span> Luis
                <span className="ml-2 rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-xs text-slate-600">
                  {altered ? '20 BTC' : '2 BTC'}
                </span>
              </p>
              <p
                aria-live="polite"
                className={`bc-pop inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
                  altered ? 'bg-rose-50 text-rose-700 ring-rose-100' : 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                }`}
                key={`sig-${altered}`}
              >
                {altered ? (
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                ) : (
                  <LockIcon className="h-3.5 w-3.5" />
                )}
                {altered ? 'Firma inválida' : 'Firma válida'}
              </p>
            </div>
            <button
              type="button"
              aria-pressed={altered}
              onClick={() => setAltered((a) => !a)}
              className="mt-3 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100 transition duration-200 hover:-translate-y-0.5 hover:bg-sky-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 active:scale-95"
            >
              {altered ? 'Restaurar el monto' : 'Modificar el monto'}
            </button>
          </div>
        </article>
      </div>
    </BlockchainCard>
  )
}
