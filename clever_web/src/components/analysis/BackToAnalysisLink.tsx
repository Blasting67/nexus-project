import React from 'react'
import { Link } from 'react-router-dom'
import { OPEN_ANALYSIS_SECTION } from './analysisRoute'

/**
 * Botón "Volver a Análisis" de las páginas de criptos y acciones.
 * Lleva a /analisis y le pide abrir directamente la sección "Análisis" (donde están los botones de estas páginas).
 */
export const BackToAnalysisLink: React.FC = () => (
  <Link
    to="/analisis"
    state={OPEN_ANALYSIS_SECTION}
    className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition duration-200 hover:border-amber-300 hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-95"
  >
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4l-6 6 6 6" />
    </svg>
    Volver a Análisis
  </Link>
)
