import React from 'react'
import { CandlestickStructure } from '../components/analysis/CandlestickStructure'

export const StockAnalysisPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
        ¡Hola! Análisis de acciones
      </h1>

      <CandlestickStructure />
    </div>
  )
}