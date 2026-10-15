import React from 'react'
import { BackToAnalysisLink } from '../components/analysis/BackToAnalysisLink'
import { StocksHud } from '../components/stocks/StocksHud'

/**
 * Análisis de acciones.
 * La cabecera es fija. Los temas (barra lateral) cambian con la rueda del mouse o ↑ ↓;
 * los subtemas (barra de puntos de abajo) se deslizan de lado con ← → o con los puntos.
 */
export const StockAnalysisPage: React.FC = () => {
  return (
    <StocksHud
      header={
        <div className="flex flex-wrap items-center gap-4">
          <BackToAnalysisLink />

          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Análisis de acciones
            <h2 className="mt-1 text-sm sm:text-base font-normal text-[var(--text-muted)] tracking-tight">
              Aprende a analizar las herramientas y comportamiento de lasacciones para tomar las decisiones.
            </h2>
          </h1>
        </div>
      }
    />
  )
}