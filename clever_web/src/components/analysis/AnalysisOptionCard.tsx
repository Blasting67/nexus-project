import React from 'react'
import { Link } from 'react-router-dom'

export interface AnalysisOptionTheme {
  /** color inicial del velo de fondo al hover (ej. 'from-slate-100') */
  wash: string
  /** borde al pasar el mouse */
  border: string
  /** borde cuando está seleccionado */
  selectedBorder: string
  /** anillo de foco (teclado) */
  ring: string
  /** color del texto del llamado a la acción */
  accentText: string
  /** barra inferior + insignia de seleccionado */
  accentBg: string
}

export interface AnalysisOptionCardProps {
  eyebrow: string
  title: string
  description: string
  /** ruta a la que navega al hacer clic (ej. '/analisis/acciones') */
  to: string
  /** resalta la tarjeta (ej. si es la sección actual) */
  selected?: boolean
  theme: AnalysisOptionTheme
  Illustration: React.FC<{ active: boolean }>
}

export const AnalysisOptionCard: React.FC<AnalysisOptionCardProps> = ({
  eyebrow,
  title,
  description,
  to,
  selected = false,
  theme,
  Illustration,
}) => {
  return (
    <Link
      to={to}
      aria-current={selected ? 'page' : undefined}
      className={`group relative w-full overflow-hidden rounded-3xl border bg-white p-7 sm:p-9
        min-h-[360px] sm:min-h-[420px] flex flex-col justify-between text-left shadow-sm
        transition-all duration-300 ease-out
        hover:-translate-y-1.5 hover:shadow-2xl active:translate-y-0 active:scale-[0.985]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${theme.ring}
        motion-reduce:transition-none motion-reduce:hover:translate-y-0
        ${selected ? theme.selectedBorder : `border-slate-200 ${theme.border}`}`}
    >
      {/* velo de color suave que aparece al pasar el mouse */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${theme.wash} to-white transition-opacity duration-500 ${
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />

      {/* barra de acento inferior */}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-0 left-0 h-1.5 w-full origin-left ${theme.accentBg} transition-transform duration-500 ease-out ${
          selected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />

      {/* insignia de seleccionado */}
      <span
        aria-hidden="true"
        className={`absolute right-5 top-5 z-10 flex h-7 w-7 items-center justify-center rounded-full ${theme.accentBg} text-white transition-all duration-300 ${
          selected ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="3">
          <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>

      {/* texto */}
      <span className="relative z-10 block space-y-3 pr-8">
        <span className="block text-[11px] font-mono uppercase tracking-widest text-slate-500">
          {eyebrow}
        </span>
        <span className="block text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
          {title}
        </span>
        <span className="block max-w-[340px] text-sm leading-relaxed text-slate-500">
          {description}
        </span>
      </span>

      {/* imagen representativa (grande) */}
      <span className="relative z-10 mx-auto my-6 block w-full max-w-[300px] transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none">
        <Illustration active={selected} />
      </span>

      {/* llamado a la acción */}
      <span
        className={`relative z-10 inline-flex items-center gap-2 text-sm font-semibold ${theme.accentText}`}
      >
        <span>{selected ? 'Seleccionado' : 'Explorar'}</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
      </span>
    </Link>
  )
}