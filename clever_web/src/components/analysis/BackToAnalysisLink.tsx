import React from 'react'
import { Link } from 'react-router-dom'
import { OPEN_ANALYSIS_SECTION } from './analysisRoute'

/**
 * Enlace "Volver a Análisis" de la página de criptos: texto con flecha, sin recuadro.
 * Lleva a /analisis y le pide abrir directamente la sección "Análisis" (donde están los botones de estas páginas).
 */
export const BackToAnalysisLink: React.FC = () => (
  <Link
    to="/analisis"
    state={OPEN_ANALYSIS_SECTION}
    className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-600 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
  >
    <svg
      viewBox="0 0 20 20"
      className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none"
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