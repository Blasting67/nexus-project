import React from 'react'

/* ------------------------------------------------------------------ */
/* Datos de ejemplo                                                    */
/* Los cinco gráficos se dibujan con los MISMOS precios, para que se   */
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

const W = 240
const H = 140
const PAD_X = 14
const PAD_Y = 16

// pastel con contorno definido (sube = menta, baja = rosa)
const UP_FILL = '#a7f3d0'
const UP_STROKE = '#34d399'
const DOWN_FILL = '#fecdd3'
const DOWN_STROKE = '#fb7185'
const LINE_STROKE = '#38bdf8'

const LO = Math.min(...SAMPLE.map((k) => k.l)) - 2
const HI = Math.max(...SAMPLE.map((k) => k.h)) + 2
const yOf = (v: number) => H - PAD_Y - ((v - LO) / (HI - LO)) * (H - 2 * PAD_Y)
const slotW = (n: number) => (W - 2 * PAD_X) / n
const xOf = (i: number, n: number) => PAD_X + (i + 0.5) * slotW(n)

/** Entrada discreta: aparece con un ligero desplazamiento. */
const rev = (shown: boolean) =>
  `transition duration-500 ease-out motion-reduce:transition-none ${
    shown ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
  }`
const delay = (i: number, step = 45): React.CSSProperties => ({ transitionDelay: `${i * step}ms` })

const Grid: React.FC = () => (
  <g stroke="#0f172a" strokeOpacity="0.06" strokeWidth="1">
    {[0.25, 0.5, 0.75].map((f) => (
      <line key={f} x1={PAD_X / 2} x2={W - PAD_X / 2} y1={H * f} y2={H * f} />
    ))}
  </g>
)

interface PreviewProps {
  shown: boolean
}

/* ------------------------------------------------------------------ */
/* Estructura reutilizable de una vela                                 */
/* ------------------------------------------------------------------ */

interface CandleShapeProps {
  x: number // centro horizontal
  width: number // ancho del cuerpo
  yHigh: number // coordenadas ya convertidas a pantalla
  yLow: number
  yOpen: number
  yClose: number
  shown?: boolean
  delayMs?: number
}

/** Una vela: mecha (máximo–mínimo) y cuerpo (apertura–cierre). Verde si cierra arriba, rosa si cierra abajo. */
export const CandleShape: React.FC<CandleShapeProps> = ({
  x,
  width,
  yHigh,
  yLow,
  yOpen,
  yClose,
  shown = true,
  delayMs = 0,
}) => {
  const up = yClose <= yOpen // en pantalla, "arriba" es una y menor
  const stroke = up ? UP_STROKE : DOWN_STROKE

  return (
    <g className={rev(shown)} style={{ transitionDelay: `${delayMs}ms` }}>
      <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
      <rect
        x={x - width / 2}
        y={Math.min(yOpen, yClose)}
        width={width}
        height={Math.max(Math.abs(yClose - yOpen), 2)}
        rx="1.5"
        fill={up ? UP_FILL : DOWN_FILL}
        stroke={stroke}
        strokeWidth="1.5"
      />
    </g>
  )
}

const CandleSeries: React.FC<{ data: Ohlc[]; label: string; shown: boolean }> = ({ data, label, shown }) => {
  const n = data.length
  const bodyW = slotW(n) * 0.58
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} className="h-full w-full">
      <Grid />
      {data.map((k, i) => (
        <CandleShape
          key={i}
          x={xOf(i, n)}
          width={bodyW}
          yHigh={yOf(k.h)}
          yLow={yOf(k.l)}
          yOpen={yOf(k.o)}
          yClose={yOf(k.c)}
          shown={shown}
          delayMs={i * 45}
        />
      ))}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Los cinco gráficos                                                  */
/* ------------------------------------------------------------------ */

/** 1. Líneas: une solo los precios de cierre. */
export const LineChartPreview: React.FC<PreviewProps> = ({ shown }) => {
  const n = SAMPLE.length
  const pts = SAMPLE.map((k, i): [number, number] => [xOf(i, n), yOf(k.c)])
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const floor = H - PAD_Y / 2
  const area = `${line} L${pts[n - 1][0].toFixed(1)},${floor} L${pts[0][0].toFixed(1)},${floor} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ejemplo de gráfico de líneas" className="h-full w-full">
      <defs>
        <linearGradient id="tp-line-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
        </linearGradient>
      </defs>
      <Grid />
      <path
        d={area}
        fill="url(#tp-line-area)"
        className={`transition-opacity duration-1000 motion-reduce:transition-none ${shown ? 'opacity-100' : 'opacity-0'}`}
      />
      <path
        d={line}
        fill="none"
        stroke={LINE_STROKE}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        style={{ strokeDashoffset: shown ? 0 : 1, transition: 'stroke-dashoffset 1400ms ease-out' }}
      />
      {pts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="2.6"
          fill="#fff"
          stroke={LINE_STROKE}
          strokeWidth="1.6"
          className={rev(shown)}
          style={delay(i)}
        />
      ))}
    </svg>
  )
}

/** 2. Barras (OHLC): una línea vertical (mín–máx), marca izquierda = apertura, marca derecha = cierre. */
export const OhlcBarsPreview: React.FC<PreviewProps> = ({ shown }) => {
  const n = SAMPLE.length
  const tick = slotW(n) * 0.25

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ejemplo de gráfico de barras OHLC" className="h-full w-full">
      <Grid />
      {SAMPLE.map((k, i) => {
        const x = xOf(i, n)
        return (
          <g
            key={i}
            className={rev(shown)}
            style={delay(i)}
            stroke={k.c >= k.o ? UP_STROKE : DOWN_STROKE}
            strokeWidth="1.8"
            strokeLinecap="round"
          >
            <line x1={x} x2={x} y1={yOf(k.h)} y2={yOf(k.l)} />
            <line x1={x - tick} x2={x} y1={yOf(k.o)} y2={yOf(k.o)} />
            <line x1={x} x2={x + tick} y1={yOf(k.c)} y2={yOf(k.c)} />
          </g>
        )
      })}
    </svg>
  )
}

/** 3. Velas japonesas: cuerpo (apertura–cierre) y mechas (máximo–mínimo). */
export const CandlesPreview: React.FC<PreviewProps> = ({ shown }) => (
  <CandleSeries data={SAMPLE} label="Ejemplo de gráfico de velas japonesas" shown={shown} />
)

/** 4. Heikin Ashi: mismas velas, pero promediadas, así se forman rachas de un solo color. */
export const HeikinAshiPreview: React.FC<PreviewProps> = ({ shown }) => (
  <CandleSeries data={HEIKIN} label="Ejemplo de gráfico Heikin Ashi" shown={shown} />
)

/** 5. Renko: ladrillos de tamaño fijo, sin eje de tiempo ni mechas. */
export const RenkoPreview: React.FC<PreviewProps> = ({ shown }) => {
  const n = RENKO.length
  const levels = RENKO.flatMap((b) => [b.open, b.close])
  const lo = Math.min(...levels)
  const hi = Math.max(...levels)
  const rows = Math.round((hi - lo) / BRICK_SIZE)
  const gap = 2.5
  const size = Math.min(18, (H - 2 * PAD_Y) / rows - gap, (W - 2 * PAD_X) / n - gap)
  const step = size + gap
  const left = (W - (n * step - gap)) / 2
  const bottom = (H + rows * step - gap) / 2

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ejemplo de gráfico Renko" className="h-full w-full">
      <Grid />
      {RENKO.map((b, i) => {
        const level = Math.round((Math.min(b.open, b.close) - lo) / BRICK_SIZE)
        return (
          <rect
            key={i}
            x={left + i * step}
            y={bottom - (level + 1) * step + gap}
            width={size}
            height={size}
            rx="2"
            fill={b.up ? UP_FILL : DOWN_FILL}
            stroke={b.up ? UP_STROKE : DOWN_STROKE}
            strokeWidth="1.5"
            className={rev(shown)}
            style={delay(i, 70)}
          />
        )
      })}
    </svg>
  )
}
