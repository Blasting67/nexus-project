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
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 text-xl font-bold text-slate-950 shadow-lg shadow-amber-500/30">
          ₿
        </span>
        <div>
          <h2 className="text-lg font-semibold leading-tight text-slate-900">
            Bitcoin <span className="font-normal text-slate-500">(BTC)</span>
          </h2>
          <p className="text-xs text-slate-500">La criptomoneda líder del mercado</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-5 py-2">
        <span className="text-2xl font-semibold tabular-nums text-slate-900">{formatPrice(p)}</span>
        <span className={`text-sm font-medium tabular-nums ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
          {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
          <span className="ml-1 text-xs font-normal text-slate-500">24h</span>
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenSimulator}
        className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition hover:bg-amber-100"
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