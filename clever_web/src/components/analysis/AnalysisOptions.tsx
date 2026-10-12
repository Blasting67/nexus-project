import React from 'react'
import type { AnalysisOptionTheme } from './AnalysisOptionCard'
import { StocksIllustration } from './StocksIllustration'
import { CryptoIllustration } from './CryptoIllustration'

export type AnalysisKind = 'acciones' | 'criptos'

export interface AnalysisOption {
  kind: AnalysisKind
  /** ruta registrada en App.tsx */
  path: string
  eyebrow: string
  title: string
  description: string
  theme: AnalysisOptionTheme
  Illustration: React.FC<{ active: boolean }>
}

/**
 * Opciones que muestra la página de Análisis Técnico.
 * Para agregar una nueva (ej. "Forex"), añade un objeto aquí y su ilustración.
 */
export const ANALYSIS_OPTIONS: AnalysisOption[] = [
  {
    kind: 'acciones',
    path: '/analisis/acciones',
    eyebrow: 'Mercado bursátil',
    title: 'Análisis de acciones',
    description:
      'Evalúa la evolución de empresas cotizadas mediante gráficos, tendencias y volumen.',
    theme: {
      wash: 'from-slate-100',
      border: 'hover:border-slate-400',
      selectedBorder: 'border-[#1e3a5f] shadow-lg',
      ring: 'focus-visible:ring-[#1e3a5f]',
      accentText: 'text-[#1e3a5f]',
      accentBg: 'bg-[#1e3a5f]',
    },
    Illustration: StocksIllustration,
  },
  {
    kind: 'criptos',
    path: '/analisis/criptos',
    eyebrow: 'Activos digitales',
    title: 'Análisis de criptos',
    description:
      'Interpreta el comportamiento de criptomonedas y su estructura de mercado.',
    theme: {
      wash: 'from-teal-50',
      border: 'hover:border-teal-600/50',
      selectedBorder: 'border-teal-800 shadow-lg',
      ring: 'focus-visible:ring-teal-800',
      accentText: 'text-teal-800',
      accentBg: 'bg-teal-800',
    },
    Illustration: CryptoIllustration,
  },
]