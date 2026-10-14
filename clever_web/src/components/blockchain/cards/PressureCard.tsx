import React from 'react'
import { AtlasCard, InfoTip } from '../AtlasCard'
import { RiskShield } from './RiskShield'
import { useSmoothNumber } from '../useSmoothNumber'
import { cssVars, lerp, riskColor, riskLabel } from '../atlasData'

const PARTICLE_Y = [33, 38, 43, 47, 36, 45, 40]

/**
 * Presión del mercado (compra vs venta) → la moneda se desplaza hacia el lado dominante.
 * Incluye el escudo de Riesgo en el costado, como en el diseño.
 */
export const PressureCard: React.FC<{ buySell: number; risk: number }> = ({ buySell, risk }) => {
  const v = useSmoothNumber(buySell)
  const r = useSmoothNumber(risk)

  const buyers = Math.round(v)
  const sellers = 100 - buyers
  const buyDominant = v >= 50
  const strength = Math.abs(v - 50) / 50
  const coinX = 30 + (v / 100) * 240
  const dir = buyDominant ? 1 : -1
  const reach = 18 + strength * 52
  const color = buyDominant ? '#16a34a' : '#dc2626'

  return (
    <AtlasCard
      title="Presión del mercado"
      tip="Compara cuánta gente quiere comprar frente a cuánta quiere vender en este momento."
      tint="rgba(74,222,128,0.08)"
    >
      <div className="grid items-center gap-5 sm:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-1 flex items-end justify-between">
            <div>
              <div className="text-3xl font-semibold tabular-nums text-rose-600">{sellers}%</div>
              <div className="text-xs text-slate-500">Vendedores</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-semibold tabular-nums text-emerald-600">{buyers}%</div>
              <div className="text-xs text-slate-500">Compradores</div>
            </div>
          </div>

          <svg viewBox="0 0 300 80" className="h-20 w-full" aria-hidden="true">
            <defs>
              <linearGradient id="atlas-force-track" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="50%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#4ade80" />
              </linearGradient>
              <radialGradient id="atlas-coin" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#d97706" />
              </radialGradient>
            </defs>

            <rect x="20" y="38" width="260" height="4" rx="2" fill="url(#atlas-force-track)" opacity="0.7" />

            {/* partículas que fluyen hacia el lado dominante */}
            <g fill={color}>
              {PARTICLE_Y.map((y, i) => (
                <circle
                  key={i}
                  cx={coinX}
                  cy={y}
                  r="2.4"
                  className="atlas-flow"
                  style={{
                    ...cssVars({ '--d': `${lerp(1.8, 0.6, strength)}s`, '--to': `${dir * reach}px` }),
                    animationDelay: `${i * 0.17}s`,
                  }}
                />
              ))}
            </g>

            <g transform={`translate(${coinX} 40)`} style={{ filter: 'drop-shadow(0 0 8px rgba(251,191,36,.7))' }}>
              <circle r="14" fill="url(#atlas-coin)" stroke="#78350f" strokeWidth="1.5" />
              <text y="5" textAnchor="middle" fontSize="15" fontWeight="700" fill="#451a03">
                ₿
              </text>
            </g>
          </svg>
        </div>

        {/* Riesgo */}
        <div className="flex items-center gap-4 sm:flex-col sm:gap-2 sm:border-l sm:border-slate-200 sm:pl-5">
          <RiskShield value={r} className="h-24 w-20" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              Riesgo
              <InfoTip
                text="Refleja qué tan expuesto está el activo a caídas bruscas. Más grietas en el escudo significa más riesgo."
                align="right"
              />
            </div>
            <div className="text-xl font-semibold tabular-nums text-slate-900">
              {Math.round(r)}
              <span className="text-xs font-normal text-slate-500">/100</span>
            </div>
            <div className="text-xs font-medium" style={{ color: riskColor(r) }}>
              {riskLabel(r)}
            </div>
          </div>
        </div>
      </div>
    </AtlasCard>
  )
}
