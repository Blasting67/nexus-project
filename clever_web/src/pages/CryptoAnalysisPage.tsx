import React from 'react'
import { BackToAnalysisLink } from '../components/analysis/BackToAnalysisLink'
import { CryptoHud } from '../components/crypto/CryptoHud'

/**
 * Análisis de criptos.
 * La cabecera es fija; lo que cambia es la sección que se ve (barra inferior, rueda del mouse o flechas del teclado).
 */
export const CryptoAnalysisPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <BackToAnalysisLink />

        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Análisis de Blockchain y Criptomonedas
          <h2 className="mt-1 text-sm sm:text-base font-normal text-[var(--text-muted)] tracking-tight">
            Aprende los conceptos clave de blockchain y como interpretar la información de las criptomonedas.
          </h2>
        </h1>
      </div>

      <CryptoHud />
    </div>
  )
}