import React from 'react'
import type { MistakeIconKey } from './MistakeData'

/** Base común: iconos de trazo fino que heredan el color del texto. */
const Svg: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5"
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const MISTAKE_ICONS: Record<MistakeIconKey, React.FC> = {
  // lupa tachada: no se analiza
  signals: () => (
    <Svg>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
      <path d="M8.5 8.5l4 4M12.5 8.5l-4 4" />
    </Svg>
  ),
  // flechas cruzadas: saltar de un lado a otro
  hop: () => (
    <Svg>
      <path d="M4 8h14" />
      <path d="M14 4l4 4-4 4" />
      <path d="M20 16H6" />
      <path d="M10 12l-4 4 4 4" />
    </Svg>
  ),
  // tres ondas: demasiadas señales
  layers: () => (
    <Svg>
      <path d="M3 6c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 12c3-3 6 3 9 0s6 3 9 0" />
      <path d="M3 18c3-3 6 3 9 0s6 3 9 0" />
    </Svg>
  ),
  // dos hojas: copiar
  copy: () => (
    <Svg>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </Svg>
  ),
  // moneda con signo de pesos: poco capital
  coins: () => (
    <Svg>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 6.5V8M12 16v1.5" />
      <path d="M14.6 9.6C14.4 8.7 13.4 8 12 8s-2.5.7-2.5 1.7c0 2.4 5 1.1 5 3.5 0 1-1.1 1.7-2.5 1.7s-2.3-.6-2.6-1.6" />
    </Svg>
  ),
  // nube de pensamiento
  mind: () => (
    <Svg>
      <path d="M7.5 15.5a4 4 0 0 1-.7-7.9A5.5 5.5 0 0 1 17.3 8a3.8 3.8 0 0 1-.3 7.5z" />
      <circle cx="8" cy="19" r="1" />
      <circle cx="5.5" cy="21.5" r="0.7" />
    </Svg>
  ),
  // escudo con aviso: falsa sensación de seguridad
  shield: () => (
    <Svg>
      <path d="M12 3l7 3v5c0 4.6-3 7.6-7 9.5C8 18.6 5 15.6 5 11V6z" />
      <path d="M12 8.5v4" />
      <path d="M12 15.5h.01" />
    </Svg>
  ),
  // maletín: ingreso principal
  briefcase: () => (
    <Svg>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
      <path d="M3 13h18" />
    </Svg>
  ),
}
