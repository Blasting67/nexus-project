/* ------------------------------------------------------------------ */
/* Datos de los patrones de velas                                      */
/* Valores en una escala relativa (mayor = precio más alto). Cada      */
/* patrón lleva velas de contexto (la tendencia previa, atenuadas)     */
/* seguidas de las velas que forman el patrón.                         */
/* ------------------------------------------------------------------ */

export interface PatternCandle {
  o: number // apertura
  h: number // máximo
  l: number // mínimo
  c: number // cierre
  context?: boolean // vela previa que solo da contexto
  neutral?: boolean // color neutro (indecisión)
}

export type PatternCategory = 'bullish' | 'bearish' | 'indecision'

export interface CandlePattern {
  id: string
  name: string
  meaning: string
  description: string // para lectores de pantalla
  candles: PatternCandle[]
}

export interface PatternGroup {
  category: PatternCategory
  title: string
  patterns: CandlePattern[]
}

export const PATTERN_GROUPS: PatternGroup[] = [
  {
    category: 'bullish',
    title: 'Patrones que anuncian subida',
    patterns: [
      {
        id: 'hammer',
        name: 'Martillo',
        meaning: 'Los vendedores empujaron, pero los compradores ganaron',
        description:
          'Tras tres velas rojas descendentes, una vela verde de cuerpo pequeño arriba y una mecha inferior larga',
        candles: [
          { o: 78, h: 80, l: 68, c: 70, context: true },
          { o: 70, h: 72, l: 60, c: 62, context: true },
          { o: 62, h: 64, l: 53, c: 55, context: true },
          { o: 52, h: 58, l: 30, c: 57 },
        ],
      },
      {
        id: 'bullish-engulfing',
        name: 'Envolvente alcista',
        meaning: 'Una vela verde grande se come a la roja anterior',
        description:
          'Una vela roja pequeña seguida de una vela verde grande cuyo cuerpo cubre por completo al de la roja',
        candles: [
          { o: 74, h: 76, l: 64, c: 66, context: true },
          { o: 66, h: 68, l: 58, c: 60, context: true },
          { o: 60, h: 61, l: 52, c: 54 },
          { o: 51, h: 68, l: 49, c: 66 },
        ],
      },
      {
        id: 'three-white-soldiers',
        name: 'Tres soldados blancos',
        meaning: 'Tres velas verdes seguidas',
        description: 'Tres velas verdes consecutivas, cada una abre dentro de la anterior y cierra más alto',
        candles: [
          { o: 66, h: 68, l: 56, c: 58, context: true },
          { o: 58, h: 60, l: 50, c: 52, context: true },
          { o: 52, h: 63, l: 51, c: 62 },
          { o: 57, h: 72, l: 56, c: 71 },
          { o: 66, h: 81, l: 65, c: 80 },
        ],
      },
    ],
  },
  {
    category: 'bearish',
    title: 'Patrones que anuncian bajada',
    patterns: [
      {
        id: 'shooting-star',
        name: 'Estrella fugaz',
        meaning: 'Los compradores intentaron, pero los vendedores ganaron',
        description:
          'Tras tres velas verdes ascendentes, una vela roja de cuerpo pequeño abajo y una mecha superior larga',
        candles: [
          { o: 30, h: 40, l: 28, c: 38, context: true },
          { o: 38, h: 48, l: 36, c: 46, context: true },
          { o: 46, h: 56, l: 44, c: 54, context: true },
          { o: 58, h: 80, l: 52, c: 53 },
        ],
      },
      {
        id: 'bearish-engulfing',
        name: 'Envolvente bajista',
        meaning: 'Una vela roja grande se come a la verde anterior',
        description:
          'Una vela verde pequeña seguida de una vela roja grande cuyo cuerpo cubre por completo al de la verde',
        candles: [
          { o: 28, h: 38, l: 26, c: 36, context: true },
          { o: 36, h: 46, l: 34, c: 44, context: true },
          { o: 44, h: 52, l: 43, c: 50 },
          { o: 53, h: 55, l: 36, c: 38 },
        ],
      },
      {
        id: 'three-black-crows',
        name: 'Tres cuervos negros',
        meaning: 'Tres velas rojas seguidas',
        description: 'Tres velas rojas consecutivas, cada una abre dentro de la anterior y cierra más bajo',
        candles: [
          { o: 32, h: 43, l: 30, c: 41, context: true },
          { o: 41, h: 56, l: 40, c: 54, context: true },
          { o: 53, h: 54, l: 42, c: 43 },
          { o: 48, h: 49, l: 35, c: 36 },
          { o: 41, h: 42, l: 28, c: 29 },
        ],
      },
    ],
  },
  {
    category: 'indecision',
    title: 'Patrones de indecisión',
    patterns: [
      {
        id: 'doji',
        name: 'Doji',
        meaning: 'Apertura y cierre casi iguales. Empate.',
        description: 'Una vela con cuerpo casi inexistente y mechas largas a ambos lados',
        candles: [
          { o: 38, h: 48, l: 36, c: 46, context: true },
          { o: 46, h: 56, l: 44, c: 54, context: true },
          { o: 55, h: 72, l: 40, c: 56, neutral: true },
        ],
      },
      {
        id: 'spinning-tops',
        name: 'Trompos',
        meaning: 'Cuerpo pequeño con mechas. Pausa.',
        description: 'Dos velas de cuerpo pequeño con mechas largas arriba y abajo',
        candles: [
          { o: 38, h: 48, l: 36, c: 46, context: true },
          { o: 46, h: 56, l: 44, c: 54, context: true },
          { o: 53, h: 68, l: 40, c: 57, neutral: true },
          { o: 57, h: 67, l: 42, c: 54, neutral: true },
        ],
      },
    ],
  },
]
