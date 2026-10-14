/* ------------------------------------------------------------------ */
/* Cálculo de indicadores para las ilustraciones                       */
/* Funciones puras: reciben precios y devuelven series.                */
/* ------------------------------------------------------------------ */

export type Series = Array<number | null>

/* ---------- datos de ejemplo reproducibles ---------- */

export function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export interface Segment {
  len: number // número de velas del tramo
  drift: number // avance medio por vela
  vol: number // amplitud del ruido
}

/** Serie de cierres por tramos (lateral, subida, bajada...) con ruido fijo. */
export function buildPrices(seed: number, segments: Segment[], start = 100): number[] {
  const rnd = mulberry32(seed)
  const out = [start]
  segments.forEach((seg) => {
    for (let i = 0; i < seg.len; i++) {
      const noise = rnd() + rnd() - 1 // entre -1 y 1
      out.push(out[out.length - 1] + seg.drift + noise * seg.vol)
    }
  })
  return out
}

export interface OhlcSeries {
  high: number[]
  low: number[]
  close: number[]
}

/** Máximos y mínimos a partir de los cierres (apertura = cierre anterior). */
export function toOhlc(close: number[], seed: number, wick: number): OhlcSeries {
  const rnd = mulberry32(seed)
  const high: number[] = []
  const low: number[] = []
  close.forEach((c, i) => {
    const o = i === 0 ? c : close[i - 1]
    high.push(Math.max(o, c) + rnd() * wick)
    low.push(Math.min(o, c) - rnd() * wick)
  })
  return { high, low, close }
}

/* ---------- medias móviles ---------- */

const avg = (v: number[]) => v.reduce((s, x) => s + x, 0) / v.length

/** SMA: promedio aritmético de los últimos n precios. */
export function sma(v: number[], n: number): Series {
  return v.map((_, i) => (i < n - 1 ? null : avg(v.slice(i - n + 1, i + 1))))
}

/** EMA: promedio ponderado con peso mayor en los datos recientes (alfa = 2 / (n + 1)). */
export function ema(v: number[], n: number): number[] {
  const alpha = 2 / (n + 1)
  const out: number[] = []
  v.forEach((x, i) => out.push(i === 0 ? x : alpha * x + (1 - alpha) * out[i - 1]))
  return out
}

/** SMMA: media suavizada (cada dato nuevo entra con peso 1 / n). */
export function smma(v: number[], n: number): number[] {
  const out: number[] = []
  v.forEach((x, i) => out.push(i === 0 ? x : (out[i - 1] * (n - 1) + x) / n))
  return out
}

/** LWMA: media ponderada linealmente (pesos n, n-1, ..., 1 del más reciente al más antiguo). */
export function lwma(v: number[], n: number): Series {
  const div = (n * (n + 1)) / 2
  return v.map((_, i) => {
    if (i < n - 1) return null
    let sum = 0
    for (let k = 0; k < n; k++) sum += (n - k) * v[i - k]
    return sum / div
  })
}

/** DEMA = 2·EMA − EMA(EMA). */
export function dema(v: number[], n: number): number[] {
  const e1 = ema(v, n)
  const e2 = ema(e1, n)
  return e1.map((x, i) => 2 * x - e2[i])
}

/** TEMA = 3·EMA − 3·EMA(EMA) + EMA(EMA(EMA)). */
export function tema(v: number[], n: number): number[] {
  const e1 = ema(v, n)
  const e2 = ema(e1, n)
  const e3 = ema(e2, n)
  return e1.map((x, i) => 3 * x - 3 * e2[i] + e3[i])
}

/* ---------- impulso ---------- */

/** RSI de Wilder (por defecto 14 periodos), de 0 a 100. */
export function rsi(close: number[], n = 14): Series {
  const out: Series = close.map(() => null)
  if (close.length <= n) return out
  let gain = 0
  let loss = 0
  for (let i = 1; i <= n; i++) {
    const d = close[i] - close[i - 1]
    if (d >= 0) gain += d
    else loss -= d
  }
  gain /= n
  loss /= n
  out[n] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss)
  for (let i = n + 1; i < close.length; i++) {
    const d = close[i] - close[i - 1]
    gain = (gain * (n - 1) + (d > 0 ? d : 0)) / n
    loss = (loss * (n - 1) + (d < 0 ? -d : 0)) / n
    out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss)
  }
  return out
}

export interface MacdResult {
  macd: number[]
  signal: number[]
  hist: number[]
}

/** MACD: EMA rápida − EMA lenta, su línea de señal (EMA del MACD) y el histograma. */
export function macd(close: number[], fast = 12, slow = 26, signalN = 9): MacdResult {
  const f = ema(close, fast)
  const s = ema(close, slow)
  const line = f.map((x, i) => x - s[i])
  const signal = ema(line, signalN)
  return { macd: line, signal, hist: line.map((x, i) => x - signal[i]) }
}

export interface KdjResult {
  k: number[]
  d: number[]
  j: number[]
}

/** KDJ: estocástico (9, 3, 3) con la línea J = 3K − 2D. */
export function kdj(ohlc: OhlcSeries, n = 9): KdjResult {
  const k: number[] = []
  const d: number[] = []
  ohlc.close.forEach((c, i) => {
    const from = Math.max(0, i - n + 1)
    const hh = Math.max(...ohlc.high.slice(from, i + 1))
    const ll = Math.min(...ohlc.low.slice(from, i + 1))
    const rsv = hh === ll ? 50 : ((c - ll) / (hh - ll)) * 100
    const kPrev = i === 0 ? 50 : k[i - 1]
    const dPrev = i === 0 ? 50 : d[i - 1]
    const kNow = (2 / 3) * kPrev + (1 / 3) * rsv
    k.push(kNow)
    d.push((2 / 3) * dPrev + (1 / 3) * kNow)
  })
  return { k, d, j: k.map((x, i) => 3 * x - 2 * d[i]) }
}

/* ---------- volatilidad y fuerza de tendencia ---------- */

export interface BollingerResult {
  mid: Series
  upper: Series
  lower: Series
}

/** Bandas de Bollinger: media de n periodos ± k desviaciones estándar. */
export function bollinger(close: number[], n = 20, k = 2): BollingerResult {
  const mid = sma(close, n)
  const upper: Series = []
  const lower: Series = []
  close.forEach((_, i) => {
    const m = mid[i]
    if (m === null) {
      upper.push(null)
      lower.push(null)
      return
    }
    const win = close.slice(i - n + 1, i + 1)
    const sd = Math.sqrt(avg(win.map((x) => (x - m) ** 2)))
    upper.push(m + k * sd)
    lower.push(m - k * sd)
  })
  return { mid, upper, lower }
}

/** ADX de Wilder (por defecto 14): fuerza de la tendencia de 0 a 100, sin dirección. */
export function adx(ohlc: OhlcSeries, n = 14): Series {
  const { high, low, close } = ohlc
  const len = close.length
  const out: Series = close.map(() => null)
  if (len < 2 * n) return out

  const tr: number[] = [0]
  const plus: number[] = [0]
  const minus: number[] = [0]
  for (let i = 1; i < len; i++) {
    tr.push(Math.max(high[i] - low[i], Math.abs(high[i] - close[i - 1]), Math.abs(low[i] - close[i - 1])))
    const up = high[i] - high[i - 1]
    const down = low[i - 1] - low[i]
    plus.push(up > down && up > 0 ? up : 0)
    minus.push(down > up && down > 0 ? down : 0)
  }

  let sTr = tr.slice(1, n + 1).reduce((s, x) => s + x, 0)
  let sPlus = plus.slice(1, n + 1).reduce((s, x) => s + x, 0)
  let sMinus = minus.slice(1, n + 1).reduce((s, x) => s + x, 0)

  const dx: number[] = []
  const pushDx = () => {
    const pdi = (100 * sPlus) / sTr
    const mdi = (100 * sMinus) / sTr
    dx.push(pdi + mdi === 0 ? 0 : (100 * Math.abs(pdi - mdi)) / (pdi + mdi))
  }
  pushDx()
  for (let i = n + 1; i < len; i++) {
    sTr = sTr - sTr / n + tr[i]
    sPlus = sPlus - sPlus / n + plus[i]
    sMinus = sMinus - sMinus / n + minus[i]
    pushDx()
  }

  // primer ADX: promedio de los primeros n DX; después, suavizado de Wilder
  let a = dx.slice(0, n).reduce((s, x) => s + x, 0) / n
  out[2 * n - 1] = a
  for (let i = n; i < dx.length; i++) {
    a = (a * (n - 1) + dx[i]) / n
    out[n + i] = a
  }
  return out
}

/* ---------- niveles ---------- */

/** Precios de los retrocesos de Fibonacci entre un mínimo y un máximo. */
export function fibLevels(low: number, high: number, ratios = [0.236, 0.382, 0.5, 0.618]): number[] {
  return ratios.map((r) => high - r * (high - low))
}
