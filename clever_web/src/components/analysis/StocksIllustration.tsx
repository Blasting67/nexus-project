import React from 'react'

interface IllustrationProps {
  /** true cuando el botón padre está seleccionado (mantiene la animación activa) */
  active: boolean
}

/**
 * Ilustración de gráfico bursátil (SVG inline).
 * Se anima con `group-hover` del botón padre (el padre debe tener la clase `group`).
 */
export const StocksIllustration: React.FC<IllustrationProps> = ({ active }) => {
  const bars = [
    { x: 14, h: 38 },
    { x: 40, h: 58 },
    { x: 66, h: 46 },
    { x: 92, h: 76 },
    { x: 118, h: 92 },
  ]

  return (
    <svg viewBox="0 0 160 120" className="w-full h-auto" aria-hidden="true">
      {/* línea base */}
      <line x1="6" y1="110" x2="154" y2="110" className="stroke-slate-300" strokeWidth="1.5" />

      {/* barras: crecen al pasar el mouse */}
      {bars.map((b, i) => (
        <rect
          key={b.x}
          x={b.x}
          y={110 - b.h}
          width="18"
          height={b.h}
          rx="3"
          style={{ transitionDelay: `${i * 70}ms` }}
          className={`origin-bottom [transform-box:fill-box] transition-all duration-500 ease-out motion-reduce:transition-none ${
            active
              ? 'scale-y-100 fill-[#1e3a5f]'
              : 'scale-y-75 fill-slate-300 group-hover:scale-y-100 group-hover:fill-[#1e3a5f]'
          }`}
        />
      ))}

      {/* línea de tendencia: se "dibuja" completa al pasar el mouse */}
      <polyline
        points="12,80 40,62 66,70 92,42 122,50 150,20"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`stroke-slate-500 [stroke-dasharray:180] transition-all duration-700 ease-out motion-reduce:transition-none ${
          active
            ? '[stroke-dashoffset:0]'
            : '[stroke-dashoffset:90] group-hover:[stroke-dashoffset:0]'
        }`}
      />
      <circle
        cx="150"
        cy="20"
        r="4.5"
        className={`fill-slate-700 transition-opacity duration-500 delay-500 motion-reduce:transition-none ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
      />
    </svg>
  )
}