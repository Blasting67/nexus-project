/* ==========================================================================
   LIBRERÍA EXTENDIDA DE INDICADORES TÉCNICOS
   ==========================================================================
   Cada función recibe un arreglo `candles` de velas con esta forma:
     { open, high, low, close, volume }
   ordenadas de la más antigua a la más reciente (índice 0 = más vieja).

   Organizada por NIVEL, como en una plataforma de trading real (GBM+,
   Binance, Bitso, TradingView):

     NIVEL 1 · BÁSICO     — lo que trae cualquier app de inversión de fábrica
     NIVEL 2 · INTERMEDIO — análisis técnico "serio", el siguiente escalón
     NIVEL 3 · EXPERTO    — osciladores y herramientas institucionales/avanzadas
     NIVEL 4 · ORIGINAL   — indicadores propios, no existen en ningún exchange

   Cada función trae un comentario: qué mide, cómo se calcula y qué regresa.
   ========================================================================== */


/* ---------- Utilidades base (las usa casi toda la librería) ---------- */

function sma(arr, n, i) { // media móvil simple de los últimos n valores hasta el índice i
  const start = Math.max(0, i - n + 1);
  const slice = arr.slice(start, i + 1);
  return slice.reduce((a, b) => a + b, 0) / slice.length;
}

function emaSeries(vals, n) { // serie completa de media móvil exponencial
  const k = 2 / (n + 1);
  let e = vals[0];
  const out = [e];
  for (let i = 1; i < vals.length; i++) { e = vals[i] * k + e * (1 - k); out.push(e); }
  return out;
}

function stddev(arr, n, i) { // desviación estándar de los últimos n valores hasta i
  const basis = sma(arr, n, i);
  const start = Math.max(0, i - n + 1);
  const slice = arr.slice(start, i + 1);
  const variance = slice.reduce((a, b) => a + Math.pow(b - basis, 2), 0) / slice.length;
  return Math.sqrt(variance);
}

function trueRange(c, prev) { // rango real de una vela (incluye gaps contra el cierre anterior)
  if (!prev) return c.high - c.low;
  return Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close));
}

function linReg(vals) { // pendiente e intercepto de una regresión lineal simple sobre `vals`
  const n = vals.length;
  const xs = [...Array(n).keys()];
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = vals.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - meanX) * (vals[i] - meanY); den += Math.pow(xs[i] - meanX, 2); }
  const slope = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}


/* ==========================================================================
   NIVEL 1 · BÁSICO
   ========================================================================== */

// --- Media Móvil Simple / Exponencial (MA 7 / EMA 25) ---
// Las medias móviles clásicas de cualquier app de inversión. MA7 reacciona
// rápido, EMA25 suaviza más. Cruzar el precio por encima/debajo se usa como
// señal de giro de corto plazo.
function indicadorMA(candles) {
  const closes = candles.map(c => c.close);
  const ema25 = emaSeries(closes, 25);
  return candles.map((c, i) => ({ ma7: sma(closes, 7, i), ema25: ema25[i] }));
}

// --- WMA (Media Móvil Ponderada) ---
// Como la SMA pero dando más peso a las velas más recientes (peso lineal
// 1,2,3...N). Reacciona más rápido que la SMA sin ser tan nerviosa como la EMA.
function indicadorWMA(candles, periodo = 20) {
  const closes = candles.map(c => c.close);
  const pesos = Array.from({ length: periodo }, (_, k) => k + 1);
  const sumaPesos = pesos.reduce((a, b) => a + b, 0);
  return closes.map((_, i) => {
    const start = Math.max(0, i - periodo + 1);
    const slice = closes.slice(start, i + 1);
    const pesosUsados = pesos.slice(pesos.length - slice.length);
    const num = slice.reduce((a, v, idx) => a + v * pesosUsados[idx], 0);
    return num / pesosUsados.reduce((a, b) => a + b, 0);
  });
}

// --- RSI Clásico (Relative Strength Index) ---
// El RSI "de libro de texto", sin ponderar por volumen (para eso está la
// versión Experto más abajo). Compara ganancias vs pérdidas promedio de los
// últimos 14 cierres: >70 sobrecompra, <30 sobreventa.
function indicadorRSIClasico(candles, periodo = 14) {
  let gain = 0, loss = 0;
  const start = Math.max(1, candles.length - periodo);
  for (let i = start; i < candles.length; i++) {
    const d = candles[i].close - candles[i - 1].close;
    if (d > 0) gain += d; else loss += -d;
  }
  if (gain === 0 && loss === 0) return 50;
  const rs = loss === 0 ? gain * 100 : gain / loss;
  return 100 - 100 / (1 + rs);
}

// --- Momentum ---
// La diferencia simple (no porcentual) entre el cierre actual y el cierre
// de hace N velas. Positivo = el precio está más arriba que antes; la
// pendiente de esta línea muestra si el impulso se acelera o se frena.
function indicadorMomentum(candles, periodo = 10) {
  return candles.map((c, i) => {
    const j = Math.max(0, i - periodo);
    return c.close - candles[j].close;
  });
}

// --- Bandas de Bollinger ---
// Canal estándar: banda central = SMA20, bandas = SMA20 ± 2 desviaciones
// estándar del cierre. Bandas "apretadas" anuncian baja volatilidad (posible
// explosión próxima); bandas abiertas, alta volatilidad.
function indicadorBollinger(candles, periodo = 20, desviaciones = 2) {
  const closes = candles.map(c => c.close);
  return candles.map((c, i) => {
    const mid = sma(closes, periodo, i);
    const sd = stddev(closes, periodo, i);
    return { mid, upper: mid + sd * desviaciones, lower: mid - sd * desviaciones };
  });
}

// --- Envelopes (Sobres de Media Móvil) ---
// Versión más simple que Bollinger: en vez de desviación estándar, traza
// bandas a un porcentaje FIJO arriba/abajo de una media móvil. Menos preciso
// mate­máticamente, pero muy fácil de leer — típico de apps básicas.
function indicadorEnvelopes(candles, periodo = 20, porcentaje = 2.5) {
  const closes = candles.map(c => c.close);
  return candles.map((c, i) => {
    const mid = sma(closes, periodo, i);
    return { mid, upper: mid * (1 + porcentaje / 100), lower: mid * (1 - porcentaje / 100) };
  });
}

// --- MACD (Moving Average Convergence Divergence) ---
// Resta la EMA26 a la EMA12 (línea MACD); su EMA9 es la "línea de señal".
// El histograma (MACD − señal) crece cuando el momentum se acelera y se
// achica cuando se agota.
function indicadorMACD(candles) {
  const closes = candles.map(c => c.close);
  const ema12 = emaSeries(closes, 12), ema26 = emaSeries(closes, 26);
  const macdLine = closes.map((_, i) => ema12[i] - ema26[i]);
  const signal = emaSeries(macdLine, 9);
  return candles.map((_, i) => ({ macd: macdLine[i], signal: signal[i], histogram: macdLine[i] - signal[i] }));
}

// --- ATR (Average True Range) ---
// El "ladrillo" de muchos otros indicadores (Supertrend, Keltner, stops):
// promedio suavizado del True Range. Mide volatilidad en unidades de precio.
function indicadorATR(candles, periodo = 14) {
  const trs = candles.map((c, i) => trueRange(c, candles[i - 1]));
  return emaSeries(trs, periodo);
}

// --- Volumen (barras simples) ---
// El indicador de volumen más básico: solo expone el volumen de cada vela,
// coloreado según si la vela cerró arriba o abajo de su apertura.
function indicadorVolumen(candles) {
  return candles.map(c => ({ volumen: c.volume, alcista: c.close >= c.open }));
}

// --- Pivotes Clásicos ---
// Niveles de soporte/resistencia con fórmula fija a partir del máximo (H),
// mínimo (L) y cierre (C) del periodo anterior. Muy usados por traders
// intradía como referencia de "dónde puede rebotar el precio".
function indicadorPivotesClasicos(H, L, C) {
  const p = (H + L + C) / 3;
  return { p, r1: 2 * p - L, s1: 2 * p - H, r2: p + (H - L), s2: p - (H - L) };
}

// --- Retroceso de Fibonacci ---
// Divide el rango entre un máximo y un mínimo recientes en proporciones
// "mágicas" (23.6%, 38.2%, 50%, 61.8%, 78.6%) que suelen actuar como
// soporte/resistencia durante una corrección de tendencia.
function indicadorFibonacci(H, L) {
  return [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(f => L + (H - L) * f);
}


/* ==========================================================================
   NIVEL 2 · INTERMEDIO
   ========================================================================== */

// --- Cruce Dorado / Cruce de la Muerte (EMA 50 / EMA 200) ---
// Tendencia de largo plazo. EMA50 cruzando arriba de EMA200 = "golden cross"
// (señal alcista fuerte); cruzando abajo = "death cross".
function indicadorCruceDorado(candles) {
  const closes = candles.map(c => c.close);
  const ema50 = emaSeries(closes, Math.min(50, closes.length));
  const ema200 = emaSeries(closes, Math.min(200, closes.length));
  return candles.map((c, i) => ({
    ema50: ema50[i], ema200: ema200[i],
    goldenCross: i > 0 && ema50[i - 1] <= ema200[i - 1] && ema50[i] > ema200[i],
    deathCross: i > 0 && ema50[i - 1] >= ema200[i - 1] && ema50[i] < ema200[i],
  }));
}

// --- HMA (Hull Moving Average) ---
// Media diseñada para ser rápida Y suave al mismo tiempo (algo que
// normalmente es un trade-off). Usa dos WMA de distinto periodo y una
// tercera WMA sobre su diferencia ponderada por raíz de N. Muy popular
// para scalping porque "abraza" el precio con poco retraso.
function indicadorHMA(candles, periodo = 16) {
  const closes = candles.map(c => c.close);
  const wmaFn = (vals, n) => {
    const pesos = Array.from({ length: n }, (_, k) => k + 1);
    return vals.map((_, i) => {
      const start = Math.max(0, i - n + 1);
      const slice = vals.slice(start, i + 1);
      const pw = pesos.slice(pesos.length - slice.length);
      return slice.reduce((a, v, idx) => a + v * pw[idx], 0) / pw.reduce((a, b) => a + b, 0);
    });
  };
  const wmaHalf = wmaFn(closes, Math.round(periodo / 2));
  const wmaFull = wmaFn(closes, periodo);
  const diff = closes.map((_, i) => 2 * wmaHalf[i] - wmaFull[i]);
  return wmaFn(diff, Math.round(Math.sqrt(periodo)));
}

// --- Supertrend Clásico ---
// La versión original (distinta de la "Institucional" que usa VWAP): banda
// central = precio medio (H+L)/2, bandas = centro ± (multiplicador × ATR).
// Cuando el cierre cruza la banda, la tendencia voltea — una de las señales
// de "sube/baja" más usadas en trading algorítmico.
function indicadorSupertrendClasico(candles, periodo = 10, mult = 3) {
  const atr = indicadorATR(candles, periodo);
  let trend = 1, st = (candles[0].high + candles[0].low) / 2;
  return candles.map((c, i) => {
    const hl2 = (c.high + c.low) / 2;
    const upper = hl2 + mult * atr[i], lower = hl2 - mult * atr[i];
    if (c.close > upper) trend = 1;
    if (c.close < lower) trend = -1;
    st = trend === 1 ? Math.max(st, lower) : Math.min(st, upper);
    return { value: st, up: trend === 1 };
  });
}

// --- Estocástico %K / %D ---
// Compara el cierre actual contra el rango (máximo-mínimo) de los últimos
// 14 periodos: 100 = cerró en el máximo, 0 = cerró en el mínimo.
function indicadorEstocastico(candles, periodo = 14) {
  const win = candles.slice(-periodo);
  const hh = Math.max(...win.map(c => c.high)), ll = Math.min(...win.map(c => c.low));
  const close = candles[candles.length - 1].close;
  return hh === ll ? 50 : ((close - ll) / (hh - ll)) * 100;
}

// --- CCI (Commodity Channel Index) ---
// Qué tan lejos está el precio típico [(H+L+C)/3] de su propio promedio,
// normalizado por la desviación media. >+100 posible sobrecompra/arranque
// fuerte; <-100 lo opuesto.
function indicadorCCI(candles, periodo = 20) {
  const typical = candles.map(c => (c.high + c.low + c.close) / 3);
  return candles.map((c, i) => {
    const basis = sma(typical, periodo, i);
    const start = Math.max(0, i - periodo + 1);
    const slice = typical.slice(start, i + 1);
    const meanDev = slice.reduce((a, b) => a + Math.abs(b - basis), 0) / slice.length;
    return meanDev === 0 ? 0 : (typical[i] - basis) / (0.015 * meanDev);
  });
}

// --- Williams %R ---
// Hermano del Estocástico pero invertido, escala 0 a -100: 0 = sobrecompra,
// -100 = sobreventa. Reacciona más rápido que el RSI a giros de corto plazo.
function indicadorWilliamsR(candles, periodo = 14) {
  const win = candles.slice(-periodo);
  const hh = Math.max(...win.map(c => c.high)), ll = Math.min(...win.map(c => c.low));
  const close = candles[candles.length - 1].close;
  return hh === ll ? -50 : ((hh - close) / (hh - ll)) * -100;
}

// --- ROC (Rate of Change) ---
// Porcentaje de cambio del precio respecto a N velas atrás. Mide aceleración
// del movimiento en términos relativos (a diferencia del Momentum, que es
// en unidades absolutas de precio).
function indicadorROC(candles, periodo = 10) {
  return candles.map((c, i) => {
    const j = Math.max(0, i - periodo);
    const prev = candles[j].close;
    return prev === 0 ? 0 : ((c.close - prev) / prev) * 100;
  });
}

// --- ADX / DMI (Average Directional Index) ---
// No dice si sube o baja, dice qué tan FUERTE es la tendencia. ADX > 25 =
// tendencia fuerte (vale la pena seguirla); ADX < 20 = mercado lateral.
function indicadorADX(candles, periodo = 14) {
  const plusDM = [], minusDM = [], tr = [];
  for (let i = 1; i < candles.length; i++) {
    const upMove = candles[i].high - candles[i - 1].high;
    const downMove = candles[i - 1].low - candles[i].low;
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
    tr.push(trueRange(candles[i], candles[i - 1]));
  }
  const sTR = emaSeries(tr, periodo), sPlus = emaSeries(plusDM, periodo), sMinus = emaSeries(minusDM, periodo);
  const plusDI = sPlus.map((v, i) => 100 * v / (sTR[i] || 1));
  const minusDI = sMinus.map((v, i) => 100 * v / (sTR[i] || 1));
  const dx = plusDI.map((v, i) => { const s = v + minusDI[i]; return s === 0 ? 0 : 100 * Math.abs(v - minusDI[i]) / s; });
  return { plusDI, minusDI, adx: emaSeries(dx, periodo) };
}

// --- Aroon Up / Aroon Down ---
// Cuántas velas pasaron desde el máximo (Aroon Up) y desde el mínimo (Aroon
// Down) de los últimos N periodos, en escala 0-100. Cerca de 100 = ese
// extremo fue muy reciente (tendencia fresca en esa dirección).
function indicadorAroon(candles, periodo = 25) {
  return candles.map((c, i) => {
    const start = Math.max(0, i - periodo);
    const win = candles.slice(start, i + 1);
    let hiIdx = 0, loIdx = 0, hiVal = -Infinity, loVal = Infinity;
    win.forEach((k, idx) => {
      if (k.high >= hiVal) { hiVal = k.high; hiIdx = idx; }
      if (k.low <= loVal) { loVal = k.low; loIdx = idx; }
    });
    const n = win.length - 1 || 1;
    return { up: ((n - (win.length - 1 - hiIdx)) / n) * 100, down: ((n - (win.length - 1 - loIdx)) / n) * 100 };
  });
}

// --- Parabolic SAR ---
// Puntos que "saltan" de un lado al otro de la vela: debajo mientras sube
// (soporte), arriba cuando voltea (resistencia). El "acceleration factor"
// crece mientras la tendencia se mantiene.
function indicadorParabolicSAR(candles) {
  let psar = candles[0].low, bull = true, ep = candles[0].high, af = 0.02;
  return candles.map((c, i) => {
    if (i === 0) return { value: psar, up: bull };
    psar = psar + af * (ep - psar);
    if (bull) {
      psar = Math.min(psar, candles[i - 1].low);
      if (c.low < psar) { bull = false; psar = ep; ep = c.low; af = 0.02; }
      else if (c.high > ep) { ep = c.high; af = Math.min(af + 0.02, 0.2); }
    } else {
      psar = Math.max(psar, candles[i - 1].high);
      if (c.high > psar) { bull = true; psar = ep; ep = c.high; af = 0.02; }
      else if (c.low < ep) { ep = c.low; af = Math.min(af + 0.02, 0.2); }
    }
    return { value: psar, up: bull };
  });
}

// --- Ichimoku Lite ---
// Versión simplificada de la nube Ichimoku: Senkou Span A/B a partir de
// promedios de máximos/mínimos de 9, 26 y 52 periodos. Precio arriba de la
// nube = alcista; abajo = bajista; dentro = indecisión.
function indicadorIchimokuLite(candles) {
  const hh = (n, i) => { const s = Math.max(0, i - n + 1); return Math.max(...candles.slice(s, i + 1).map(k => k.high)); };
  const ll = (n, i) => { const s = Math.max(0, i - n + 1); return Math.min(...candles.slice(s, i + 1).map(k => k.low)); };
  return candles.map((c, i) => {
    const tenkan = (hh(9, i) + ll(9, i)) / 2, kijun = (hh(26, i) + ll(26, i)) / 2;
    return { spanA: (tenkan + kijun) / 2, spanB: (hh(52, i) + ll(52, i)) / 2 };
  });
}

// --- Canales de Keltner ---
// Parecidos a Bollinger pero con ATR en vez de desviación estándar, así que
// reaccionan al rango real de las velas. Centro = EMA20; bandas = centro ±
// (ATR × multiplicador).
function indicadorKeltnerChannels(candles, emaLen = 20, atrLen = 10, mult = 2) {
  const closes = candles.map(c => c.close);
  const emaMid = emaSeries(closes, emaLen);
  const atrSeries = indicadorATR(candles, atrLen);
  return candles.map((c, i) => ({ mid: emaMid[i], upper: emaMid[i] + atrSeries[i] * mult, lower: emaMid[i] - atrSeries[i] * mult }));
}

// --- Canales de Donchian ---
// El canal más simple: máximo y mínimo de los últimos N periodos. Útil para
// "breakout trading" y para ver el rango de operación reciente de un vistazo.
function indicadorDonchianChannels(candles, n = 20) {
  return candles.map((c, i) => {
    const s = Math.max(0, i - n + 1);
    const win = candles.slice(s, i + 1);
    const upper = Math.max(...win.map(k => k.high)), lower = Math.min(...win.map(k => k.low));
    return { upper, lower, mid: (upper + lower) / 2 };
  });
}

// --- Volumen Relativo (RVOL) ---
// Compara el volumen de la vela actual contra el promedio de las últimas N
// velas. RVOL > 1.5 significa "hoy se está negociando mucho más de lo
// normal" — útil para confirmar que un movimiento tiene respaldo real.
function indicadorVolumenRelativo(candles, periodo = 20) {
  const vols = candles.map(c => c.volume);
  return candles.map((c, i) => {
    const prom = sma(vols, periodo, i);
    return prom === 0 ? 1 : c.volume / prom;
  });
}

// --- Canal de Regresión Lineal ---
// Traza la línea de "mejor ajuste" (mínimos cuadrados) sobre los últimos N
// cierres y dos bandas paralelas a una desviación estándar de distancia.
// A diferencia de una media móvil, SÍ proyecta hacia dónde "debería" ir el
// precio si la tendencia estadística se mantiene.
function indicadorCanalRegresionLineal(candles, periodo = 50, desviaciones = 2) {
  const closes = candles.map(c => c.close);
  return candles.map((c, i) => {
    const start = Math.max(0, i - periodo + 1);
    const slice = closes.slice(start, i + 1);
    const { slope, intercept } = linReg(slice);
    const center = slope * (slice.length - 1) + intercept;
    const sd = stddev(closes, periodo, i);
    return { center, upper: center + sd * desviaciones, lower: center - sd * desviaciones, pendiente: slope };
  });
}

// --- VWAP + Bandas de Desviación ---
// VWAP = precio promedio ponderado por volumen acumulado desde el inicio de
// la sesión. Bandas ajustadas por la desviación media absoluta para detectar
// puntos de agotamiento (mean reversion).
function indicadorVWAPConBandas(candles, desviaciones = 1.4) {
  let cumPV = 0, cumV = 0;
  const vwap = candles.map(c => {
    const typical = (c.high + c.low + c.close) / 3;
    cumPV += typical * c.volume; cumV += c.volume;
    return cumPV / cumV;
  });
  const closes = candles.map(c => c.close);
  const mean = closes.reduce((a, b) => a + b, 0) / closes.length;
  const mad = closes.reduce((a, b) => a + Math.abs(b - mean), 0) / closes.length;
  return vwap.map(v => ({ vwap: v, upper: v + mad * desviaciones, lower: v - mad * desviaciones }));
}


/* ==========================================================================
   NIVEL 3 · EXPERTO
   ========================================================================== */

// --- RSI Ponderado por Volumen ---
// El RSI normal da falsas señales cuando el movimiento trae poco volumen.
// Aquí cada subida/bajada se multiplica por (volumen/60) antes de calcular
// ganancias y pérdidas: los picos extremos solo aparecen con volumen real.
function indicadorRSIPonderadoPorVolumen(candles, periodo = 14) {
  let gain = 0, loss = 0;
  const start = Math.max(1, candles.length - periodo);
  for (let i = start; i < candles.length; i++) {
    const d = candles[i].close - candles[i - 1].close;
    const w = candles[i].volume / 60;
    if (d > 0) gain += d * w; else loss += -d * w;
  }
  if (loss === 0 && gain === 0) return 50;
  const rs = loss === 0 ? gain * 100 : gain / loss;
  return 100 - 100 / (1 + rs);
}

// --- Heikin-Ashi ---
// Transformación (no un oscilador): suaviza el ruido promediando cada vela
// con la anterior, facilitando ver la tendencia real sin las sacudidas de
// las velas normales.
function transformarHeikinAshi(candles) {
  let prevHA = null;
  return candles.map(c => {
    const haClose = (c.open + c.high + c.low + c.close) / 4;
    const haOpen = prevHA ? (prevHA.open + prevHA.close) / 2 : (c.open + c.close) / 2;
    const haHigh = Math.max(c.high, haOpen, haClose), haLow = Math.min(c.low, haOpen, haClose);
    prevHA = { open: haOpen, close: haClose };
    return { open: haOpen, high: haHigh, low: haLow, close: haClose };
  });
}

// --- OBV (On Balance Volume) ---
// Acumula el volumen: lo suma si el cierre sube, lo resta si baja. Si el
// precio está plano pero el OBV sube, hay acumulación oculta (compras
// institucionales sin mover mucho el precio todavía).
function indicadorOBV(candles) {
  let obv = 0;
  return candles.map((c, i) => {
    if (i === 0) return 0;
    if (c.close > candles[i - 1].close) obv += c.volume;
    else if (c.close < candles[i - 1].close) obv -= c.volume;
    return obv;
  });
}

// --- ADL (Línea de Acumulación / Distribución) ---
// Parecida al OBV pero más fina: en vez de solo mirar si subió o bajó,
// pondera CUÁNTO dentro del rango de la vela cerró el precio. Es la base
// del Oscilador de Chaikin de abajo.
function indicadorADL(candles) {
  let adl = 0;
  return candles.map(c => {
    const range = c.high - c.low;
    const mfm = range === 0 ? 0 : ((c.close - c.low) - (c.high - c.close)) / range;
    adl += mfm * c.volume;
    return adl;
  });
}

// --- Oscilador de Chaikin ---
// EMA3 menos EMA10 de la línea ADL. Mide la ACELERACIÓN del flujo de
// dinero (no solo su dirección): cruces de cero anticipan cambios de
// presión compradora/vendedora antes de que se vean en el precio.
function indicadorChaikinOscillator(candles) {
  const adl = indicadorADL(candles);
  const ema3 = emaSeries(adl, 3), ema10 = emaSeries(adl, 10);
  return ema3.map((v, i) => v - ema10[i]);
}

// --- MFI (Money Flow Index) — "el RSI pero con volumen" ---
// Usa precio típico × volumen como "flujo de dinero". Si el flujo de velas
// alcistas supera mucho al de las bajistas en 14 periodos, sube hacia 100
// (sobrecompra); si no, baja hacia 0 (sobreventa).
function indicadorMFI(candles, periodo = 14) {
  const typical = candles.map(c => (c.high + c.low + c.close) / 3);
  let posFlow = 0, negFlow = 0;
  const start = Math.max(1, candles.length - periodo);
  for (let i = start; i < candles.length; i++) {
    const flow = typical[i] * candles[i].volume;
    if (typical[i] > typical[i - 1]) posFlow += flow; else negFlow += flow;
  }
  if (negFlow === 0) return 100;
  return 100 - 100 / (1 + posFlow / negFlow);
}

// --- CMF (Chaikin Money Flow) ---
// Presión compradora vs vendedora DENTRO de cada vela: cierre cerca del
// máximo "pesa" como compra, cerca del mínimo como venta. Ponderado por
// volumen y promediado sobre N velas. >0 presión compradora neta.
function indicadorCMF(candles, periodo = 20) {
  const start = Math.max(0, candles.length - periodo);
  const win = candles.slice(start);
  let sumMFV = 0, sumVol = 0;
  win.forEach(c => {
    const range = c.high - c.low;
    const mult = range === 0 ? 0 : ((c.close - c.low) - (c.high - c.close)) / range;
    sumMFV += mult * c.volume; sumVol += c.volume;
  });
  return sumVol === 0 ? 0 : sumMFV / sumVol;
}

// --- Force Index (Índice de Fuerza de Elder) ---
// Multiplica el cambio de precio entre velas por el volumen de la vela:
// combina EN UN SOLO NÚMERO si el precio se movió y qué tanto volumen hubo
// detrás. Se suaviza con una EMA corta para usarse como señal.
function indicadorForceIndex(candles, periodo = 13) {
  const raw = candles.map((c, i) => i === 0 ? 0 : (c.close - candles[i - 1].close) * c.volume);
  return emaSeries(raw, periodo);
}

// --- Elder Ray (Bull Power / Bear Power) ---
// Compara el máximo y el mínimo de la vela contra una EMA13: Bull Power =
// qué tanto los compradores empujaron el precio POR ENCIMA de la media;
// Bear Power = qué tanto los vendedores lo empujaron por DEBAJO.
function indicadorElderRay(candles, periodo = 13) {
  const closes = candles.map(c => c.close);
  const ema13 = emaSeries(closes, periodo);
  return candles.map((c, i) => ({ bullPower: c.high - ema13[i], bearPower: c.low - ema13[i] }));
}

// --- Awesome Oscillator (Bill Williams) ---
// SMA5 menos SMA34 del precio medio (H+L)/2 de cada vela. Mide el momentum
// de corto plazo contra el de mediano plazo; sus barras verdes/rojas (como
// un histograma) muestran si el impulso reciente está creciendo o menguando.
function indicadorAwesomeOscillator(candles) {
  const hl2 = candles.map(c => (c.high + c.low) / 2);
  return candles.map((_, i) => sma(hl2, 5, i) - sma(hl2, 34, i));
}

// --- Vortex Indicator (VI+ / VI-) ---
// Mide el movimiento direccional comparando qué tan lejos está el máximo de
// hoy del mínimo de ayer (VI+) contra qué tan lejos está el mínimo de hoy
// del máximo de ayer (VI-), normalizado por la suma de True Range. Cuando
// VI+ cruza arriba de VI- = posible inicio de tendencia alcista.
function indicadorVortex(candles, periodo = 14) {
  const vmPlus = [], vmMinus = [], tr = [];
  for (let i = 1; i < candles.length; i++) {
    vmPlus.push(Math.abs(candles[i].high - candles[i - 1].low));
    vmMinus.push(Math.abs(candles[i].low - candles[i - 1].high));
    tr.push(trueRange(candles[i], candles[i - 1]));
  }
  return vmPlus.map((_, i) => {
    const s = Math.max(0, i - periodo + 1);
    const sumTR = tr.slice(s, i + 1).reduce((a, b) => a + b, 0) || 1;
    const sumVMPlus = vmPlus.slice(s, i + 1).reduce((a, b) => a + b, 0);
    const sumVMMinus = vmMinus.slice(s, i + 1).reduce((a, b) => a + b, 0);
    return { viPlus: sumVMPlus / sumTR, viMinus: sumVMMinus / sumTR };
  });
}

// --- Ultimate Oscillator ---
// Combina TRES estocásticos de distinto periodo (7, 14, 28) en un solo
// número, para evitar las falsas divergencias que da un oscilador de un
// solo periodo. Pondera más el periodo corto sin ignorar el largo plazo.
function indicadorUltimateOscillator(candles) {
  const bp = [], tr = []; // buying pressure y true range por vela
  for (let i = 1; i < candles.length; i++) {
    const minLowPrevClose = Math.min(candles[i].low, candles[i - 1].close);
    bp.push(candles[i].close - minLowPrevClose);
    tr.push(trueRange(candles[i], candles[i - 1]));
  }
  const avg = (n, i) => {
    const s = Math.max(0, i - n + 1);
    const sumBP = bp.slice(s, i + 1).reduce((a, b) => a + b, 0);
    const sumTR = tr.slice(s, i + 1).reduce((a, b) => a + b, 0) || 1;
    return sumBP / sumTR;
  };
  return bp.map((_, i) => {
    const a7 = avg(7, i), a14 = avg(14, i), a28 = avg(28, i);
    return 100 * (4 * a7 + 2 * a14 + a28) / 7;
  });
}

// --- TRIX ---
// Triple EMA suavizada, expresada como tasa de cambio porcentual. Filtra
// casi todo el ruido de corto plazo: solo queda la tendencia "de fondo",
// y sus cruces de cero anticipan giros de tendencia de mediano plazo.
function indicadorTRIX(candles, periodo = 15) {
  const closes = candles.map(c => c.close);
  const e1 = emaSeries(closes, periodo);
  const e2 = emaSeries(e1, periodo);
  const e3 = emaSeries(e2, periodo);
  return e3.map((v, i) => i === 0 ? 0 : ((v - e3[i - 1]) / (e3[i - 1] || 1)) * 100);
}

// --- DPO (Detrended Price Oscillator) ---
// Resta al precio una media móvil DESPLAZADA hacia atrás, para quitar la
// tendencia de largo plazo y dejar ver solo los ciclos de corto plazo —
// útil para contar cuántas velas dura normalmente un ciclo del activo.
function indicadorDPO(candles, periodo = 20) {
  const closes = candles.map(c => c.close);
  const shift = Math.floor(periodo / 2) + 1;
  return candles.map((c, i) => {
    const j = i - shift;
    if (j < 0) return 0;
    return closes[i] - sma(closes, periodo, j);
  });
}

// --- Choppiness Index ---
// No dice dirección, dice si el mercado está "picado" (lateral, sin
// dirección, cerca de 100) o en tendencia clara (cerca de 0). Se basa en
// cuánto True Range acumulado hay comparado contra el rango total del
// periodo — mucho ruido con poco avance neto = choppy.
function indicadorChoppinessIndex(candles, periodo = 14) {
  const trs = candles.map((c, i) => trueRange(c, candles[i - 1]));
  return candles.map((c, i) => {
    const s = Math.max(0, i - periodo + 1);
    const sumTR = trs.slice(s, i + 1).reduce((a, b) => a + b, 0);
    const win = candles.slice(s, i + 1);
    const hh = Math.max(...win.map(k => k.high)), ll = Math.min(...win.map(k => k.low));
    const range = hh - ll || 1;
    return 100 * Math.log10(sumTR / range) / Math.log10(periodo);
  });
}

// --- Zig Zag ---
// No es un oscilador: filtra el "ruido" uniendo solo los giros de precio
// que superan un porcentaje mínimo (ej. 3%), ignorando micro-movimientos.
// Resultado: una línea en zigzag que marca los swings reales del mercado,
// base de mucho análisis de estructura de mercado (máximos/mínimos).
function indicadorZigZag(candles, umbralPorcentaje = 3) {
  const puntos = [];
  let lastPivotIdx = 0, lastPivotPrice = candles[0].close, direction = 0;
  for (let i = 1; i < candles.length; i++) {
    const cambio = ((candles[i].close - lastPivotPrice) / lastPivotPrice) * 100;
    if (direction >= 0 && cambio <= -umbralPorcentaje) {
      puntos.push({ i: lastPivotIdx, price: lastPivotPrice, tipo: 'alto' });
      lastPivotIdx = i; lastPivotPrice = candles[i].close; direction = -1;
    } else if (direction <= 0 && cambio >= umbralPorcentaje) {
      puntos.push({ i: lastPivotIdx, price: lastPivotPrice, tipo: 'bajo' });
      lastPivotIdx = i; lastPivotPrice = candles[i].close; direction = 1;
    } else if ((direction >= 0 && candles[i].close > lastPivotPrice) || (direction <= 0 && candles[i].close < lastPivotPrice)) {
      lastPivotIdx = i; lastPivotPrice = candles[i].close; // extiende el pivote vigente
    }
  }
  return puntos;
}

// --- Order Blocks con Desgaste Dinámico ---
// Detecta velas de volumen institucional antes de un movimiento fuerte y
// las dibuja como zonas horizontales que se "gastan" cada vez que el precio
// regresa a retestearlas: fresca (0 toques) alta probabilidad de rebote;
// mitigada (2-3 toques) casi transparente.
function crearOrderBlock(candleIndex, candle) {
  return { start: candleIndex, low: candle.low - 0.6, high: candle.high + 0.6, touches: 0 };
}
function alfaOrderBlock(touches) {
  return [0.24, 0.15, 0.08, 0.04][Math.min(touches, 3)];
}

// --- Cajas de Liquidez Activa (Fair Value Gaps filtrados por ATR) ---
// Un FVG es un "hueco" de precio entre tres velas consecutivas donde no
// hubo negociación. Solo se grafica si el hueco es mayor a 1.5× el ATR
// actual, y se borra cuando el precio regresa y "llena" la zona.
function detectarFVG(candles, i, atrActual, factor = 1.5) {
  if (i < 2) return null;
  const a = candles[i - 2], c = candles[i];
  const gapUp = c.low - a.high, gapDown = a.low - c.high;
  if (gapUp > atrActual * factor) return { low: a.high, high: c.low, up: true };
  if (gapDown > atrActual * factor) return { low: c.high, high: a.low, up: false };
  return null;
}


/* ==========================================================================
   NIVEL 4 · ORIGINAL (propios — no existen en ningún exchange real)
   ========================================================================== */

// --- Confluence Pulse ---
// En vez de amontonar subpaneles, cambia el ASPECTO de la propia vela según
// 3 fases: Neutral (gris, rango/baja volatilidad), Compresión (punto
// amarillo cuando Bollinger se aprieta dentro de Keltner), Impulso (vela
// sólida cuando rompe la compresión con pico de volumen > media 20).
function calcularFaseConfluencePulse(candle, volumenPromedio20, bollinger, keltner) {
  const comprimido = bollinger.upper < keltner.upper && bollinger.lower > keltner.lower;
  const impulso = candle.volume > volumenPromedio20 * 1.3 &&
    Math.abs(candle.close - candle.open) > (candle.high - candle.low) * 0.6;
  if (impulso) return 'impulso';
  if (comprimido) return 'compresion';
  return 'neutral';
}

// --- Radar de Divergencias Automático (Precio + Momentum) ---
// Compara los mínimos (o máximos) del PRECIO contra los del oscilador en
// esos mismos puntos. Precio hace mínimo más bajo pero el oscilador hace
// mínimo más alto → divergencia alcista regular (línea sólida); al revés en
// plena tendencia → divergencia oculta de continuación (punteada).
function detectarDivergencia(preciosMinimos, osciladorEnEsosPuntos) {
  const [p1, p2] = preciosMinimos, [o1, o2] = osciladorEnEsosPuntos;
  if (p2 < p1 && o2 > o1) return { tipo: 'alcista_regular', solida: true };
  if (p2 > p1 && o2 < o1) return { tipo: 'continuacion_oculta', solida: false };
  return null;
}

// --- Vector de Velocidad del Precio (Ángulo de EMA × ADX) ---
// Combina la pendiente de una EMA corta con la fuerza de tendencia del ADX
// en una sola flecha: crece y se inclina cuando ambas coinciden
// (aceleración real); se queda chica y horizontal en consolidación.
function calcularVectorVelocidad(closesRecientes, adxActual) {
  const pendiente = closesRecientes[closesRecientes.length - 1] - closesRecientes[0];
  const magnitud = Math.max(-1, Math.min(1, (pendiente / 6) * (adxActual / 25)));
  return { magnitud, angulo: -magnitud * 0.9 };
}

// --- Régimen de Correlación (Intermercado) ---
// Correlación en tiempo real entre el activo y una referencia macro (BTC vs
// S&P500, una acción vs su sector). No dibuja líneas: cambia el tono de
// FONDO del gráfico — verde si va con el mercado global, gris/rojo si se
// está descorrelacionando.
function calcularRegimenCorrelacion(retornosActivo, retornosReferencia) {
  const n = Math.min(retornosActivo.length, retornosReferencia.length);
  const a = retornosActivo.slice(-n), b = retornosReferencia.slice(-n);
  const meanA = a.reduce((x, y) => x + y, 0) / n, meanB = b.reduce((x, y) => x + y, 0) / n;
  let num = 0, denA = 0, denB = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - meanA) * (b[i] - meanB);
    denA += Math.pow(a[i] - meanA, 2); denB += Math.pow(b[i] - meanB, 2);
  }
  const corr = denA && denB ? num / Math.sqrt(denA * denB) : 0;
  return { correlacion: corr, alineado: corr > 0.3 };
}

// --- Smart Money Footprint ---
// Marca velas con volumen anómalo (>1.7× el promedio) Y mecha larga — la
// "huella" de una absorción institucional: alguien grande compró o vendió
// fuerte pero el precio no se movió proporcionalmente.
function detectarSmartMoneyFootprint(candle, volumenPromedio) {
  const mechaTotal = candle.high - candle.low, cuerpo = Math.abs(candle.close - candle.open);
  const esAnomalo = candle.volume > volumenPromedio * 1.7 && mechaTotal > 0.01;
  const esAbsorcion = esAnomalo && cuerpo < mechaTotal * 0.4;
  return esAbsorcion ? { up: candle.close >= candle.open } : null;
}

// --- Líneas Magnéticas ---
// Identifica niveles de precio "redondos" cercanos al precio actual: la
// idea es que el precio tiende a ser "atraído" hacia números psicológicos
// redondos. La línea brilla más cuanto más se acerca el precio.
function calcularLineasMagneticas(precioActual, rangoDelDia) {
  const step = precioActual > 50 ? 5 : 1;
  const base = Math.round(precioActual / step) * step;
  const niveles = [base - step * 2, base - step, base, base + step, base + step * 2];
  return niveles.map(lv => ({ nivel: lv, cerca: Math.abs(precioActual - lv) < rangoDelDia * 0.04 }));
}

// --- Brújula de Energía Fractal ---
// Combina volatilidad normalizada (ATR/rango reciente) y volumen normalizado
// de la última vela en una lectura de 0-100%, como una "aguja" que indica
// qué tan cargado de energía está el mercado ahora mismo.
function calcularBrujulaEnergiaFractal(ultimaVela, atrActual) {
  const volNorm = Math.min(1, ultimaVela.volume / 120);
  const atrNorm = Math.min(1, atrActual / 3);
  return Math.round((volNorm * 0.6 + atrNorm * 0.4) * 100);
}


/* ==========================================================================
   EXPORTS — descomenta si lo usas como módulo (Node / bundler)
   ========================================================================== */
// module.exports = {
//   // utilidades
//   sma, emaSeries, stddev, trueRange, linReg,
//   // nivel 1 · básico
//   indicadorMA, indicadorWMA, indicadorRSIClasico, indicadorMomentum,
//   indicadorBollinger, indicadorEnvelopes, indicadorMACD, indicadorATR,
//   indicadorVolumen, indicadorPivotesClasicos, indicadorFibonacci,
//   // nivel 2 · intermedio
//   indicadorCruceDorado, indicadorHMA, indicadorSupertrendClasico,
//   indicadorEstocastico, indicadorCCI, indicadorWilliamsR, indicadorROC,
//   indicadorADX, indicadorAroon, indicadorParabolicSAR, indicadorIchimokuLite,
//   indicadorKeltnerChannels, indicadorDonchianChannels, indicadorVolumenRelativo,
//   indicadorCanalRegresionLineal, indicadorVWAPConBandas,
//   // nivel 3 · experto
//   indicadorRSIPonderadoPorVolumen, transformarHeikinAshi, indicadorOBV,
//   indicadorADL, indicadorChaikinOscillator, indicadorMFI, indicadorCMF,
//   indicadorForceIndex, indicadorElderRay, indicadorAwesomeOscillator,
//   indicadorVortex, indicadorUltimateOscillator, indicadorTRIX, indicadorDPO,
//   indicadorChoppinessIndex, indicadorZigZag, crearOrderBlock, alfaOrderBlock, detectarFVG,
//   // nivel 4 · original
//   calcularFaseConfluencePulse, detectarDivergencia, calcularVectorVelocidad,
//   calcularRegimenCorrelacion, detectarSmartMoneyFootprint,
//   calcularLineasMagneticas, calcularBrujulaEnergiaFractal,
// };
