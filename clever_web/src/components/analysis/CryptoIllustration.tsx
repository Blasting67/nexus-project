import React from 'react'

interface IllustrationProps {
  /** true cuando la tarjeta está seleccionada (la animación la controla el CSS de la tarjeta) */
  active: boolean
}

const CX = 120
const CY = 80

const NODES = [
  { x: 46, y: 40, r: 7 },
  { x: 196, y: 34, r: 6 },
  { x: 32, y: 112, r: 5.5 },
  { x: 206, y: 122, r: 7 },
  { x: 120, y: 144, r: 5 },
]

const ORBIT_R = 50
const SATELLITES = [
  { a: 30, r: 4, fill: '#fbbf24' },
  { a: 200, r: 3, fill: '#c4b5fd' },
].map((s) => ({
  ...s,
  x: CX + ORBIT_R * Math.cos((s.a * Math.PI) / 180),
  y: CY + ORBIT_R * Math.sin((s.a * Math.PI) / 180),
}))

// chispas que salen de la moneda al pasar el mouse
const SPARKS = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 + 0.4
  return { dx: Math.round(Math.cos(a) * 54), dy: Math.round(Math.sin(a) * 54), fill: i % 2 ? '#c4b5fd' : '#fbbf24' }
})

const vars = (v: Record<string, string | number>) => v as unknown as React.CSSProperties

/**
 * Moneda con red de nodos: la moneda flota y la órbita gira despacio. Al pasar el mouse la moneda
 * da una vuelta, la red se enciende nodo a nodo, aparece un anillo de onda y salen chispas.
 * (Las animaciones viven en el CSS de AnalysisOptionCard, bajo la clase `.ao-root`.)
 */
export const CryptoIllustration: React.FC<IllustrationProps> = () => (
  <svg viewBox="0 0 240 160" className="h-auto w-full" aria-hidden="true">
    <defs>
      <radialGradient id="ao-coin" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#fef3c7" />
        <stop offset="55%" stopColor="#fcd34d" />
        <stop offset="100%" stopColor="#f59e0b" />
      </radialGradient>
      <radialGradient id="ao-coin-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fde68a" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#fde68a" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* red de conexiones */}
    <g fill="none" stroke="#c4b5fd" strokeWidth="1.6" strokeLinecap="round">
      {NODES.map((n, i) => (
        <path
          key={i}
          className="ao-link"
          style={vars({ '--i': i })}
          d={`M${CX} ${CY} L${n.x} ${n.y}`}
          pathLength={1}
        />
      ))}
    </g>

    {/* nodos */}
    {NODES.map((n, i) => (
      <g key={i} className="ao-node ao-origin-c" style={vars({ '--i': i })}>
        <circle cx={n.x} cy={n.y} r={n.r} fill="#fff" stroke="#c4b5fd" strokeWidth="2" />
        <circle cx={n.x} cy={n.y} r={n.r / 2.6} fill="#c4b5fd" />
      </g>
    ))}

    {/* resplandor */}
    <circle className="ao-glow ao-origin-c" cx={CX} cy={CY} r="44" fill="url(#ao-coin-glow)" />

    {/* órbita lenta con dos satélites */}
    <g className="ao-orbit ao-origin-c">
      <circle cx={CX} cy={CY} r={ORBIT_R} fill="none" stroke="#c4b5fd" strokeOpacity="0.7" strokeDasharray="3 6" />
      {SATELLITES.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.fill} />
      ))}
    </g>

    {/* onda al pasar el mouse */}
    <circle className="ao-ring ao-origin-c" cx={CX} cy={CY} r="34" fill="none" stroke="#fbbf24" strokeWidth="1.6" />

    {/* chispas (salen de detrás de la moneda) */}
    {SPARKS.map((s, i) => (
      <circle
        key={i}
        className="ao-spark ao-origin-c"
        style={vars({ '--i': i, '--dx': `${s.dx}px`, '--dy': `${s.dy}px` })}
        cx={CX}
        cy={CY}
        r="2.4"
        fill={s.fill}
      />
    ))}

    {/* moneda */}
    <g className="ao-float">
      <g className="ao-flip ao-origin-c">
        <circle cx={CX} cy={CY} r="28" fill="url(#ao-coin)" stroke="#f59e0b" strokeWidth="1.5" />
        <circle cx={CX} cy={CY} r="22" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="1.4" />
        <path d="M101 68a24 24 0 0 1 14-12" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round" />
        <text
          x={CX}
          y={CY + 10.5}
          textAnchor="middle"
          fontSize="30"
          fontWeight="700"
          fill="#b45309"
          style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
        >
          ₿
        </text>
      </g>
    </g>
  </svg>
)