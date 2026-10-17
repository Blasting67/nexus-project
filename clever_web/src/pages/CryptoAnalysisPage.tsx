import React from 'react'
import { CryptoHud } from '../components/crypto/CryptoHud'

/**
 * Análisis de criptos.
 * La cabecera es fija. Los temas (barra lateral, con el botón grande de "Volver a Análisis" arriba) cambian con la rueda
 * del mouse o ↑ ↓; los subtemas (barra de puntos de abajo) se deslizan de lado con ← → o con los puntos.
 */
export const CryptoAnalysisPage: React.FC = () => {
  return (
    <CryptoHud
      header={
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
          Análisis de Blockchain y Criptomonedas
          <h2 className="mt-1 text-sm sm:text-base font-normal text-[var(--text-muted)] tracking-tight">
            Aprende los conceptos clave de blockchain y como interpretar la información de las criptomonedas.
          </h2>
        </h1>
      }
    />
  )
}