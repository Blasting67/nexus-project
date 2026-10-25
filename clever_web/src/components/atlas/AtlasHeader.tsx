import React from 'react'
import { REF_PRICE, formatPrice } from './atlasData'
import { useSmoothNumber } from './useSmoothNumber'

interface AtlasHeaderProps {
  price: number
  onOpenSimulator: () => void
}

export const AtlasHeader: React.FC<AtlasHeaderProps> = ({ price, onOpenSimulator }) => {
  const p = useSmoothNumber(price, 0.14, 0.005)
  const change = ((p - REF_PRICE) / REF_PRICE) * 100
  const up = change >= 0

  return (
    <header className="relative z-10 mb-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color-mix(in_oklab,#f59e0b_16%,var(--surface))] text-xl font-bold text-[color-mix(in_oklab,#c98a12_82%,var(--text))] ring-1 ring-[color-mix(in_oklab,#f59e0b_35%,var(--border))]">
          ₿
        </span>
        <div>
          <h2 className="text-lg font-semibold leading-tight text-[var(--text)]">
            Bitcoin <span className="font-normal text-[var(--text-muted)]">(BTC)</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">La criptomoneda líder del mercado</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-alt)_45%,var(--surface))] px-5 py-2">
        <span className="text-2xl font-semibold tabular-nums text-[var(--text)]">{formatPrice(p)}</span>
        <span className={`text-sm font-medium tabular-nums ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
          {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          <span className="ml-1 text-xs font-normal text-[var(--text-muted)]">24h</span>
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenSimulator}
        className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[color-mix(in_oklab,var(--text)_25%,var(--border))] hover:bg-[var(--surface-alt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 6h8M15 6h2M3 14h2M9 14h8" />
          <circle cx="13" cy="6" r="2" />
          <circle cx="7" cy="14" r="2" />
        </svg>
        Simulador
      </button>
    </header>
  )
}