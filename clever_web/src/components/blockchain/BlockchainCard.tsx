import React from 'react'
import { useReveal } from '../trading/useReveal'

/* ------------------------------------------------------------------ */
/* Colores pastel (clases completas para que Tailwind las detecte)     */
/* ------------------------------------------------------------------ */

export type BlockchainToneKey = 'violet' | 'sky' | 'emerald' | 'amber' | 'rose' | 'teal'

export interface BlockchainTone {
  blob: string // mancha decorativa difuminada
  tag: string // etiqueta con el número de la tarjeta
  soft: string // fondo suave de sub-tarjetas
  chip: string // etiqueta pastel
  selected: string // elemento seleccionado
  text: string // texto de acento
  dot: string // punto de color
  icon: string // recuadro de icono
}

export const BLOCKCHAIN_TONES: Record<BlockchainToneKey, BlockchainTone> = {
  violet: {
    blob: 'bg-violet-200/40',
    tag: 'bg-violet-50 text-violet-600 ring-violet-100',
    soft: 'bg-violet-50/60 ring-violet-100',
    chip: 'bg-violet-50 text-violet-700 ring-violet-100',
    selected: 'bg-violet-100/80 ring-violet-300',
    text: 'text-violet-700',
    dot: 'bg-violet-300',
    icon: 'bg-violet-50 text-violet-500 ring-violet-100',
  },
  sky: {
    blob: 'bg-sky-200/40',
    tag: 'bg-sky-50 text-sky-600 ring-sky-100',
    soft: 'bg-sky-50/60 ring-sky-100',
    chip: 'bg-sky-50 text-sky-700 ring-sky-100',
    selected: 'bg-sky-100/80 ring-sky-300',
    text: 'text-sky-700',
    dot: 'bg-sky-300',
    icon: 'bg-sky-50 text-sky-500 ring-sky-100',
  },
  emerald: {
    blob: 'bg-emerald-200/40',
    tag: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    soft: 'bg-emerald-50/60 ring-emerald-100',
    chip: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    selected: 'bg-emerald-100/80 ring-emerald-300',
    text: 'text-emerald-700',
    dot: 'bg-emerald-300',
    icon: 'bg-emerald-50 text-emerald-500 ring-emerald-100',
  },
  amber: {
    blob: 'bg-amber-200/40',
    tag: 'bg-amber-50 text-amber-600 ring-amber-100',
    soft: 'bg-amber-50/60 ring-amber-100',
    chip: 'bg-amber-50 text-amber-700 ring-amber-100',
    selected: 'bg-amber-100/80 ring-amber-300',
    text: 'text-amber-700',
    dot: 'bg-amber-300',
    icon: 'bg-amber-50 text-amber-500 ring-amber-100',
  },
  rose: {
    blob: 'bg-rose-200/40',
    tag: 'bg-rose-50 text-rose-600 ring-rose-100',
    soft: 'bg-rose-50/60 ring-rose-100',
    chip: 'bg-rose-50 text-rose-700 ring-rose-100',
    selected: 'bg-rose-100/80 ring-rose-300',
    text: 'text-rose-700',
    dot: 'bg-rose-300',
    icon: 'bg-rose-50 text-rose-500 ring-rose-100',
  },
  teal: {
    blob: 'bg-teal-200/40',
    tag: 'bg-teal-50 text-teal-600 ring-teal-100',
    soft: 'bg-teal-50/60 ring-teal-100',
    chip: 'bg-teal-50 text-teal-700 ring-teal-100',
    selected: 'bg-teal-100/80 ring-teal-300',
    text: 'text-teal-700',
    dot: 'bg-teal-300',
    icon: 'bg-teal-50 text-teal-500 ring-teal-100',
  },
}

interface BlockchainCardProps {
  number: string // "1", "2"…
  title: string
  tone: BlockchainToneKey
  /** 'formal': tarjeta sobria (borde fino, sin manchas de color, acento índigo). Por defecto, la pastel de siempre. */
  variant?: 'default' | 'formal'
  /** solo variante formal: clases del fondo de la tarjeta (por defecto, blanco), p. ej. un degradado pastel suave */
  surface?: string
  /** solo variante formal: valor CSS de `background` con manchas pastel difuminadas que se desvanecen solas (no son un marco) */
  glow?: string
  /** posición en la cuadrícula (col-span, etc.) */
  className?: string
  /** orden dentro de su fila, para la entrada escalonada */
  index?: number
  children: React.ReactNode
}

/**
 * Contenedor común: etiqueta con el número, título y una mancha pastel decorativa.
 * Entra con un fundido al aparecer en pantalla y se eleva ligeramente al pasar el mouse.
 */
export const BlockchainCard: React.FC<BlockchainCardProps> = ({ number, title, tone, variant = 'default', surface, glow, className = '', index = 0, children }) => {
  const { ref, shown } = useReveal<HTMLElement>(0.12)
  const t = BLOCKCHAIN_TONES[tone]
  const titleId = `bc-title-${number.replace('.', '-')}`

  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      style={{ transitionDelay: `${index * 90}ms` }}
      className={`transition duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      } ${className}`}
    >
      {variant === 'formal' ? (
        <div className={`relative h-full ${glow ? 'overflow-hidden' : ''} rounded-2xl border border-slate-200 ${surface ?? 'bg-white'} p-6 shadow-sm shadow-slate-200/60`}>
          {glow && <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />}
          <header className="relative mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-md bg-slate-900 px-1.5 text-xs font-semibold tabular-nums text-white">
              {number}
            </span>
            <h3 id={titleId} className="text-lg font-semibold tracking-tight text-slate-900">
              {title}
            </h3>
          </header>
          <div className="relative">{children}</div>
        </div>
      ) : (
      <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-slate-200/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full blur-3xl ${t.blob}`}
        />
        <header className="relative mb-4 flex items-center gap-3">
          <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${t.tag}`}>{number}</span>
          <h3 id={titleId} className="text-base font-semibold leading-snug text-slate-800">
            {title}
          </h3>
        </header>
        <div className="relative">{children}</div>
      </div>
      )}
    </section>
  )
}