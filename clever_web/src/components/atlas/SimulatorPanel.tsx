import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { AtlasData, PresetKey } from './atlasData'
import { formatPrice } from './atlasData'

interface Field {
  key: keyof AtlasData
  label: string
  min: number
  max: number
  step: number
  format?: (v: number) => string
}

const FIELDS: Field[] = [
  { key: 'price', label: 'Precio', min: 8000, max: 95000, step: 10, format: formatPrice },
  { key: 'sentiment', label: 'Sentimiento', min: 0, max: 100, step: 1 },
  { key: 'volatility', label: 'Volatilidad', min: 0, max: 100, step: 1 },
  { key: 'trend', label: 'Tendencia', min: 0, max: 100, step: 1 },
  { key: 'risk', label: 'Riesgo', min: 0, max: 100, step: 1 },
  { key: 'momentum', label: 'Momentum', min: 0, max: 100, step: 1 },
  { key: 'liquidity', label: 'Liquidez', min: 0, max: 100, step: 1 },
  { key: 'buySell', label: 'Compra / Venta', min: 0, max: 100, step: 1 },
  { key: 'fearGreed', label: 'Miedo & Codicia', min: 0, max: 100, step: 1 },
  { key: 'supply', label: 'Suministro (M BTC)', min: 0, max: 21, step: 0.1, format: (v) => `${v.toFixed(1)}M` },
  { key: 'uncertainty', label: 'Incertidumbre', min: 0, max: 100, step: 1 },
]

const PRESET_BUTTONS: Array<{ key: PresetKey; label: string; dot: string }> = [
  { key: 'bull', label: 'Alcista', dot: 'bg-emerald-400' },
  { key: 'bear', label: 'Bajista', dot: 'bg-rose-400' },
  { key: 'neutral', label: 'Neutral', dot: 'bg-amber-400' },
]

interface SimulatorPanelProps {
  open: boolean
  onClose: () => void
  data: AtlasData
  onChange: (key: keyof AtlasData, value: number) => void
  onPreset: (key: PresetKey) => void
  onReset: () => void
}

/** Panel lateral para ajustar manualmente todos los datos simulados */
export const SimulatorPanel: React.FC<SimulatorPanelProps> = ({
  open,
  onClose,
  data,
  onChange,
  onPreset,
  onReset,
}) => {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`fixed inset-0 z-[59] bg-slate-900/30 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <aside
        role="dialog"
        aria-label="Simulador"
        aria-hidden={!open}
        className={`fixed right-0 top-0 z-[60] flex h-full w-[360px] max-w-[92vw] flex-col border-l border-[var(--border)] bg-[var(--bg-alt)] text-[var(--text)] shadow-2xl transition-all duration-300 ${
          open ? 'visible translate-x-0' : 'invisible translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-[var(--text)]">Simulador</h2>
            <p className="text-xs text-[var(--text-muted)]">Mueve los valores y mira cómo reacciona el Atlas.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar simulador"
            className="rounded-full p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--surface-alt)] hover:text-[var(--text)]"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-[var(--border)] px-5 py-4">
          {PRESET_BUTTONS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onPreset(p.key)}
              className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--text)] transition-colors hover:border-[color-mix(in_oklab,var(--text)_25%,var(--border))] hover:bg-[var(--surface-alt)]"
            >
              <span className={`h-2 w-2 rounded-full ${p.dot}`} />
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={onReset}
            className="ml-auto rounded-full px-3 py-1.5 text-xs text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            Restablecer
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)]">{f.label}</span>
                <span className="font-mono text-amber-600">
                  {f.format ? f.format(data[f.key]) : Math.round(data[f.key])}
                </span>
              </span>
              <input
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={data[f.key]}
                onChange={(e) => onChange(f.key, Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer accent-amber-400"
              />
            </label>
          ))}
        </div>
      </aside>
    </>,
    document.body,
  )
}