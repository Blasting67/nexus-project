import React, { useEffect, useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { CRYPTO_TOKENS } from '../BlockchainData'
import { useReveal } from '../../trading/useReveal'
import { Eyebrow, pastelGlow } from '../FormalParts'

interface CardProps {
  className?: string
  index?: number
}

const CoinIcon = BC_ICONS.coin
const TokenIcon = BC_ICONS.token
const CheckIcon = BC_ICONS.check

/** Cuenta de 0 al valor cuando el elemento aparece en pantalla (con movimiento reducido, muestra el valor final). */
function useCountUp(target: number, active: boolean, duration = 1400): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!active) return
    const reduce =
      typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3))))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, active, duration])

  return value
}

/** Tarjeta 4: Criptomonedas y tokens — la criptomoneda es solo una parte de los criptoactivos. */
export const CryptoTokensCard: React.FC<CardProps> = ({ className, index }) => {
  const { ref, shown } = useReveal<HTMLParagraphElement>(0.6)
  const active = useCountUp(CRYPTO_TOKENS.crypto.active, shown)

  return (
    <BlockchainCard variant="formal" glow={pastelGlow('amber', 'sky', 'violet')} number="4" title="Criptomonedas y tokens" tone="amber" className={className} index={index}>
      <p className="text-[17px] font-medium leading-snug text-slate-900">{CRYPTO_TOKENS.question}</p>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{CRYPTO_TOKENS.answer}</p>

      {/* los criptoactivos incluyen a las criptomonedas y a otros tipos */}
      <div role="group" aria-label="Tipos de criptoactivo" className="mt-4 rounded-xl border border-slate-300 p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <Eyebrow className="text-slate-500">{CRYPTO_TOKENS.familyTitle}</Eyebrow>
          <span className="text-xs text-slate-400">Incluyen a todos estos tipos</span>
        </div>
        <ul className="grid gap-2 sm:grid-cols-5">
          {CRYPTO_TOKENS.family.map((k) => (
            <li
              key={k.id}
              className={`rounded-lg border px-3 py-2.5 ${k.highlight ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white'}`}
            >
              <p className={`text-sm font-semibold leading-tight ${k.highlight ? 'text-indigo-900' : 'text-slate-700'}`}>{k.name}</p>
              {k.note && <p className={`mt-0.5 text-xs ${k.highlight ? 'text-indigo-600' : 'text-slate-500'}`}>{k.note}</p>}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <article className="rounded-xl border border-slate-200 p-5">
          <header className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <CoinIcon className="h-5 w-5" />
            </span>
            <h4 className="text-base font-semibold text-slate-900">{CRYPTO_TOKENS.crypto.name}</h4>
          </header>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{CRYPTO_TOKENS.crypto.text}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{CRYPTO_TOKENS.crypto.limit}</p>
          <p ref={ref} className="mt-3 flex items-baseline gap-2 border-t border-slate-100 pt-3">
            <span className="text-2xl font-semibold tabular-nums text-indigo-700">{active.toLocaleString('en-US')}+</span>
            <span className="text-xs text-slate-500">{CRYPTO_TOKENS.crypto.activeLabel}</span>
          </p>
          <ul aria-label={CRYPTO_TOKENS.featuresTitle} className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {CRYPTO_TOKENS.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
                <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                {f}
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-xl border border-slate-200 p-5">
          <header className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600">
              <TokenIcon className="h-5 w-5" />
            </span>
            <h4 className="text-base font-semibold text-slate-900">{CRYPTO_TOKENS.token.name}</h4>
          </header>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{CRYPTO_TOKENS.token.text}</p>
          <dl className="mt-3 divide-y divide-slate-100 border-t border-slate-100">
            {CRYPTO_TOKENS.token.rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[5rem_minmax(0,1fr)] gap-3 py-2.5">
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">{r.label}</dt>
                <dd className="text-sm text-slate-700">{r.value}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>
    </BlockchainCard>
  )
}