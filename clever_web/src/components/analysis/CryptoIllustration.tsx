import React from 'react'

interface IllustrationProps {
  /** true cuando el botón padre está seleccionado (mantiene la animación activa) */
  active: boolean
}

/**
 * Ilustración de moneda + red de nodos (SVG inline).
 * Se anima con `group-hover` del botón padre (el padre debe tener la clase `group`).
 */
export const CryptoIllustration: React.FC<IllustrationProps> = ({ active }) => {
  const nodes = [
    { x: 22, y: 28 },
    { x: 138, y: 26 },
    { x: 28, y: 96 },
    { x: 136, y: 94 },
  ]

  return (
    <svg viewBox="0 0 160 120" className="w-full h-auto" aria-hidden="true">
      {/* conexiones de red */}
      {nodes.map((n) => (
        <line
          key={`l-${n.x}-${n.y}`}
          x1="80"
          y1="60"
          x2={n.x}
          y2={n.y}
          strokeWidth="1.5"
          className={`transition-colors duration-500 motion-reduce:transition-none ${
            active ? 'stroke-teal-600' : 'stroke-slate-300 group-hover:stroke-teal-600'
          }`}
        />
      ))}

      {/* nodos: crecen ligeramente */}
      {nodes.map((n, i) => (
        <circle
          key={`n-${n.x}-${n.y}`}
          cx={n.x}
          cy={n.y}
          r="6"
          style={{ transitionDelay: `${i * 80}ms` }}
          className={`origin-center [transform-box:fill-box] transition-all duration-500 motion-reduce:transition-none ${
            active
              ? 'scale-125 fill-teal-700'
              : 'fill-slate-300 group-hover:scale-125 group-hover:fill-teal-700'
          }`}
        />
      ))}

      {/* pulso suave alrededor de la moneda (solo al pasar el mouse) */}
      <circle
        cx="80"
        cy="60"
        r="30"
        fill="none"
        strokeWidth="1.5"
        className="origin-center [transform-box:fill-box] stroke-teal-600/60 opacity-0 group-hover:opacity-100 group-hover:animate-ping motion-reduce:animate-none"
      />

      {/* moneda: gira al pasar el mouse */}
      <g
        className={`origin-center [transform-box:fill-box] transition-transform duration-700 ease-out motion-reduce:transition-none ${
          active ? 'rotate-[360deg]' : 'group-hover:rotate-[360deg]'
        }`}
      >
        <circle cx="80" cy="60" r="26" className="fill-amber-600/80" />
        <circle cx="80" cy="60" r="21" fill="none" strokeWidth="1.5" className="stroke-white/50" />
        <text
          x="80"
          y="69"
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          className="fill-white"
          style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
        >
          ₿
        </text>
      </g>
    </svg>
  )
}