import React from 'react'
import { Link } from 'react-router-dom'
import { AnalysisOptionCard } from '../components/analysis/AnalysisOptionCard'
import { ANALYSIS_OPTIONS } from '../components/analysis/AnalysisOptions'

export const AnalysisPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Análisis Técnico
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Guía práctica para la interpretación de gráficos de precios y estructuras de mercado.
          </p>
        </div>

        <Link
          to="/exchange"
          className="platform-btn-secondary py-1.5 px-3 text-xs self-start sm:self-auto"
        >
          Ver gráficos en vivo
        </Link>
      </div>

      {/* Selector de tipo de análisis: cada tarjeta navega a su ruta */}
      <section aria-label="Tipo de análisis" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ANALYSIS_OPTIONS.map(({ kind, path, ...option }) => (
          <AnalysisOptionCard key={kind} {...option} to={path} />
        ))}
      </section>

      {/* La vela japonesa está guardada en components/analysis/CandlestickStructure.tsx */}
    </div>
  )
}