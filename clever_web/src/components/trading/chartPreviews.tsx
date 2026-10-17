import React, { useId, useState } from 'react'

/* ------------------------------------------------------------------ */
/* Datos de ejemplo                                                    */
/* Los seis gráficos se dibujan con los MISMOS precios, para que se    */
/* vea que son formas distintas de mirar el mismo movimiento.          */
/* ------------------------------------------------------------------ */

export interface Ohlc {
  o: number // apertura
  h: number // máximo
  l: number // mínimo
  c: number // cierre
}

const SAMPLE: Ohlc[] = [
  { o: 100, h: 108, l: 98, c: 103 },
  { o: 103, h: 107, l: 101, c: 106 },
  { o: 106, h: 108, l: 102, c: 104 },
  { o: 104, h: 109, l: 103, c: 108 },
  { o: 108, h: 112, l: 106, c: 111 },
  { o: 111, h: 113, l: 103, c: 104 },
  { o: 104, h: 111, l: 103, c: 110 },
  { o: 110, h: 116, l: 109, c: 115 },
  { o: 115, h: 118, l: 112, c: 113 },
  { o: 113, h: 117, l: 111, c: 116 },
  { o: 116, h: 121, l: 115, c: 120 },
  { o: 120, h: 122, l: 116, c: 117 },
  { o: 117, h: 123, l: 116, c: 122 },
  { o: 122, h: 126, l: 121, c: 125 },
]

/** Heikin Ashi: promedia cada vela con la anterior para suavizar el ruido. */
function toHeikinAshi(data: Ohlc[]): Ohlc[] {
  const out: Ohlc[] = []
  data.forEach((k, i) => {
    const c = (k.o + k.h + k.l + k.c) / 4
    const o = i === 0 ? (k.o + k.c) / 2 : (out[i - 1].o + out[i - 1].c) / 2
    out.push({ o, c, h: Math.max(k.h, o, c), l: Math.min(k.l, o, c) })
  })
  return out
}

interface Brick {
  open: number
  close: number
  up: boolean
}

/** Renko: un ladrillo nuevo solo cuando el precio se mueve `size`; revertir exige 2 ladrillos. */
function toRenko(closes: number[], size: number): Brick[] {
  const bricks: Brick[] = []
  const base = Math.round(closes[0] / size) * size
  let last: Brick | null = null

  const push = (open: number, close: number) => {
    last = { open, close, up: close > open }
    bricks.push(last)
  }

  for (const price of closes) {
    for (;;) {
      const prev = last as Brick | null
      if (!prev) {
        if (price >= base + size) push(base, base + size)
        else if (price <= base - size) push(base, base - size)
        else break
      } else if (prev.up) {
        if (price >= prev.close + size) push(prev.close, prev.close + size)
        else if (price <= prev.open - size) push(prev.open, prev.open - size)
        else break
      } else {
        if (price <= prev.close - size) push(prev.close, prev.close - size)
        else if (price >= prev.open + size) push(prev.open, prev.open + size)
        else break
      }
    }
  }
  return bricks
}

const HEIKIN = toHeikinAshi(SAMPLE)
const BRICK_SIZE = 3
const RENKO = toRenko(
  SAMPLE.map((k) => k.c),
  BRICK_SIZE,
)

/* ------------------------------------------------------------------ */
/* Estilo y escala                                                     */
/* ------------------------------------------------------------------ */

const W = 520
const H = 300
const L = 46 // margen izquierdo (precios)
const R = 52 // margen derecho (etiqueta del último precio)
const T = 28
const B = 34
const LO = 96
const HI = 128
const PRICE_TICKS: Array<[number, string]> = [100, 110, 120].map((v) => [T + ((HI - v) / (HI - LO)) * (H - T - B), String(v)])

const yOf = (v: number) => T + ((HI - v) / (HI - LO)) * (H - T - B)
const slotW = (n: number) => (W - L - R) / n
const xOf = (i: number, n: number) => L + (i + 0.5) * slotW(n)

// verde y rosa más vivos, con degradado
const UP = { top: '#6ee7b7', bottom: '#10b981', stroke: '#059669' }
const DOWN = { top: '#fda4af', bottom: '#f43f5e', stroke: '#e11d48' }
const FONT = 'ui-sans-serif, system-ui, sans-serif'

const CSS = `
.cp-ping{animation:cp-ping 2s ease-out infinite}
@keyframes cp-ping{0%{transform:scale(.6);opacity:.7}100%{transform:scale(2.6);opacity:0}}
@media (prefers-reduced-motion:reduce){.cp-ping{animation:none!important}}
`

/** Entrada: crece desde el centro, una tras otra. */
const pop = (shown: boolean, i: number, step = 45): React.CSSProperties => ({
  transformBox: 'fill-box',
  transformOrigin: 'center',
  transform: shown ? 'scaleY(1)' : 'scaleY(0.05)',
  opacity: shown ? 1 : 0,
  transition: 'transform 520ms cubic-bezier(.22,1,.36,1), opacity 400ms ease',
  transitionDelay: `${i * step}ms`,
})

interface PreviewProps {
  shown: boolean
}

interface FrameProps {
  label: string
  ticks?: Array<[number, string]>
  xLabel?: string
  /** convierte la posición horizontal (en unidades del dibujo) en el índice sobre el que está el puntero */
  hit: (x: number) => number | null
  onHover: (i: number | null) => void
  children: React.ReactNode
}

/** Marco común: ejes con precios, línea de referencia y seguimiento del puntero. */
const Frame: React.FC<FrameProps> = ({ label, ticks = PRICE_TICKS, xLabel = 'tiempo →', hit, onHover, children }) => {
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const ctm = svg.getScreenCTM()
    if (!ctm) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    onHover(hit(pt.matrixTransform(ctm.inverse()).x))
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-full w-full" onPointerMove={onMove} onPointerLeave={() => onHover(null)}>
      <style>{CSS}</style>
      <g fontFamily={FONT} fontSize="12.5" fill="#94a3b8">
        {ticks.map(([y, text]) => (
          <g key={text}>
            <line x1={L} x2={W - R + 6} y1={y} y2={y} stroke="#0f172a" strokeOpacity="0.07" strokeDasharray="3 5" />
            <text x={L - 9} y={y + 4.5} textAnchor="end">
              {text}
            </text>
          </g>
        ))}
        <line x1={L} x2={W - R + 6} y1={H - B} y2={H - B} stroke="#0f172a" strokeOpacity="0.14" />
        {xLabel && (
          <text x={W - R + 6} y={H - 10} textAnchor="end">
            {xLabel}
          </text>
        )}
      </g>
      {children}
    </svg>
  )
}

/** Cuadro de datos que sigue al puntero. */
const Tip: React.FC<{ x: number; y: number; rows: Array<[string, string]> }> = ({ x, y, rows }) => {
  const w = 132
  const h = 18 + rows.length * 19
  const tx = x > W - R - w - 18 ? x - w - 14 : x + 14
  const ty = Math.min(Math.max(y - h / 2, T - 8), H - B - h)
  return (
    <g pointerEvents="none" fontFamily={FONT}>
      <rect x={tx} y={ty} width={w} height={h} rx="10" fill="#0f172a" fillOpacity="0.93" />
      {rows.map(([k, v], i) => (
        <g key={k}>
          <text x={tx + 12} y={ty + 24 + i * 19} fontSize="12" fill="#94a3b8">
            {k}
          </text>
          <text x={tx + w - 12} y={ty + 24 + i * 19} fontSize="13.5" fontWeight="700" fill="#fff" textAnchor="end">
            {v}
          </text>
        </g>
      ))}
    </g>
  )
}

const slotHit = (n: number) => (x: number) => {
  const i = Math.floor((x - L) / slotW(n))
  return i >= 0 && i < n ? i : null
}

const ohlcRows = (k: Ohlc): Array<[string, string]> => [
  ['Apertura', k.o.toFixed(0)],
  ['Máximo', k.h.toFixed(0)],
  ['Mínimo', k.l.toFixed(0)],
  ['Cierre', k.c.toFixed(0)],
]

/** Etiqueta con el último precio, sobre el eje derecho. */
const PriceTag: React.FC<{ y: number; text: string; color: string; shown: boolean }> = ({ y, text, color, shown }) => (
  <g fontFamily={FONT} style={{ opacity: shown ? 1 : 0, transition: 'opacity 600ms ease 1200ms' }}>
    <line x1={L} x2={W - R + 6} y1={y} y2={y} stroke={color} strokeOpacity="0.55" strokeDasharray="4 4" />
    <rect x={W - R + 8} y={y - 12} width="44" height="24" rx="12" fill={color} />
    <text x={W - R + 30} y={y + 4.8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">
      {text}
    </text>
  </g>
)

/* ------------------------------------------------------------------ */
/* Los seis gráficos                                                   */
/* ------------------------------------------------------------------ */

const closesPath = () => {
  const n = SAMPLE.length
  const pts = SAMPLE.map((k, i): [number, number] => [xOf(i, n), yOf(k.c)])
  const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  return { pts, d, n }
}

/** 1. Líneas: une solo los precios de cierre. */
export const LineChartPreview: React.FC<PreviewProps> = ({ shown }) => {
  const uid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)
  const { pts, d, n } = closesPath()
  const last = pts[n - 1]

  return (
    <Frame label="Ejemplo de gráfico de líneas" hit={slotHit(n)} onHover={setHover}>
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {hover !== null && <line x1={pts[hover][0]} x2={pts[hover][0]} y1={T - 6} y2={H - B} stroke="#0284c7" strokeOpacity="0.35" strokeDasharray="3 3" />}
      <path d={d} fill="none" stroke="#38bdf8" strokeOpacity="0.2" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: shown ? 0 : 1, transition: 'stroke-dashoffset 1500ms ease-out' }} />
      <path d={d} fill="none" stroke={`url(#${uid}-l)`} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: shown ? 0 : 1, transition: 'stroke-dashoffset 1500ms ease-out' }} />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={hover === i ? 6.5 : 4} fill={hover === i ? '#0284c7' : '#fff'} stroke="#0284c7" strokeWidth="2.2" style={{ opacity: shown ? 1 : 0, transition: 'opacity 400ms ease, r 150ms ease', transitionDelay: `${i * 60}ms, 0ms` }} />
      ))}
      <circle cx={last[0]} cy={last[1]} r="5" fill="#6366f1" className="cp-ping" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <PriceTag y={last[1]} text={SAMPLE[n - 1].c.toFixed(0)} color="#0284c7" shown={shown} />
      {hover !== null && <Tip x={pts[hover][0]} y={pts[hover][1]} rows={[['Cierre', SAMPLE[hover].c.toFixed(0)]]} />}
    </Frame>
  )
}

/** 2. Barras (OHLC): una línea vertical (mín–máx), marca izquierda = apertura, marca derecha = cierre. */
export const OhlcBarsPreview: React.FC<PreviewProps> = ({ shown }) => {
  const [hover, setHover] = useState<number | null>(null)
  const n = SAMPLE.length
  const tick = slotW(n) * 0.36

  return (
    <Frame label="Ejemplo de gráfico de barras OHLC" hit={slotHit(n)} onHover={setHover}>
      {hover !== null && <rect x={xOf(hover, n) - slotW(n) / 2} y={T - 8} width={slotW(n)} height={H - B - T + 8} rx="7" fill="#7c3aed" fillOpacity="0.09" />}
      {SAMPLE.map((k, i) => {
        const x = xOf(i, n)
        const color = k.c >= k.o ? UP.stroke : DOWN.stroke
        return (
          <g key={i} style={pop(shown, i)} stroke={color} strokeWidth={hover === i ? 3.8 : 3} strokeLinecap="round">
            <line x1={x} x2={x} y1={yOf(k.h)} y2={yOf(k.l)} />
            <line x1={x - tick} x2={x} y1={yOf(k.o)} y2={yOf(k.o)} />
            <line x1={x} x2={x + tick} y1={yOf(k.c)} y2={yOf(k.c)} />
          </g>
        )
      })}
      <PriceTag y={yOf(SAMPLE[n - 1].c)} text={SAMPLE[n - 1].c.toFixed(0)} color="#7c3aed" shown={shown} />
      {hover !== null && <Tip x={xOf(hover, n)} y={yOf(SAMPLE[hover].h)} rows={ohlcRows(SAMPLE[hover])} />}
    </Frame>
  )
}

interface CandleSeriesProps {
  data: Ohlc[]
  label: string
  shown: boolean
  /** velas normales dibujadas como fantasma detrás (para comparar) */
  ghost?: Ohlc[]
  accent: string
}

const CandleSeries: React.FC<CandleSeriesProps> = ({ data, label, shown, ghost, accent }) => {
  const uid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)
  const n = data.length
  const bodyW = slotW(n) * 0.62
  const lastK = data[n - 1]

  return (
    <Frame label={label} hit={slotHit(n)} onHover={setHover}>
      <defs>
        <linearGradient id={`${uid}-u`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UP.top} />
          <stop offset="100%" stopColor={UP.bottom} />
        </linearGradient>
        <linearGradient id={`${uid}-d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={DOWN.top} />
          <stop offset="100%" stopColor={DOWN.bottom} />
        </linearGradient>
      </defs>
      {hover !== null && <rect x={xOf(hover, n) - slotW(n) / 2} y={T - 8} width={slotW(n)} height={H - B - T + 8} rx="7" fill={accent} fillOpacity="0.1" />}

      {ghost && (
        <g opacity={shown ? 0.5 : 0} style={{ transition: 'opacity 700ms ease 400ms' }} fill="none" stroke="#94a3b8" strokeWidth="1.4" strokeDasharray="3 3">
          {ghost.map((k, i) => (
            <g key={i}>
              <line x1={xOf(i, n)} x2={xOf(i, n)} y1={yOf(k.h)} y2={yOf(k.l)} />
              <rect x={xOf(i, n) - bodyW / 2} y={Math.min(yOf(k.o), yOf(k.c))} width={bodyW} height={Math.max(Math.abs(yOf(k.c) - yOf(k.o)), 2)} rx="3" />
            </g>
          ))}
        </g>
      )}

      {data.map((k, i) => {
        const x = xOf(i, n)
        const up = k.c >= k.o
        const c = up ? UP : DOWN
        return (
          <g key={i} style={pop(shown, i)}>
            <line x1={x} x2={x} y1={yOf(k.h)} y2={yOf(k.l)} stroke={c.stroke} strokeWidth={hover === i ? 3.4 : 2.6} strokeLinecap="round" />
            <rect
              x={x - bodyW / 2}
              y={Math.min(yOf(k.o), yOf(k.c))}
              width={bodyW}
              height={Math.max(Math.abs(yOf(k.c) - yOf(k.o)), 3)}
              rx="3.5"
              fill={`url(#${uid}-${up ? 'u' : 'd'})`}
              stroke={c.stroke}
              strokeWidth={hover === i ? 2.4 : 1.6}
            />
          </g>
        )
      })}

      <circle cx={xOf(n - 1, n)} cy={yOf(lastK.c)} r="4" fill={accent} className="cp-ping" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <PriceTag y={yOf(lastK.c)} text={lastK.c.toFixed(0)} color={accent} shown={shown} />
      {ghost && (
        <g fontFamily={FONT} fontSize="12" fill="#94a3b8">
          <rect x={L + 4} y="6" width="13" height="12" rx="2.5" fill="none" stroke="#94a3b8" strokeDasharray="2 2" />
          <text x={L + 24} y="17">
            Velas normales
          </text>
        </g>
      )}
      {hover !== null && <Tip x={xOf(hover, n)} y={yOf(data[hover].h)} rows={ohlcRows(data[hover])} />}
    </Frame>
  )
}

/** 3. Velas japonesas: cuerpo (apertura–cierre) y mechas (máximo–mínimo). */
export const CandlesPreview: React.FC<PreviewProps> = ({ shown }) => (
  <CandleSeries data={SAMPLE} label="Ejemplo de gráfico de velas japonesas" shown={shown} accent="#d97706" />
)

/** 4. Heikin Ashi: mismas velas, pero promediadas, así se forman rachas de un solo color. */
export const HeikinAshiPreview: React.FC<PreviewProps> = ({ shown }) => (
  <CandleSeries data={HEIKIN} ghost={SAMPLE} label="Ejemplo de gráfico Heikin Ashi" shown={shown} accent="#0d9488" />
)

/** 5. Renko: ladrillos de tamaño fijo, sin eje de tiempo ni mechas. */
export const RenkoPreview: React.FC<PreviewProps> = ({ shown }) => {
  const uid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)
  const n = RENKO.length
  const levels = RENKO.flatMap((b) => [b.open, b.close])
  const lo = Math.min(...levels)
  const hi = Math.max(...levels)
  const rows = Math.round((hi - lo) / BRICK_SIZE)
  const gap = 3.5
  const plotH = H - T - B
  const size = Math.min(plotH / rows - gap, (W - L - R) / n - gap, 30)
  const step = size + gap
  const left = L + (W - L - R - (n * step - gap)) / 2
  const bottom = T + (plotH + rows * step - gap) / 2
  const yLevel = (k: number) => bottom - k * step - size // arriba de la fila k

  // eje: precio en cada segundo nivel
  const ticks: Array<[number, string]> = Array.from({ length: Math.floor(rows / 2) + 1 }, (_, j): [number, string] => [bottom - j * 2 * step + gap / 2, String(lo + j * 2 * BRICK_SIZE)])

  return (
    <Frame
      label="Ejemplo de gráfico Renko"
      ticks={ticks}
      xLabel=""
      hit={(x) => {
        const i = Math.floor((x - left) / step)
        return i >= 0 && i < n ? i : null
      }}
      onHover={setHover}
    >
      <defs>
        <linearGradient id={`${uid}-u`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UP.top} />
          <stop offset="100%" stopColor={UP.bottom} />
        </linearGradient>
        <linearGradient id={`${uid}-d`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={DOWN.top} />
          <stop offset="100%" stopColor={DOWN.bottom} />
        </linearGradient>
      </defs>
      {RENKO.map((b, i) => {
        const level = Math.round((Math.min(b.open, b.close) - lo) / BRICK_SIZE)
        const c = b.up ? UP : DOWN
        return (
          <g key={i} style={{ ...pop(shown, i, 70), transform: shown ? 'scale(1)' : 'scale(0.2)' }}>
            <rect
              x={left + i * step}
              y={yLevel(level)}
              width={size}
              height={size}
              rx="4"
              fill={`url(#${uid}-${b.up ? 'u' : 'd'})`}
              stroke={c.stroke}
              strokeWidth={hover === i ? 2.6 : 1.6}
            />
            <rect x={left + i * step + 3} y={yLevel(level) + 3} width={size - 6} height={size * 0.28} rx="2" fill="#fff" fillOpacity="0.35" />
          </g>
        )
      })}
      <g fontFamily={FONT} fontSize="12" fill="#94a3b8" textAnchor="end">
        <text x={W - R + 46} y={H - 10}>
          1 ladrillo = {BRICK_SIZE} puntos
        </text>
      </g>
      {hover !== null && (
        <Tip
          x={left + hover * step + size / 2}
          y={yLevel(Math.round((Math.min(RENKO[hover].open, RENKO[hover].close) - lo) / BRICK_SIZE)) + size / 2}
          rows={[
            ['Ladrillo', String(hover + 1)],
            ['Dirección', RENKO[hover].up ? 'Sube' : 'Baja'],
            ['Cierra en', RENKO[hover].close.toFixed(0)],
          ]}
        />
      )}
    </Frame>
  )
}

/** 6. Áreas: como el de líneas, pero con el espacio bajo la línea relleno. */
export const AreaChartPreview: React.FC<PreviewProps> = ({ shown }) => {
  const uid = useId().replace(/:/g, '')
  const [hover, setHover] = useState<number | null>(null)
  const { pts, d, n } = closesPath()
  const floor = H - B
  const area = `${d} L${pts[n - 1][0].toFixed(1)},${floor} L${pts[0][0].toFixed(1)},${floor} Z`
  const last = pts[n - 1]

  return (
    <Frame label="Ejemplo de gráfico de áreas" hit={slotHit(n)} onHover={setHover}>
      <defs>
        <linearGradient id={`${uid}-a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#818cf8" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#4f46e5" />
        </linearGradient>
      </defs>
      <g style={{ clipPath: shown ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)', transition: 'clip-path 1500ms ease-out' }}>
        <path d={area} fill={`url(#${uid}-a)`} />
        <path d={d} fill="none" stroke={`url(#${uid}-s)`} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {hover !== null && (
        <g pointerEvents="none">
          <line x1={pts[hover][0]} x2={pts[hover][0]} y1={pts[hover][1]} y2={floor} stroke="#4f46e5" strokeOpacity="0.45" strokeDasharray="3 3" />
          <circle cx={pts[hover][0]} cy={pts[hover][1]} r="6" fill="#4f46e5" stroke="#fff" strokeWidth="2.4" />
        </g>
      )}
      <circle cx={last[0]} cy={last[1]} r="5" fill="#4f46e5" className="cp-ping" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      <PriceTag y={last[1]} text={SAMPLE[n - 1].c.toFixed(0)} color="#4f46e5" shown={shown} />
      {hover !== null && <Tip x={pts[hover][0]} y={pts[hover][1]} rows={[['Cierre', SAMPLE[hover].c.toFixed(0)]]} />}
    </Frame>
  )
}