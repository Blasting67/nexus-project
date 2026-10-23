import React from 'react'
import { InfoTip } from '../AtlasCard'
import { RiskShield } from './RiskShield'
import { BearMascot, BullMascot } from '../scenes/BullBear'
import { useSmoothNumber } from '../useSmoothNumber'
import { lerp, riskColor, riskLabel } from '../atlasData'
import { animVars } from '../animVars'

/**
 * Presión del mercado (compra vs venta): el oso (bear market) empuja desde los vendedores y el toro (bull market)
 * desde los compradores; la moneda se desplaza hacia el lado que domina. Incluye el escudo de Riesgo.
 */
export const PressureCard: React.FC<{ buySell: number; risk: number }> = ({ buySell, risk }) => {
  const v = useSmoothNumber(buySell)
  const r = useSmoothNumber(risk)

  const buyers = Math.round(v)
  const sellers = 100 - buyers
  const buyPower = v / 100
  const sellPower = 1 - buyPower
  const buyDominant = v >= 50
  const strength = Math.abs(v - 50) / 50

  return (
    <section
      className="relative isolate overflow-hidden rounded-2xl border border-white/80 shadow-md shadow-slate-300/60 ring-1 ring-slate-200/80"
      style={{
        background: `linear-gradient(90deg, rgba(254,202,202,${0.2 + 0.5 * sellPower}) 0%, var(--color-white) 36%, var(--color-white) 64%, rgba(187,247,208,${0.2 + 0.5 * buyPower}) 100%)`,
      }}
    >
      <div className="grid grid-cols-2 items-center gap-x-3 gap-y-2 px-3 py-1.5 sm:grid-cols-[auto_1fr_1fr_auto] lg:grid-cols-[auto_auto_minmax(0,1fr)_auto_auto_auto]">
        {/* oso: vendedores */}
        <BearMascot power={sellPower} className="h-[88px] w-[96px] shrink-0 lg:order-1" />
        <div className="lg:order-2">
          <div className="text-[30px] font-bold leading-none tabular-nums text-rose-600">{sellers}%</div>
          <div className="mt-1 text-[12px] font-semibold text-slate-700">Vendedores</div>
          <div className="text-[10.5px] text-rose-500">Mercado bajista · oso</div>
        </div>

        {/* compradores: toro */}
        <div className="text-right lg:order-4">
          <div className="text-[30px] font-bold leading-none tabular-nums text-emerald-600">{buyers}%</div>
          <div className="mt-1 text-[12px] font-semibold text-slate-700">Compradores</div>
          <div className="text-[10.5px] text-emerald-600">Mercado alcista · toro</div>
        </div>
        <BullMascot power={buyPower} className="h-[88px] w-[96px] shrink-0 lg:order-5" />

        {/* pista de presión */}
        <div className="col-span-2 sm:col-span-4 lg:order-3 lg:col-span-1">
          <div className="mb-0.5 flex items-center justify-center gap-2">
            <h3 className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide text-slate-700 shadow-sm ring-1 ring-white/70">
              Presión del mercado
            </h3>
            <InfoTip
              text="Compara cuánta gente quiere comprar frente a cuánta quiere vender en este momento."
              more={{
                title: 'Bull y bear market',
                note: (
                  <>
                    <strong className="text-emerald-700">Bull market (mercado alcista):</strong> dominan los compradores y los precios suben.{' '}
                    <strong className="text-rose-700">Bear market (mercado bajista):</strong> dominan los vendedores y los precios bajan.
                  </>
                ),
              }}
            />
          </div>

          <div className="relative mx-2 h-12" aria-hidden="true">
            <div className="absolute inset-x-0 top-1/2 h-4 -translate-y-1/2 rounded-full bg-gradient-to-r from-rose-300 via-slate-200 to-emerald-300 shadow-inner ring-1 ring-white/80" />

            {/* ventaja: del centro hasta la moneda, con franjas que avanzan hacia el lado que domina */}
            <div
              className={`absolute top-1/2 h-4 -translate-y-1/2 rounded-full ${buyDominant ? 'sc-stripes' : 'sc-stripes-l'}`}
              style={{
                left: `${Math.min(50, v)}%`,
                width: `${Math.abs(v - 50)}%`,
                backgroundColor: buyDominant ? '#16a34a' : '#dc2626',
                backgroundImage: 'linear-gradient(115deg, rgba(255,255,255,.38) 25%, transparent 25% 50%, rgba(255,255,255,.38) 50% 75%, transparent 75%)',
                backgroundSize: '18px 18px',
                ...animVars({ '--d': `${lerp(1.6, 0.45, strength)}s` }),
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-6 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded bg-white shadow" />

            {/* moneda */}
            <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${v}%` }}>
              <svg viewBox="-20 -20 40 40" className="h-10 w-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                <defs>
                  <radialGradient id="atlas-coin" cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#d97706" />
                  </radialGradient>
                </defs>
                <g className="sc-pulse sc-fb sc-oc" style={animVars({ '--d': '1.8s', '--s': 1.08 })}>
                  <circle r="16" fill="url(#atlas-coin)" stroke="#78350f" strokeWidth="1.6" />
                  <circle r="12.2" fill="none" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.1" />
                  <text y="6" textAnchor="middle" fontSize="17" fontWeight="700" fill="#451a03">
                    ₿
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* riesgo */}
        <div className="col-span-2 flex items-center justify-center gap-3 sm:col-span-4 lg:order-6 lg:col-span-1 lg:border-l lg:border-slate-200 lg:pl-4">
          <RiskShield value={r} className="h-[86px] w-[68px] shrink-0" />
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-[12px] text-slate-600">
              Riesgo
              <InfoTip text="Refleja qué tan expuesto está el activo a caídas bruscas. Más grietas en el escudo significa más riesgo." align="right" />
            </div>
            <div className="mt-0.5 text-[26px] font-bold leading-none tabular-nums text-slate-900">
              {Math.round(r)}
              <span className="ml-0.5 text-[10px] font-normal text-slate-500">/100</span>
            </div>
            <div className="mt-0.5 text-[12px] font-semibold" style={{ color: riskColor(r) }}>
              {riskLabel(r)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}