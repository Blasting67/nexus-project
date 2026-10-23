import React from 'react'
import { Link } from 'react-router-dom'
import { OPEN_ANALYSIS_SECTION } from './analysisRoute'

export const BackToAnalysisLink: React.FC = () => (
  <Link
    to="/analisis"
    state={OPEN_ANALYSIS_SECTION}
    className="group inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[var(--text-muted)] transition-colors duration-200 hover:bg-[var(--surface-alt)] hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
  >
    <i
      className="fa-solid fa-chevron-left text-xs transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none"
      aria-hidden="true"
    ></i>
    Volver a Análisis
  </Link>
)
