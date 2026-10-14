import React from 'react'
import { CandlestickStructure } from '../components/analysis/CandlestickStructure'
import { CandlePatterns } from '../components/trading/CandlePatterns'
import { CommandmentsBook } from '../components/trading/CommandmentsBook'
import { CommonMistakes } from '../components/trading/CommonMistakes'
import { Indicators } from '../components/trading/Indicators'
import { ChartTypes } from '../components/trading/ChartTypes'
import { OperationTypes } from '../components/trading/OperationTypes'

export const StockAnalysisPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-10">
      <h1 className="text-xl font-bold tracking-tight text-[var(--text)] sm:text-2xl">
        Análisis Técnico de Acciones
        <h2 className="mt-1 text-sm font-normal text-[var(--text-muted)]">
          Información para fácil interpretación.
        </h2>
      </h1>

      <OperationTypes />
      <ChartTypes />

      {/* Estructura de una vela japonesa (componente reutilizable) */}
      <CandlestickStructure />

      {/* Parte 3: patrones de velas japonesas */}
      <CandlePatterns />

      {/* Parte 4: indicadores y herramientas de análisis */}
      <Indicators />

      {/* Parte 5: errores comunes */}
      <CommonMistakes />

      {/* Parte 6: los 12 mandamientos */}
      <CommandmentsBook />
    </div>
  )
}