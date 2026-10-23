import React from 'react'
import { Link } from 'react-router-dom'
import { OPEN_ANALYSIS_SECTION } from './analysisRoute'

export const BackToAnalysisButton: React.FC = () => (
  <Link
    to="/analisis"
    state={OPEN_ANALYSIS_SECTION}
    className="group flex h-16 items-center gap-3 rounded-lg bg-[var(--text)] px-4 text-left text-[var(--bg)] shadow-sm transition-colors duration-200 hover:bg-[color-mix(in_srgb,var(--text)_86%,var(--bg))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] active:bg-[color-mix(in_srgb,var(--text)_78%,var(--bg))] motion-reduce:transition-none"
  >
    <i
      className="fa-solid fa-arrow-left w-5 shrink-0 text-center text-base transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transform-none"
      aria-hidden="true"
    ></i>
    <span className="min-w-0">
      <span className="block text-[15px] font-semibold leading-tight">Volver a Análisis</span>
      <span className="mt-0.5 block text-[11.5px] leading-tight text-[color-mix(in_srgb,var(--bg)_62%,var(--text))]">
        Elegir otro análisis
      </span>
    </span>
  </Link>
)
