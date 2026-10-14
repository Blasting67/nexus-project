import React from 'react'
import type { IllustrationKey } from './IndicatorData'
import { adx, bollinger, buildPrices, fibLevels, kdj, macd, rsi, toOhlc } from './indicatorMath'
import type { Series } from './indicatorMath'

/* ------------------------------------------------------------------ */
/* Base común                                                          */
/* ------------------------------------------------------------------ */

const W = 260
const H = 130
const PX = 10
const PY = 14

const C = {
  price: '#94a3b8',
  sky: '#38bdf8',
  violet: '#a78bfa',
  amber: '#fbbf24',
  rose: '#fb7185',
  emerald: '#34d399',
  teal: '#2dd4bf',
}

const yScale = (min: number, max: number) => (v: number) => H - PY - ((v - min) / (max - min || 1)) * (H - 2 * PY)
const GUT = 28 // margen derecho para las etiquetas de niveles
const xScale = (n: number, rightPad = PX) => (i: number) => PX + (i / (n - 1)) * (W - PX - rightPad)

/** Trazo de una serie; los huecos (null) interrumpen la línea. */
function linePath(vals: Series, xOf: (i: number) => number, yOf: (v: number) => number): string {
  let d = ''
  let pen = false
  vals.forEach((v, i) => {
    if (v === null || Number.isNaN(v)) {
      pen = false
      return
    }
    d += `${pen ? 'L' : 'M'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)} `
    pen = true
  })
  return d.trim()
}

const pts = (points: Array<[number, number]>) => points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ')

const Frame: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-auto w-full">
    <g stroke="#0f172a" strokeOpacity="0.06">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1="6" x2={W - 6} y1={H * f} y2={H * f} />
      ))}
    </g>
    {children}
  </svg>
)

/** Pequeña leyenda dentro del dibujo: muestra de línea + nombre. */
const Legend: React.FC<{ items: Array<{ label: string; color: string }>; x?: number; y?: number }> = ({
  items,
  x = 12,
  y = 11,
}) => {
  let cursor = x
  return (
    <g fontSize="8.5" fill="#64748b" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      {items.map((it) => {
        const at = cursor
        cursor += 20 + it.label.length * 5 + 8
        return (
          <g key={it.label}>
            <line x1={at} x2={at + 14} y1={y - 3} y2={y - 3} stroke={it.color} strokeWidth="2.4" strokeLinecap="round" />
            <text x={at + 18} y={y}>
              {it.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

const TEXT = { fontFamily: 'ui-sans-serif, system-ui, sans-serif' }

/* ------------------------------------------------------------------ */
/* Pesos de las medias (SMA, EMA, LWMA)                                */
/* ------------------------------------------------------------------ */

const WEIGHT_PERIODS = 8
const ALPHA = 2 / (WEIGHT_PERIODS + 1)

/** Peso de cada periodo, del más antiguo al más reciente. */
export const SMA_WEIGHTS = Array.from({ length: WEIGHT_PERIODS }, () => 1)
export const EMA_WEIGHTS = Array.from({ length: WEIGHT_PERIODS }, (_, i) => ALPHA * (1 - ALPHA) ** (WEIGHT_PERIODS - 1 - i))
export const LWMA_WEIGHTS = Array.from({ length: WEIGHT_PERIODS }, (_, i) => i + 1)

export const WeightBars: React.FC<{ weights: number[]; color: string; label: string }> = ({ weights, color, label }) => {
  const max = Math.max(...weights)
  const bw = 12
  const gap = 6
  const total = weights.length * bw + (weights.length - 1) * gap
  const left = (160 - total) / 2
  return (
    <svg viewBox="0 0 160 66" role="img" aria-label={label} className="h-auto w-full">
      <line x1="8" x2="152" y1="58" y2="58" stroke="#e2e8f0" />
      {weights.map((w, i) => {
        const h = Math.max(4, (w / max) * 48)
        return <rect key={i} x={left + i * (bw + gap)} y={58 - h} width={bw} height={h} rx="3" fill={color} fillOpacity="0.85" />
      })}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* MACD                                                                */
/* ------------------------------------------------------------------ */

const MACD_PRICES = buildPrices(7, [
  { len: 26, drift: 0.5, vol: 0.7 },
  { len: 22, drift: -0.7, vol: 0.8 },
  { len: 24, drift: 0.6, vol: 0.8 },
  { len: 18, drift: -0.5, vol: 0.8 },
])
const MACD = macd(MACD_PRICES, 12, 26, 9)
const MACD_FROM = 30

export const MacdIllustration: React.FC = () => {
  const cut = (a: number[]) => a.slice(MACD_FROM)
  const m = cut(MACD.macd)
  const s = cut(MACD.signal)
  const h = cut(MACD.hist)
  const n = m.length
  const max = Math.max(...m.map(Math.abs), ...s.map(Math.abs), ...h.map(Math.abs)) * 1.15
  const y = yScale(-max, max)
  const x = xScale(n)
  const barW = ((W - 2 * PX) / n) * 0.62

  const crosses: Array<{ i: number; up: boolean }> = []
  for (let i = 1; i < n; i++) if (h[i - 1] <= 0 !== h[i] <= 0) crosses.push({ i, up: h[i] > 0 })

  return (
    <Frame label="Ejemplo de MACD: línea MACD, línea de señal, histograma y cruces">
      <Legend
        items={[
          { label: 'MACD', color: C.sky },
          { label: 'Señal', color: C.amber },
        ]}
      />
      <line x1={PX} x2={W - PX} y1={y(0)} y2={y(0)} stroke="#cbd5e1" />
      {h.map((v, i) => (
        <rect
          key={i}
          x={x(i) - barW / 2}
          y={Math.min(y(0), y(v))}
          width={barW}
          height={Math.max(Math.abs(y(v) - y(0)), 0.6)}
          fill={v >= 0 ? '#a7f3d0' : '#fecdd3'}
        />
      ))}
      <path d={linePath(m, x, y)} fill="none" stroke={C.sky} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(s, x, y)} fill="none" stroke={C.amber} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {crosses.slice(0, 4).map((c) => (
        <circle key={c.i} cx={x(c.i)} cy={y(m[c.i])} r="4" fill="#fff" stroke={c.up ? C.emerald : C.rose} strokeWidth="2" />
      ))}
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* RSI                                                                 */
/* ------------------------------------------------------------------ */

const RSI_PRICES = buildPrices(11, [
  { len: 20, drift: 1.0, vol: 1.7 },
  { len: 20, drift: -1.2, vol: 1.7 },
  { len: 18, drift: 0.3, vol: 1.6 },
  { len: 14, drift: 1.1, vol: 1.6 },
  { len: 14, drift: -1.1, vol: 1.6 },
])
const RSI = rsi(RSI_PRICES, 14)
const RSI_FROM = 14

export const RsiIllustration: React.FC = () => {
  const vals = RSI.slice(RSI_FROM)
  const n = vals.length
  const x = xScale(n, GUT)
  const y = yScale(-6, 106)
  const right = W - GUT

  return (
    <Frame label="Ejemplo de RSI con las zonas de 70 y 30">
      <rect x={PX} y={y(106)} width={right - PX} height={y(70) - y(106)} fill="#fef3c7" fillOpacity="0.7" />
      <rect x={PX} y={y(30)} width={right - PX} height={y(-6) - y(30)} fill="#e0f2fe" fillOpacity="0.8" />
      <g stroke="#94a3b8" strokeDasharray="3 4">
        <line x1={PX} x2={right} y1={y(70)} y2={y(70)} />
        <line x1={PX} x2={right} y1={y(30)} y2={y(30)} />
      </g>
      <g fontSize="9" fill="#64748b" style={TEXT}>
        <text x={W - PX} y={y(70) + 3} textAnchor="end">
          70
        </text>
        <text x={W - PX} y={y(30) + 3} textAnchor="end">
          30
        </text>
      </g>
      <path d={linePath(vals, x, y)} fill="none" stroke={C.violet} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* KDJ                                                                 */
/* ------------------------------------------------------------------ */

const KDJ_PRICES = buildPrices(5, [
  { len: 12, drift: 1, vol: 1.1 },
  { len: 12, drift: -1.1, vol: 1.1 },
  { len: 12, drift: 1, vol: 1.1 },
  { len: 10, drift: -0.9, vol: 1.1 },
  { len: 10, drift: 1, vol: 1.1 },
])
const KDJ = kdj(toOhlc(KDJ_PRICES, 6, 1.0), 9)
const KDJ_FROM = 9

export const KdjIllustration: React.FC = () => {
  const k = KDJ.k.slice(KDJ_FROM)
  const d = KDJ.d.slice(KDJ_FROM)
  const j = KDJ.j.slice(KDJ_FROM)
  const n = k.length
  const min = Math.min(-5, ...j)
  const max = Math.max(105, ...j)
  const x = xScale(n)
  const y = yScale(min, max)

  return (
    <Frame label="Ejemplo de KDJ: líneas K, D y J con zonas altas y bajas">
      <rect x={PX} y={y(max)} width={W - 2 * PX} height={y(80) - y(max)} fill="#fef3c7" fillOpacity="0.6" />
      <rect x={PX} y={y(20)} width={W - 2 * PX} height={y(min) - y(20)} fill="#e0f2fe" fillOpacity="0.7" />
      <g stroke="#94a3b8" strokeDasharray="3 4">
        <line x1={PX} x2={W - PX} y1={y(80)} y2={y(80)} />
        <line x1={PX} x2={W - PX} y1={y(20)} y2={y(20)} />
      </g>
      <path d={linePath(j, x, y)} fill="none" stroke={C.violet} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(d, x, y)} fill="none" stroke={C.amber} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d={linePath(k, x, y)} fill="none" stroke={C.sky} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <Legend
        y={H - 5}
        items={[
          { label: 'K', color: C.sky },
          { label: 'D', color: C.amber },
          { label: 'J', color: C.violet },
        ]}
      />
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* Bandas de Bollinger                                                 */
/* ------------------------------------------------------------------ */

const BOLL_PRICES = buildPrices(3, [
  { len: 22, drift: 0.05, vol: 0.45 },
  { len: 20, drift: 0.25, vol: 2.4 },
  { len: 22, drift: -0.05, vol: 0.5 },
])
const BOLL = bollinger(BOLL_PRICES, 20, 2)
const BOLL_FROM = 19

export const BollingerIllustration: React.FC = () => {
  const price = BOLL_PRICES.slice(BOLL_FROM)
  const up = BOLL.upper.slice(BOLL_FROM)
  const mid = BOLL.mid.slice(BOLL_FROM)
  const lo = BOLL.lower.slice(BOLL_FROM)
  const n = price.length
  const all = [...price, ...(up as number[]), ...(lo as number[])]
  const x = xScale(n)
  const y = yScale(Math.min(...all), Math.max(...all))

  const top = up.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v as number).toFixed(1)}`).join(' ')
  const bottom = lo
    .map((_, i) => `L${x(n - 1 - i).toFixed(1)},${y(lo[n - 1 - i] as number).toFixed(1)}`)
    .join(' ')

  return (
    <Frame label="Ejemplo de Bandas de Bollinger: bandas que se estrechan y se ensanchan con la volatilidad">
      <path d={`${top} ${bottom} Z`} fill="#e0f2fe" fillOpacity="0.75" />
      <path d={linePath(up, x, y)} fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={linePath(lo, x, y)} fill="none" stroke="#7dd3fc" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={linePath(mid, x, y)} fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 3" />
      <path d={linePath(price, x, y)} fill="none" stroke="#6366f1" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <Legend
        y={H - 5}
        items={[
          { label: 'Precio', color: '#6366f1' },
          { label: 'Bandas', color: '#7dd3fc' },
        ]}
      />
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* ADX                                                                 */
/* ------------------------------------------------------------------ */

const ADX_OHLC = toOhlc(
  buildPrices(9, [
    { len: 36, drift: 0, vol: 1.2 },
    { len: 22, drift: 1.0, vol: 1.2 },
    { len: 20, drift: -0.05, vol: 1.2 },
  ]),
  4,
  1.2,
)
const ADX = adx(ADX_OHLC, 14)
const ADX_FROM = 27

export const AdxIllustration: React.FC = () => {
  const vals = ADX.slice(ADX_FROM)
  const n = vals.length
  const top = Math.max(50, ...(vals.filter((v) => v !== null) as number[])) + 6
  const x = xScale(n, GUT)
  const y = yScale(0, top)
  const right = W - GUT

  return (
    <Frame label="Ejemplo de ADX con las referencias de 25 y 40">
      <rect x={PX} y={y(25)} width={right - PX} height={y(0) - y(25)} fill="#f1f5f9" fillOpacity="0.9" />
      <rect x={PX} y={y(top)} width={right - PX} height={y(40) - y(top)} fill="#ccfbf1" fillOpacity="0.6" />
      <g stroke="#94a3b8" strokeDasharray="3 4">
        <line x1={PX} x2={right} y1={y(25)} y2={y(25)} />
        <line x1={PX} x2={right} y1={y(40)} y2={y(40)} />
      </g>
      <g fontSize="9" fill="#64748b" style={TEXT}>
        <text x={W - PX} y={y(25) + 3} textAnchor="end">
          25
        </text>
        <text x={W - PX} y={y(40) + 3} textAnchor="end">
          40
        </text>
      </g>
      <path d={linePath(vals, x, y)} fill="none" stroke={C.teal} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* Ondas de Elliott (esquema)                                          */
/* ------------------------------------------------------------------ */

const WAVE_POINTS: Array<{ x: number; y: number; label?: string; peak?: boolean }> = [
  { x: 10, y: 116 },
  { x: 48, y: 80, label: '1', peak: true },
  { x: 68, y: 96, label: '2' },
  { x: 118, y: 40, label: '3', peak: true },
  { x: 140, y: 62, label: '4' },
  { x: 176, y: 24, label: '5', peak: true },
  { x: 200, y: 66, label: 'A' },
  { x: 218, y: 50, label: 'B', peak: true },
  { x: 248, y: 92, label: 'C' },
]

export const ElliottIllustration: React.FC = () => {
  const impulse = WAVE_POINTS.slice(0, 6).map((p): [number, number] => [p.x, p.y])
  const correction = WAVE_POINTS.slice(5).map((p): [number, number] => [p.x, p.y])

  return (
    <Frame label="Esquema de las ondas de Elliott: cinco ondas de impulso y tres de corrección">
      <Legend
        items={[
          { label: 'Impulso', color: C.violet },
          { label: 'Corrección', color: C.rose },
        ]}
      />
      <path d={pts(impulse)} fill="none" stroke={C.violet} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      <path d={pts(correction)} fill="none" stroke={C.rose} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
      {WAVE_POINTS.filter((p) => p.label).map((p) => {
        const isCorrection = /[ABC]/.test(p.label as string)
        const cy = p.peak ? p.y - 12 : p.y + 12
        return (
          <g key={p.label}>
            <circle cx={p.x} cy={cy} r="7.5" fill="#fff" stroke={isCorrection ? '#fda4af' : '#c4b5fd'} strokeWidth="1.4" />
            <text
              x={p.x}
              y={cy + 3.2}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill={isCorrection ? '#e11d48' : '#7c3aed'}
              style={TEXT}
            >
              {p.label}
            </text>
          </g>
        )
      })}
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* Fibonacci (esquema)                                                 */
/* ------------------------------------------------------------------ */

const FIB_HIGH_Y = 22
const FIB_LOW_Y = 112
const FIB_RATIOS = [0.236, 0.382, 0.5, 0.618]
const FIB_LABELS = ['23.6%', '38.2%', '50%', '61.8%']

export const FibonacciIllustration: React.FC = () => {
  // el mínimo se mapea a 0 y el máximo a 1; cada nivel se coloca entre ambos
  const levelY = fibLevels(FIB_LOW_Y, FIB_HIGH_Y, FIB_RATIOS)

  return (
    <Frame label="Esquema de los niveles de Fibonacci sobre un avance y su retroceso">
      {[
        { y: FIB_HIGH_Y, label: '0%' },
        { y: FIB_LOW_Y, label: '100%' },
      ].map((l) => (
        <g key={l.label}>
          <line x1="24" x2="214" y1={l.y} y2={l.y} stroke="#cbd5e1" />
          <text x="218" y={l.y + 3} fontSize="8.5" fill="#94a3b8" style={TEXT}>
            {l.label}
          </text>
        </g>
      ))}
      {levelY.map((y, i) => (
        <g key={FIB_LABELS[i]}>
          <line x1="24" x2="214" y1={y} y2={y} stroke="#5eead4" strokeDasharray="4 4" />
          <text x="218" y={y + 3} fontSize="8.5" fill="#0d9488" style={TEXT}>
            {FIB_LABELS[i]}
          </text>
        </g>
      ))}
      <path
        d="M24,112 L60,84 L76,92 L136,22 L162,52 L176,70 L192,60 L214,40"
        fill="none"
        stroke={C.violet}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="176" cy="70" r="4.5" fill="#fff" stroke={C.violet} strokeWidth="2" />
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* Ichimoku (esquema)                                                  */
/* ------------------------------------------------------------------ */

const CLOUD_TOP: Array<[number, number]> = [[10, 58], [60, 58], [110, 60], [160, 66], [210, 72], [250, 78]]
const CLOUD_BOTTOM: Array<[number, number]> = [[10, 78], [60, 78], [110, 80], [160, 88], [210, 96], [250, 102]]
const ICHI_PRICE: Array<[number, number]> = [[10, 34], [36, 26], [62, 38], [88, 30], [112, 46], [136, 66], [160, 82], [190, 100], [220, 110], [250, 118]]
const ICHI_TENKAN: Array<[number, number]> = [[36, 30], [62, 30], [88, 34], [112, 42], [136, 56], [160, 72], [190, 90], [220, 102], [250, 112]]
const ICHI_KIJUN: Array<[number, number]> = [[62, 40], [88, 38], [112, 42], [136, 50], [160, 60], [190, 76], [220, 90], [250, 104]]

export const IchimokuIllustration: React.FC = () => {
  const cloud = `${pts(CLOUD_TOP)} ${[...CLOUD_BOTTOM].reverse().map(([x, y]) => `L${x},${y}`).join(' ')} Z`

  return (
    <Frame label="Esquema de Ichimoku: el precio pasa de estar por encima de la nube a estar por debajo">
      <path d={cloud} fill="#ddd6fe" fillOpacity="0.7" />
      <path d={pts(CLOUD_TOP)} fill="none" stroke="#c4b5fd" strokeWidth="1.2" />
      <path d={pts(CLOUD_BOTTOM)} fill="none" stroke="#c4b5fd" strokeWidth="1.2" />
      <path d={pts(ICHI_KIJUN)} fill="none" stroke="#fda4af" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={pts(ICHI_TENKAN)} fill="none" stroke={C.sky} strokeWidth="1.6" strokeLinejoin="round" />
      <path d={pts(ICHI_PRICE)} fill="none" stroke="#475569" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
      <g fontSize="8.5" style={TEXT}>
        <text x="10" y="13" fill="#059669">
          Por encima de la nube
        </text>
        <text x="250" y="126" textAnchor="end" fill="#e11d48">
          Por debajo de la nube
        </text>
        <text x="26" y="72" fill="#8b5cf6">
          Nube
        </text>
      </g>
    </Frame>
  )
}

/* ------------------------------------------------------------------ */
/* Asignación por indicador                                            */
/* ------------------------------------------------------------------ */

export const ILLUSTRATIONS: Record<IllustrationKey, React.FC> = {
  macd: MacdIllustration,
  rsi: RsiIllustration,
  kdj: KdjIllustration,
  bollinger: BollingerIllustration,
  adx: AdxIllustration,
  elliott: ElliottIllustration,
  fibonacci: FibonacciIllustration,
}
