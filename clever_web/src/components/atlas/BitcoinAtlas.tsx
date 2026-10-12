import React, { useCallback, useState } from 'react'
import { AtlasHeader } from './AtlasHeader'
import { AtlasStyles } from './AtlasStyles'
import { SimulatorPanel } from './SimulatorPanel'
import { useSmoothNumber } from './useSmoothNumber'
import { DEFAULT_DATA, PRESETS } from './atlasData'
import type { AtlasData, PresetKey } from './atlasData'
import { FearGreedCard } from './cards/FearGreedCard'
import { LiquidityCard } from './cards/LiquidityCard'
import { MomentumCard } from './cards/MomentumCard'
import { PressureCard } from './cards/PressureCard'
import { PriceChartCard } from './cards/PriceChartCard'
import { SentimentCard } from './cards/SentimentCard'
import { SupplyCard } from './cards/SupplyCard'
import { TrendCard } from './cards/TrendCard'
import { UncertaintyCard } from './cards/UncertaintyCard'
import { VolatilityCard } from './cards/VolatilityCard'

/**
 * Bitcoin Atlas: indicadores de Bitcoin convertidos en metáforas visuales.
 * Todos los datos son ficticios y se ajustan desde el panel "Simulador".
 */
export const BitcoinAtlas: React.FC = () => {
  const [data, setData] = useState<AtlasData>(DEFAULT_DATA)
  const [simOpen, setSimOpen] = useState(false)

  const update = useCallback((key: keyof AtlasData, value: number) => {
    setData((d) => ({ ...d, [key]: value }))
  }, [])
  const applyPreset = useCallback((key: PresetKey) => {
    setData((d) => ({ ...d, ...PRESETS[key] }))
  }, [])
  const reset = useCallback(() => setData(DEFAULT_DATA), [])
  const closeSim = useCallback(() => setSimOpen(false), [])

  // Ambiente general: el resplandor del fondo cambia con el ánimo del mercado
  const mood = useSmoothNumber((data.sentiment + data.fearGreed + (100 - data.risk)) / 3, 0.06)

  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-white p-4 text-slate-900 shadow-xl shadow-slate-200/70 ring-1 ring-slate-200 sm:p-6">
      <AtlasStyles />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            `radial-gradient(60% 50% at 12% 0%, rgba(251,191,36,${0.03 + 0.1 * (mood / 100)}), transparent 60%),` +
            `radial-gradient(50% 45% at 92% 8%, rgba(45,212,191,${0.02 + 0.07 * (mood / 100)}), transparent 60%),` +
            `radial-gradient(70% 60% at 50% 100%, rgba(248,113,113,${0.02 + 0.08 * ((100 - mood) / 100)}), transparent 65%)`,
        }}
      />

      <AtlasHeader price={data.price} onOpenSimulator={() => setSimOpen(true)} />

      {/* Fila principal: columna izquierda · gráfico · columna derecha */}
      <div className="relative z-10 grid gap-4 lg:grid-cols-[250px_minmax(0,1fr)_250px]">
        <div className="order-2 flex flex-col gap-4 lg:order-1">
          <TrendCard value={data.trend} />
          <VolatilityCard value={data.volatility} />
          <SentimentCard value={data.sentiment} />
        </div>

        <div className="order-1 min-h-[380px] lg:order-2">
          <PriceChartCard price={data.price} volatility={data.volatility} trend={data.trend} />
        </div>

        <div className="order-3 flex flex-col gap-4">
          <SupplyCard value={data.supply} className="flex-1" />
          <div className="grid grid-cols-2 gap-4">
            <MomentumCard value={data.momentum} />
            <LiquidityCard value={data.liquidity} />
          </div>
        </div>
      </div>

      {/* Fila inferior */}
      <div className="relative z-10 mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_1.5fr]">
        <UncertaintyCard value={data.uncertainty} />
        <FearGreedCard value={data.fearGreed} />
        <PressureCard buySell={data.buySell} risk={data.risk} />
      </div>

      <SimulatorPanel
        open={simOpen}
        onClose={closeSim}
        data={data}
        onChange={update}
        onPreset={applyPreset}
        onReset={reset}
      />
    </div>
  )
}