/* ------------------------------------------------------------------ */
/* Contenido del módulo Blockchain y criptomonedas (tarjetas 4.1–4.9)  */
/* ------------------------------------------------------------------ */

import type { BcIconKey } from './BlockchainIcons'
import type { BlockchainToneKey } from './BlockchainCard'

/* 4.1 ¿Qué es Blockchain? */
export const WHAT_IS = {
  analogy: 'Es un cuaderno de apuntes que está copiado en miles de computadoras.',
  detail:
    'Cada vez que alguien anota algo (una transacción), todas las copias se actualizan. Si alguien intenta borrar o cambiar una página, las otras copias lo detectan.',
  usesTitle: '¿Para qué sirve?',
  uses: ['Enviar dinero sin bancos', 'Registrar propiedades sin notarios', 'Rastrear el origen de productos'],
}

/* 4.2 Conceptos básicos */
export interface Concept {
  id: string
  name: string
  meaning: string
  icon: BcIconKey
  tone: BlockchainToneKey
}

export const CONCEPTS: Concept[] = [
  { id: 'red', name: 'Red', meaning: 'Conjunto de participantes', icon: 'network', tone: 'violet' },
  { id: 'nodo', name: 'Nodo', meaning: 'Computadora que guarda copia del cuaderno', icon: 'node', tone: 'emerald' },
  { id: 'minero', name: 'Minero', meaning: 'Nodo que compite por escribir el siguiente bloque', icon: 'miner', tone: 'sky' },
  { id: 'consenso', name: 'Consenso', meaning: 'Reglas para ponerse de acuerdo', icon: 'consensus', tone: 'amber' },
  { id: 'contrato', name: 'Contrato inteligente', meaning: 'Programa que se ejecuta solo', icon: 'contract', tone: 'teal' },
  { id: 'criptoactivo', name: 'Criptoactivo', meaning: 'Activo digital', icon: 'asset', tone: 'violet' },
  { id: 'hash', name: 'Hash', meaning: 'Huella digital única de datos', icon: 'hash', tone: 'rose' },
]

/* 4.3 ¿Cómo se protege la información? */
export const PROTECTION = {
  hash: {
    title: 'Hash',
    text: 'Es como una huella digital. Si cambias una letra de un texto, la huella cambia completamente. Por eso es imposible alterar datos sin que se note.',
  },
  signature: {
    title: 'Firma digital',
    text: 'Cada transacción está firmada con la clave privada del dueño. Si alguien la modifica, la firma deja de ser válida.',
  },
}

/* 4.4 Criptomonedas y tokens */
export const CRYPTO_TOKENS = {
  crypto: { name: 'Criptomoneda', text: 'Reserva de valor (Bitcoin, Ethereum).', active: 20000 },
  token: { name: 'Token', text: 'Activo digital con función específica. Vive sobre otra blockchain.' },
  featuresTitle: 'Características',
  features: ['Emisión limitada', 'Descentralizadas', 'Sin intermediarios', 'No se pueden confiscar'],
}

/* 4.5 Carteras */
export interface Wallet {
  id: string
  name: string
  what: string
  extraLabel: string
  extra: string
  icon: BcIconKey
  tone: BlockchainToneKey
}

export const WALLETS: Wallet[] = [
  { id: 'hot', name: 'Caliente', what: 'App o plataforma', extraLabel: 'Riesgo', extra: 'Susceptible a ataques', icon: 'phone', tone: 'violet' },
  { id: 'cold', name: 'Fría', what: 'USB físico', extraLabel: 'Riesgo', extra: 'Requiere 12 palabras clave', icon: 'usb', tone: 'sky' },
  { id: 'exchange', name: 'Exchange', what: 'Plataforma completa', extraLabel: 'Incluye', extra: 'Trading y lending', icon: 'bank', tone: 'amber' },
]

export const PLATFORMS: Array<{ name: string; tone: BlockchainToneKey }> = [
  { name: 'Binance', tone: 'amber' },
  { name: 'Coinbase', tone: 'sky' },
  { name: 'Metamask', tone: 'rose' },
  { name: 'Bitso', tone: 'emerald' },
  { name: 'Kraken', tone: 'violet' },
]

/* 4.6 Las 5 capas de Blockchain */
export interface Layer {
  id: string
  name: string
  does: string
  analogy: string
  tone: BlockchainToneKey
}

export const LAYERS: Layer[] = [
  { id: 'datos', name: 'Datos', does: 'Guarda bloques y transacciones', analogy: 'El papel del cuaderno', tone: 'emerald' },
  { id: 'red', name: 'Red', does: 'Comunica nodos', analogy: 'Los mensajeros', tone: 'sky' },
  { id: 'consenso', name: 'Consenso', does: 'Valida bloques', analogy: 'La votación', tone: 'amber' },
  { id: 'incentivos', name: 'Incentivos', does: 'Recompensas', analogy: 'El premio', tone: 'rose' },
  { id: 'aplicacion', name: 'Aplicación', does: 'dApps y contratos', analogy: 'Las apps', tone: 'violet' },
]

/* 4.7 Estándares de redes */
export interface NetworkStandard {
  id: string
  label: string
  chain: string
  note: string
  glyph: string
  tone: BlockchainToneKey
}

export const STANDARDS: NetworkStandard[] = [
  { id: 'erc20', label: 'ERC-20', chain: 'Ethereum', note: 'Seguro, comisiones caras.', glyph: 'Ξ', tone: 'violet' },
  { id: 'trc20', label: 'TRC-20', chain: 'TRON', note: 'Rápido, usado para USDT.', glyph: 'T', tone: 'rose' },
  { id: 'bep20', label: 'BEP-20', chain: 'BNB Chain', note: 'Comisiones bajas.', glyph: 'B', tone: 'amber' },
  { id: 'btc', label: 'BTC', chain: 'Bitcoin', note: 'La red original.', glyph: '₿', tone: 'sky' },
]

export const STANDARDS_EXAMPLE = {
  title: 'Ejemplo',
  text: 'Puedes enviar USDT por ERC-20, TRC-20 o BEP-20. Es el mismo dólar digital, pero en diferentes "carreteras".',
}

/* 4.8 Pruebas de consenso */
export const CONSENSUS = [
  { id: 'pow', name: 'PoW', full: 'Prueba de Trabajo', how: 'Mineros compiten resolviendo problemas', example: 'Bitcoin', tone: 'amber' as BlockchainToneKey },
  { id: 'pos', name: 'PoS', full: 'Prueba de Participación', how: 'Validadores apuestan sus monedas', example: 'Ethereum', tone: 'violet' as BlockchainToneKey },
  { id: 'dpos', name: 'DPoS', full: 'Prueba de Participación Delegada', how: 'Votación de validadores', example: 'TRON', tone: 'rose' as BlockchainToneKey },
  { id: 'poa', name: 'PoA', full: 'Prueba de Autoridad', how: 'Nodos autorizados', example: 'VeChain', tone: 'sky' as BlockchainToneKey },
  { id: 'poh', name: 'PoH', full: 'Prueba de Historia', how: 'Secuencia de tiempo verificable', example: 'Solana', tone: 'emerald' as BlockchainToneKey },
]

/* 4.9 Bitcoin: el oro digital */
export const BITCOIN = {
  facts: [
    { label: 'Máximo', value: '21 millones' },
    { label: 'En circulación', value: '~19.9 millones' },
    { label: 'Se pierden', value: '2-3 millones irrecuperables' },
    { label: 'Satoshi Nakamoto (creador)', value: '~1.1 millones' },
    { label: 'Bloque cada', value: '10 minutos' },
    { label: 'Recompensa actual', value: '3.125 BTC' },
    { label: 'Último Bitcoin', value: '~2140' },
  ],
  maxMillions: 21,
  circulatingMillions: 19.9,
  whyTitle: '¿Por qué vale tanto?',
  why: 'Porque atacar la red es carísimo. Para modificarla, necesitarías controlar más del 50% del poder de cómputo mundial.',
}
