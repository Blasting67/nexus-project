import React from 'react'
import { Link } from 'react-router-dom'
import { OPEN_ANALYSIS_SECTION } from './analysisRoute'

/**
 * Botón de la barra lateral para regresar a /analisis.
 * Más alto que los botones de los temas y en tono oscuro sólido, para que se distinga sin adornos.
 * Abre /analisis directamente en la sección "Análisis".
 */
export const BackToAnalysisButton: React.FC = () => (
  <Link
    to="/analisis"
    state={OPEN_ANALYSIS_SECTION}
    className="group flex h-16 items-center gap-3 rounded-lg bg-slate-900 px-4 text-left text-white shadow-sm transition-colors duration-200 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 active:bg-slate-950 motion-reduce:transition-none"
  >
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 10H4M9 5l-5 5 5 5" />
    </svg>
    <span className="min-w-0">
      <span className="block text-[15px] font-semibold leading-tight">Volver a Análisis</span>
      <span className="mt-0.5 block text-[11.5px] leading-tight text-slate-400">Elegir otro análisis</span>
    </span>
  </Link>
)