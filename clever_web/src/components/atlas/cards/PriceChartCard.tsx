import React, { useState } from 'react'
import { AtlasCard } from '../AtlasCard'
import { useSmoothNumber } from '../useSmoothNumber'
import { formatPrice } from '../atlasData'

type Period = '1H' | '24H' | '7D' | '1M' | '1Y'
const PERIODS: Period[] = ['1H', '24H', '7D', '1M', '1Y']

interface PeriodConfig {
  points: number // número de velas
  seed: number
  vol: number // volatilidad base por vela
  move: number // movimiento total con tendencia extrema (±)
  labels: string[]
}

const CONFIG: Record<Period, PeriodConfig> = {
  '1H': { points: 30, seed: 11, vol: 0.0014, move: 0.008, labels: ['0 min', '15', '30', '45', 'Ahora'] },
  '24H': { points: 36, seed: 23, vol: 0.004, move: 0.03, labels: ['12 AM', '6 AM', '12 PM', '6 PM', 'Ahora'] },
  '7D': { points: 42, seed: 37, vol: 0.008, move: 0.07, labels: ['-7d', '-5d', '-3d', '-1d', 'Hoy'] },
  '1M': { points: 45, seed: 53, vol: 0.012, move: 0.12, labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Hoy'] },
  '1Y': { points: 40, seed: 71, vol: 0.022, move: 0.35, labels: ['-12m', '-9m', '-6m', '-3m', 'Hoy'] },
}

/* Ruido fijo (siempre las mismas velas); la volatilidad y la tendencia las remodelan */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STEPS = {} as Record<Period, number[]>
const WICKS = {} as Record<Period, { up: number[]; down: number[] }>
PERIODS.forEach((p) => {
  const n = CONFIG[p].points
  const rnd = mulberry32(CONFIG[p].seed)
  STEPS[p] = Array.from({ length: n }, () => rnd() + rnd() - 1)
  const wr = mulberry32(CONFIG[p].seed + 500)
  WICKS[p] = {
    up: Array.from({ length: n }, () => wr()),
    down: Array.from({ length: n }, () => wr()),
  }
})

interface Candle {
  o: number // apertura
  h: number // máximo
  l: number // mínimo
  c: number // cierre
}

function buildCandles(period: Period, volatility: number, trend: number, price: number): Candle[] {
  const cfg = CONFIG[period]
  const steps = STEPS[period]
  const wicks = WICKS[period]
  const volMul = 0.25 + (1.75 * volatility) / 100
  const drift = ((trend - 50) / 50) * (cfg.move / (steps.length - 1))

  const logs: number[] = [0]
  for (let i = 1; i < steps.length; i++) {
    logs.push(logs[i - 1] + steps[i] * cfg.vol * volMul + drift)
  }
  const last = logs[logs.length - 1]
  // el cierre de la última vela siempre coincide con el precio actual
  const closes = logs.map((l) => price * Math.exp(l - last))

  const base = cfg.vol * volMul
  return closes.map((c, i) => {
    const o = i === 0 ? c * (1 - steps[0] * base) : closes[i - 1]
    return {
      o,
      c,
      h: Math.max(o, c) + c * base * (0.15 + 1.1 * wicks.up[i]),
      l: Math.min(o, c) - c * base * (0.15 + 1.1 * wicks.down[i]),
    }
  })
}

const W = 1000
const H = 400
const PAD = 0.1
const UP = '#10b981'
const DOWN = '#f43f5e'

const axisLabel = (v: number) => (v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`)

const PLOT_BG =
  'radial-gradient(80% 60% at 50% 115%, rgba(245,158,11,.12), transparent 60%),' +
  'linear-gradient(180deg, #ffffff, #f8fafc)'

/** Precio → velas japonesas con periodos y detalle (apertura, máximo, mínimo, cierre) al pasar el mouse */
export const PriceChartCard: React.FC<{ price: number; volatility: number; trend: number }> = ({
  price,
  volatility,
  trend,
}) => {
  const [period, setPeriod] = useState<Period>('24H')
  const [hover, setHover] = useState<number | null>(null)

  const p = useSmoothNumber(price, 0.14, 0.05)
  const vol = useSmoothNumber(volatility)
  const tr = useSmoothNumber(trend)

  const cfg = CONFIG[period]
  const candles = buildCandles(period, vol, tr, p)
  const n = candles.length
  const min = Math.min(...candles.map((k) => k.l))
  const max = Math.max(...candles.map((k) => k.h))
  const span = max - min || 1

  const yOf = (v: number) => H * (1 - PAD) - ((v - min) / span) * H * (1 - 2 * PAD)
  const slot = W / n
  const bodyW = slot * 0.62
  const yLast = yOf(candles[n - 1].c)

  const ticks = [1, 2 / 3, 1 / 3, 0].map((t) => {
    const v = min + t * span
    return { top: (yOf(v) / H) * 100, label: axisLabel(v) }
  })

  const active = hover !== null && hover < n ? candles[hover] : null
  const activeUp = active ? active.c >= active.o : true
  const activePct = active ? ((active.c - active.o) / active.o) * 100 : 0
  const hoverFrac = hover !== null ? (hover + 0.5) / n : 0

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setHover(Math.min(n - 1, Math.floor(frac * n)))
  }

  return (
    <AtlasCard
      title="Precio"
      tip="Cada vela resume un intervalo de tiempo: verde si el precio subió y roja si bajó. Las líneas finas marcan el máximo y el mínimo. Los datos son simulados y responden a Precio, Volatilidad y Tendencia."
      tint="rgba(251,146,60,0.10)"
      className="h-full"
      actions={
        <div role="tablist" aria-label="Periodo" className="flex rounded-full border border-slate-200 bg-white p-0.5">
          {PERIODS.map((per) => (
            <button
              key={per}
              type="button"
              role="tab"
              aria-selected={per === period}
              onClick={() => {
                setPeriod(per)
                setHover(null)
              }}
              className={`rounded-full px-2.5 py-1 font-mono text-[11px] transition ${
                per === period
                  ? 'bg-amber-400 font-semibold text-slate-950 shadow shadow-amber-500/30'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {per}
            </button>
          ))}
        </div>
      }
    >
      <div className="-mt-1 mb-3 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Simulado
        </span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-1.5 rounded-sm bg-emerald-500" />
            Sube
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-1.5 rounded-sm bg-rose-500" />
            Baja
          </span>
        </span>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex min-h-[280px] flex-1">
          {/* eje Y */}
          <div className="relative w-12 shrink-0 text-[11px] tabular-nums text-slate-500">
            {ticks.map((t) => (
              <span key={t.label + t.top} className="absolute right-2 -translate-y-1/2" style={{ top: `${t.top}%` }}>
                {t.label}
              </span>
            ))}
          </div>

          {/* área del gráfico */}
          <div
            className="relative flex-1 touch-pan-y rounded-xl ring-1 ring-slate-200"
            style={{ background: PLOT_BG }}
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          >
            <svg
              key={period}
              viewBox={`0 0 ${W} ${H}`}
              preserveAspectRatio="none"
              className="atlas-reveal absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {[0.25, 0.5, 0.75].map((f) => (
                <line
                  key={f}
                  x1="0"
                  x2={W}
                  y1={H * f}
                  y2={H * f}
                  stroke="#0f172a"
                  strokeOpacity="0.06"
                  vectorEffect="non-scaling-stroke"
                />
              ))}

              {/* línea del precio actual */}
              <line
                x1="0"
                x2={W}
                y1={yLast}
                y2={yLast}
                stroke="#f59e0b"
                strokeOpacity="0.7"
                strokeDasharray="5 5"
                vectorEffect="non-scaling-stroke"
              />

              {candles.map((k, i) => {
                const up = k.c >= k.o
                const color = up ? UP : DOWN
                const cx = (i + 0.5) * slot
                const yO = yOf(k.o)
                const yC = yOf(k.c)
                return (
                  <g key={i}>
                    <line
                      x1={cx}
                      x2={cx}
                      y1={yOf(k.h)}
                      y2={yOf(k.l)}
                      stroke={color}
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <rect
                      x={cx - bodyW / 2}
                      y={Math.min(yO, yC)}
                      width={bodyW}
                      height={Math.max(Math.abs(yC - yO), 2)}
                      rx="1.5"
                      fill={color}
                    />
                  </g>
                )
              })}
            </svg>

            {/* marcador pulsante del precio actual */}
            {active === null && (
              <span
                className="pointer-events-none absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${((n - 0.5) / n) * 100}%`, top: `${(yLast / H) * 100}%` }}
              >
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white" />
              </span>
            )}

            {/* hover: vela resaltada y ficha con apertura / máximo / mínimo / cierre */}
            {active && hover !== null && (
              <>
                <span
                  className="pointer-events-none absolute inset-y-0 rounded bg-slate-900/5"
                  style={{ left: `${(hover / n) * 100}%`, width: `${100 / n}%` }}
                />
                <div
                  className={`pointer-events-none absolute top-2 z-10 w-44 rounded-xl border border-amber-300 bg-white/95 p-3 shadow-lg ${
                    hoverFrac < 0.5 ? 'right-2' : 'left-2'
                  }`}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={`text-xs font-semibold ${activeUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {activeUp ? 'Vela alcista' : 'Vela bajista'}
                    </span>
                    <span className={`text-xs font-medium tabular-nums ${activeUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {activePct >= 0 ? '+' : ''}
                      {activePct.toFixed(2)}%
                    </span>
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px] tabular-nums">
                    <dt className="text-slate-500">Apertura</dt>
                    <dd className="text-right text-slate-900">{formatPrice(active.o)}</dd>
                    <dt className="text-slate-500">Máximo</dt>
                    <dd className="text-right text-slate-900">{formatPrice(active.h)}</dd>
                    <dt className="text-slate-500">Mínimo</dt>
                    <dd className="text-right text-slate-900">{formatPrice(active.l)}</dd>
                    <dt className="text-slate-500">Cierre</dt>
                    <dd className="text-right font-semibold text-slate-900">{formatPrice(active.c)}</dd>
                  </dl>
                </div>
              </>
            )}
          </div>
        </div>

        {/* eje X */}
        <div className="ml-12 mt-2 flex justify-between text-[11px] text-slate-500">
          {cfg.labels.map((l, i) => (
            <span key={l + i}>{l}</span>
          ))}
        </div>
      </div>
    </AtlasCard>
  )
}