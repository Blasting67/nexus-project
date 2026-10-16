import React from 'react'
import { InfoTip } from './AtlasCard'
import type { TipMore } from './AtlasCard'

interface SceneCardProps {
  title: string
  tip: string
  tipMore?: TipMore
  /** número principal, sufijo y etiqueta de estado (se muestran en un panel de cristal abajo) */
  value: React.ReactNode
  suffix?: string
  label?: string
  labelColor?: string
  /** contenido extra bajo el número (barras, escalas…) */
  extra?: React.ReactNode
  className?: string
  /** la escena: un <svg> que llena toda la tarjeta */
  children: React.ReactNode
}

/**
 * Molde de las tarjetas del Atlas: la escena animada ocupa toda la tarjeta,
 * el título va arriba (con su botón "?") y el valor abajo, sobre un panel de cristal.
 */
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
    className={`group relative isolate flex min-h-[184px] flex-col overflow-hidden rounded-2xl border border-white/80 shadow-md shadow-slate-300/60 ring-1 ring-slate-200/80 transition duration-300 focus-within:z-20 hover:z-20 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-400/40 motion-reduce:transition-none ${className}`}
  >
    {/* escena de fondo: se acerca un poco al pasar el mouse */}
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 origin-center transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:transition-none"
    >
      {children}
    </div>

    <header className="relative z-10 flex items-start justify-between gap-2 p-2.5">
      <h3 className="whitespace-nowrap rounded-full bg-white/90 px-2 py-1 text-[10.5px] font-semibold leading-none tracking-wide text-slate-700 shadow-sm ring-1 ring-white/70 sm:px-2.5 sm:text-[11px]">
        {title}
      </h3>
      <InfoTip text={tip} more={tipMore} />
    </header>

    <div className="relative z-10 mt-auto p-2 pt-0">
      <div className="rounded-xl bg-white/90 px-2.5 py-1 shadow-sm ring-1 ring-white/80">
        <div className="flex items-center justify-between gap-2">
          <div className="flex shrink-0 items-baseline gap-1 leading-none">
            <span className="text-[25px] font-bold tabular-nums tracking-tight text-slate-900">{value}</span>
            {suffix && <span className="text-[10px] text-slate-500">{suffix}</span>}
          </div>
          {label && (
            <div className="min-w-0 text-right text-[11.5px] font-semibold leading-tight" style={{ color: labelColor }}>
              {label}
            </div>
          )}
        </div>
        {extra}
      </div>
    </div>
  </section>
)