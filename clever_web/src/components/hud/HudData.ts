import type { HudIconKey, HudToneKey } from './HudIcons'

/* ------------------------------------------------------------------ */
/* Contenido del HUD de AnalysisPage                                   */
/* ------------------------------------------------------------------ */

/* Introducción: ¿Qué es hacer Trading? */
export const TRADING_INTRO = {
  analogy:
    'Es como ir al tianguis. Ves que las manzanas están baratas hoy, compras 10 kilos, y la semana siguiente las vendes más caras porque escasearon.',
  steps: [
    { icon: 'apple' as HudIconKey, when: 'Hoy', text: 'Las manzanas están baratas: compras 10 kilos', tone: 'sky' as HudToneKey },
    { icon: 'calendar' as HudIconKey, when: 'La semana siguiente', text: 'Las manzanas escasean', tone: 'violet' as HudToneKey },
    { icon: 'trendUp' as HudIconKey, when: 'Las vendes', text: 'A un precio más alto', tone: 'emerald' as HudToneKey },
  ],
}

/* Introducción: Tipos de operación */
export const OPERATIONS = {
  buy: { name: 'BUY (Largo)', chip: 'Esperar una subida', text: 'Compras esperando que suba' },
  sell: { name: 'SELL (Corto)', chip: 'Esperar una bajada', text: 'Vendes prestado esperando que baje' },
  note: 'Vender en corto no es lo mismo que vender un activo que ya se posee.',
}

/* Conceptos básicos */
export interface HudRowItem {
  id: string
  name: string
  text: string
  icon: HudIconKey
  tone: HudToneKey
  tag?: string
}

export const CONCEPTS: HudRowItem[] = [
  { id: 'trader', name: 'Trader', text: 'La persona que compra y vende', icon: 'user', tone: 'sky' },
  { id: 'broker', name: 'Broker', text: 'El intermediario (plataforma)', icon: 'broker', tone: 'violet' },
  { id: 'cetes', name: 'CETES', text: 'Bonos del gobierno, muy seguros', icon: 'bank', tone: 'emerald' },
  { id: 'acciones', name: 'Acciones', text: 'Pedacitos de una empresa', icon: 'bars', tone: 'amber' },
  { id: 'indices', name: 'Índices', text: 'Grupos de acciones (NASDAQ, S&P 500, Dow Jones)', icon: 'layers', tone: 'rose' },
  { id: 'commodities', name: 'Commodities', text: 'Cosas reales: maíz, petróleo, oro', icon: 'drop', tone: 'teal' },
  { id: 'forex', name: 'Forex', text: 'Cambio de monedas', icon: 'swap', tone: 'sky' },
  { id: 'derivados', name: 'Derivados', text: 'Contratos sobre precios futuros', icon: 'doc', tone: 'violet' },
]

/* Mercados donde se opera */
export const MARKETS: HudRowItem[] = [
  { id: 'm-acciones', name: 'Acciones', text: 'Compras parte de una empresa', icon: 'bars', tone: 'sky', tag: 'Apple, Tesla' },
  { id: 'm-bonos', name: 'Bonos', text: 'Prestas dinero a gobierno o empresa', icon: 'note', tone: 'amber', tag: 'CETES' },
  { id: 'm-etfs', name: 'ETFs', text: 'Canasta de activos', icon: 'basket', tone: 'teal', tag: 'SPY (replica S&P 500)' },
  { id: 'm-cripto', name: 'Criptoactivos', text: 'Monedas digitales', icon: 'bitcoin', tone: 'amber', tag: 'Bitcoin, Ethereum' },
  { id: 'm-forex', name: 'Forex', text: 'Cambio de divisas', icon: 'swap', tone: 'violet', tag: 'Peso/Dólar' },
  { id: 'm-otc', name: 'Derivados OTC', text: 'Contratos personalizados', icon: 'doc', tone: 'rose', tag: 'Swaps, forwards' },
]

/* Análisis: Tipos de trader */
export const TRADERS = [
  { icon: 'bolt' as HudIconKey, name: 'Scalper', text: 'Compra y vende en segundos', pitch: 'compra y vende en segundos.', tone: 'rose' as HudToneKey },
  { icon: 'sun' as HudIconKey, name: 'Day Trader', text: 'Cierra el mismo día', pitch: 'cierra sus operaciones el mismo día.', tone: 'amber' as HudToneKey },
  { icon: 'wave' as HudIconKey, name: 'Swing Trader', text: 'Días o semanas', pitch: 'mantiene sus operaciones durante días o semanas.', tone: 'emerald' as HudToneKey },
  { icon: 'mountain' as HudIconKey, name: 'Position Trader', text: 'Meses', pitch: 'mantiene sus operaciones durante meses.', tone: 'sky' as HudToneKey },
]
