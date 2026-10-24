import React from 'react'

interface IllustrationProps {
  active: boolean
}

const BASE = 128
const HEIGHTS = [34, 52, 44, 70, 58, 84, 98]
const CX = HEIGHTS.map((_, i) => 35 + i * 26)

function curve(pts: Array<[number, number]>): string {
  let d = `M${pts[0][0]},${pts[0][1]}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0]},${p2[1]}`
  }
  return d
}

const POINTS: Array<[number, number]> = CX.map((x, i) => [x, BASE - HEIGHTS[i] - 12])
const LINE = curve(POINTS)
const END = POINTS[POINTS.length - 1]
const AREA = `${LINE} L${END[0]},${BASE} L${POINTS[0][0]},${BASE} Z`

const vars = (v: Record<string, string | number>) => v as unknown as React.CSSProperties

export const StocksIllustration: React.FC<IllustrationProps> = () => (
  <svg viewBox="0 0 240 160" className="h-auto w-full" aria-hidden="true">
    <defs>
      <linearGradient id="ao-bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" />
        <stop offset="100%" stopColor="#7dd3fc" />
      </linearGradient>
      <linearGradient id="ao-bar-hi" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c7d2fe" />
        <stop offset="100%" stopColor="#818cf8" />
      </linearGradient>
      <linearGradient id="ao-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ao-line" gradientUnits="userSpaceOnUse" x1="30" y1="0" x2="200" y2="0">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#6366f1" />
      </linearGradient>
    </defs>

    <rect className="ao-panel" x="6" y="6" width="228" height="148" rx="20" fill="#fff" fillOpacity="0.6" stroke="#e0f2fe" />

    <g stroke="#bae6fd" strokeOpacity="0.7" strokeDasharray="3 5">
      <line x1="20" x2="220" y1="52" y2="52" />
      <line x1="20" x2="220" y1="84" y2="84" />
      <line x1="20" x2="220" y1="116" y2="116" />
    </g>
    <line x1="20" x2="220" y1={BASE} y2={BASE} stroke="#e0f2fe" />

    <path className="ao-area" d={AREA} fill="url(#ao-area)" />

    {HEIGHTS.map((h, i) => (
      <rect
        key={i}
        className="ao-bar ao-origin-b"
        style={vars({ '--i': i })}
        x={CX[i] - 7}
        y={BASE - h}
        width="14"
        height={h}
        rx="5"
        fill={i === HEIGHTS.length - 1 ? 'url(#ao-bar-hi)' : 'url(#ao-bar)'}
      />
    ))}

    <path
      className="ao-line"
      d={LINE}
      pathLength={1}
      fill="none"
      stroke="url(#ao-line)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <g style={{ filter: 'drop-shadow(0 0 5px rgba(99,102,241,.55))' }}>
      <path className="ao-dot" d={LINE} pathLength={1} fill="none" stroke="#6366f1" strokeWidth="10" strokeLinecap="round" />
      <path className="ao-dot" d={LINE} pathLength={1} fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
    </g>

    <g className="ao-pop ao-origin-c">
      <rect x="204" y="22" width="28" height="22" rx="11" fill="#d1fae5" stroke="#6ee7b7" />
      <path d="M218 38V28M213.5 32.5L218 28l4.5 4.5" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    <g fill="none" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round">
      <path className="ao-twinkle ao-origin-c" style={vars({ '--i': 0 })} d="M26 30v8M22 34h8" />
      <path className="ao-twinkle ao-origin-c" style={vars({ '--i': 1 })} d="M118 22v6M115 25h6" />
      <path className="ao-twinkle ao-origin-c" style={vars({ '--i': 2 })} d="M212 66v6M209 69h6" />
    </g>
  </svg>
)