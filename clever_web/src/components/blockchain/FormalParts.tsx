import React from 'react'

/** Piezas pequeñas compartidas por las tarjetas de estilo formal. */

/** Etiqueta pequeña en mayúsculas sobre un bloque de texto. */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  // si no se indica un color de texto, usa el gris de siempre (así un margen no le quita el color)
  <p className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${/\btext-/.test(className) ? '' : 'text-slate-400'} ${className}`}>{children}</p>
)

/** Término destacado dentro de un párrafo. */
export const Term: React.FC<{ children: React.ReactNode }> = ({ children }) => <span className="font-medium text-slate-800">{children}</span>

/** Nota con una línea de acento a la izquierda. */
export const Callout: React.FC<{ label?: string; children: React.ReactNode; className?: string }> = ({ label, children, className = '' }) => (
  <div className={`border-l-2 border-indigo-300 pl-4 ${className}`}>
    {label && <Eyebrow className="mb-1 text-indigo-500">{label}</Eyebrow>}
    <div className="text-sm leading-relaxed text-slate-600">{children}</div>
  </div>
)

/** Une elementos como "a, b y c". */
export function joinEs(items: React.ReactNode[]): React.ReactNode {
  return items.map((item, i) => (
    <React.Fragment key={i}>
      {i > 0 && (i === items.length - 1 ? ' y ' : ', ')}
      {item}
    </React.Fragment>
  ))
}

const PASTEL = {
  sky: '186,230,253',
  mint: '167,243,208',
  violet: '221,214,254',
  amber: '253,230,138',
  peach: '254,215,170',
  indigo: '199,210,254',
} as const
export type Pastel = keyof typeof PASTEL

/**
 * Tres manchas pastel difuminadas para el fondo de una tarjeta (esquina superior izquierda, inferior derecha y superior derecha).
 * Se desvanecen por completo antes de llegar a los bordes, así que no se ven como un marco. Va en la propiedad `glow` de BlockchainCard.
 */
export const pastelGlow = (topLeft: Pastel, bottomRight: Pastel, topRight: Pastel): string =>
  `radial-gradient(ellipse 40% 55% at 6% 10%, rgba(${PASTEL[topLeft]},0.42) 0%, rgba(${PASTEL[topLeft]},0) 100%),` +
  `radial-gradient(ellipse 40% 55% at 96% 96%, rgba(${PASTEL[bottomRight]},0.38) 0%, rgba(${PASTEL[bottomRight]},0) 100%),` +
  `radial-gradient(ellipse 28% 40% at 92% 6%, rgba(${PASTEL[topRight]},0.34) 0%, rgba(${PASTEL[topRight]},0) 100%)`