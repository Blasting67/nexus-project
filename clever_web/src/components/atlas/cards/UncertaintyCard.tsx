import React from 'react'
import { AtlasCard, Readout } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { clamp, cssVars, riskColor, uncertaintyLabel } from '../atlasData'

const FOG = [
  { cx: 40, cy: 92, rx: 62, ry: 20, d: 14, delay: 0 },
  { cx: 120, cy: 78, rx: 56, ry: 18, d: 17, delay: 2 },
  { cx: 205, cy: 90, rx: 66, ry: 21, d: 15, delay: 1 },
  { cx: 270, cy: 74, rx: 52, ry: 18, d: 18, delay: 3 },
  { cx: 85, cy: 56, rx: 48, ry: 15, d: 16, delay: 4 },
  { cx: 215, cy: 52, rx: 50, ry: 15, d: 13, delay: 2.5 },
]
const MOTES = [
  { x: 40, y: 40, d: 0 },
  { x: 90, y: 70, d: 0.8 },
  { x: 140, y: 30, d: 1.4 },
  { x: 190, y: 64, d: 0.4 },
  { x: 240, y: 38, d: 2 },
  { x: 275, y: 78, d: 1.1 },
]

/** Incertidumbre → niebla sobre montañas (sin tapar nunca la interfaz) */
export const UncertaintyCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)
  const u = v / 100
  const fogOpacity = 0.04 + 0.8 * u
  const lift = (1 - u) * 24
  const motes = clamp((v - 55) / 40)

  return (
    <AtlasCard
      title="Incertidumbre"
      tip="Qué tan predecible se ve el panorama. Más niebla significa que es más difícil anticipar lo que viene."
      tint="rgba(148,163,184,0.12)"
    >
      <div className="flex flex-1 flex-col gap-3">
        <svg
          viewBox="0 0 300 120"
          preserveAspectRatio="xMidYMid slice"
          className="h-28 w-full rounded-xl ring-1 ring-slate-200"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="atlas-fog-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
            <filter id="atlas-fog-blur" x="-30%" y="-60%" width="160%" height="220%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
          </defs>

          <rect width="300" height="120" fill="url(#atlas-fog-sky)" />
          <polygon points="0,120 0,70 40,50 80,72 130,38 180,70 230,48 300,76 300,120" fill="#94a3b8" />
          <polygon points="0,120 0,88 50,66 100,90 150,60 210,92 260,70 300,90 300,120" fill="#64748b" />
          <polygon points="0,120 0,100 60,84 120,104 190,86 250,106 300,92 300,120" fill="#334155" />

          <g filter="url(#atlas-fog-blur)" opacity={fogOpacity} fill="#ffffff">
            {FOG.map((f) => (
              <g key={`${f.cx}-${f.cy}`} transform={`translate(0 ${-lift})`}>
                <ellipse
                  cx={f.cx}
                  cy={f.cy}
                  rx={f.rx}
                  ry={f.ry}
                  className="atlas-fog"
                  style={{ ...cssVars({ '--d': `${f.d}s` }), animationDelay: `${f.delay}s` }}
                />
              </g>
            ))}
          </g>

          <g opacity={motes} fill="#64748b">
            {MOTES.map((m) => (
              <circle
                key={`${m.x}-${m.y}`}
                cx={m.x}
                cy={m.y}
                r="1.6"
                className="atlas-twinkle"
                style={{ ...cssVars({ '--d': '3.4s' }), animationDelay: `${m.d}s` }}
              />
            ))}
          </g>
        </svg>

        <div className="flex items-end justify-between gap-4">
          <Readout value={Math.round(v)} suffix="/100" label={uncertaintyLabel(v)} labelColor={riskColor(v)} />
          <div className="w-32 pb-1">
            <div className="relative h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400">
              <span
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-800 shadow"
                style={{ left: `${v}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] text-slate-500">
              <span>Baja</span>
              <span>Alta</span>
            </div>
          </div>
        </div>
      </div>
    </AtlasCard>
  )
}