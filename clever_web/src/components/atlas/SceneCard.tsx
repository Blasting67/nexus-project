import React from 'react'
import { InfoTip } from './AtlasCard'
import type { TipMore } from './AtlasCard'

interface SceneCardProps {
  title: string
  tip: string
  tipMore?: TipMore
  value: React.ReactNode
  suffix?: string
  label?: string
  labelColor?: string
  extra?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export const SceneCard: React.FC<SceneCardProps> = ({
  title,
  tip,
  tipMore,
  value,
  suffix,
  label,
  labelColor,
  extra,
  className = '',
  children,
}) => (
  <section
    className={`group relative isolate flex min-h-[184px] flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-[border-color,box-shadow] duration-300 focus-within:z-20 hover:z-20 hover:border-[color-mix(in_oklab,var(--text)_22%,var(--border))] hover:shadow-[0_10px_24px_-18px_rgba(15,23,42,0.45)] motion-reduce:transition-none ${className}`}
  >
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      {children}
    </div>

    <header className="relative z-10 flex items-start justify-between gap-2 px-3 pt-2.5">
      <h3 className="whitespace-nowrap rounded-md bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-1.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.12em] text-[var(--text-muted)] backdrop-blur-[2px] sm:text-[10.5px]">
        {title}
      </h3>
      <InfoTip text={tip} more={tipMore} />
    </header>

    <div className="relative z-10 mt-auto p-2 pt-0">
      <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] px-2.5 py-1 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 items-baseline gap-1 leading-none">
            <span className="text-[25px] font-semibold tabular-nums tracking-tight text-[var(--text)]">{value}</span>
            {suffix && <span className="text-[10px] text-[var(--text-muted)]">{suffix}</span>}
          </div>
          {label && (
            <div
              className="min-w-0 text-right text-[11.5px] font-semibold leading-tight"
              style={{ color: labelColor ? `color-mix(in oklab, ${labelColor} 80%, var(--text))` : undefined }}
            >
              {label}
            </div>
          )}
        </div>
        {extra}
      </div>
    </div>
  </section>
)
