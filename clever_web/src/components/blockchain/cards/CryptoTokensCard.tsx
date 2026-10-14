import React, { useEffect, useState } from 'react'
import { BC_ICONS } from '../BlockchainIcons'
import { BlockchainCard } from '../BlockchainCard'
import { CRYPTO_TOKENS } from '../BlockchainData'
import { useReveal } from '../../trading/useReveal'

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

/** 4.4 Criptomonedas y tokens. */
export const CryptoTokensCard: React.FC<CardProps> = ({ className, index }) => {
  const { ref, shown } = useReveal<HTMLParagraphElement>(0.6)
  const active = useCountUp(CRYPTO_TOKENS.crypto.active, shown)

  return (
    <BlockchainCard number="4.4" title="Criptomonedas y tokens" tone="amber" className={className} index={index}>
      <div className="grid gap-3 sm:grid-cols-2">
        <article className="group rounded-2xl bg-amber-50/60 p-4 ring-1 ring-amber-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none">
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-amber-500 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none">
            <CoinIcon className="h-6 w-6" />
          </span>
          <h4 className="text-sm font-semibold text-slate-800">{CRYPTO_TOKENS.crypto.name}</h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{CRYPTO_TOKENS.crypto.text}</p>
          <p ref={ref} className="mt-2 text-xs leading-relaxed text-slate-500">
            Hay ~<span className="font-semibold tabular-nums text-amber-700">{active.toLocaleString('en-US')}</span> activas en
            2026.
          </p>
        </article>

        <article className="group rounded-2xl bg-sky-50/60 p-4 ring-1 ring-sky-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none">
          <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-sky-500 transition duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none">
            <TokenIcon className="h-6 w-6" />
          </span>
          <h4 className="text-sm font-semibold text-slate-800">{CRYPTO_TOKENS.token.name}</h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{CRYPTO_TOKENS.token.text}</p>
        </article>
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50/70 p-4 ring-1 ring-slate-100">
        <h4 className="mb-2.5 text-sm font-semibold text-slate-800">{CRYPTO_TOKENS.featuresTitle}</h4>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CRYPTO_TOKENS.features.map((f) => (
            <li
              key={f}
              className="group flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm text-slate-600 ring-1 ring-slate-100 transition duration-300 hover:-translate-y-0.5 hover:shadow-sm motion-reduce:transition-none"
            >
              <CheckIcon className="h-4 w-4 shrink-0 text-amber-400 transition-transform duration-300 group-hover:scale-125 motion-reduce:transition-none" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </BlockchainCard>
  )
}
