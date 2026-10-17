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
        id: 'inverted-hammer',
        name: 'Martillo inverso',
        meaning: 'Cuerpo pequeño abajo y mecha superior larga: los compradores intentaron subir el precio',
        description:
          'Tras tres velas rojas descendentes, una vela de cuerpo pequeño abajo y una mecha superior larga',
        candles: [
          { o: 80, h: 82, l: 70, c: 72, context: true },
          { o: 72, h: 74, l: 62, c: 64, context: true },
          { o: 64, h: 66, l: 54, c: 56, context: true },
          { o: 51, h: 76, l: 49, c: 55 },
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
        id: 'piercing',
        name: 'Penetrante',
        meaning: 'Dos velas: una vela roja larga, seguida por una vela verde de tamaño similar',
        description:
          'Una vela roja larga seguida de una vela verde de tamaño parecido que abre más abajo y cierra pasada la mitad de la roja',
        candles: [
          { o: 88, h: 90, l: 78, c: 80, context: true },
          { o: 80, h: 82, l: 70, c: 72, context: true },
          { o: 72, h: 73, l: 52, c: 54 },
          { o: 49, h: 67, l: 48, c: 65 },
        ],
      },
      {
        id: 'morning-star',
        name: 'Estrella de la mañana',
        meaning: 'Tres velas: roja grande, una vela roja de cuerpo pequeño (la «estrella») y verde grande',
        description:
          'Una vela roja grande, una vela roja de cuerpo pequeño que es la estrella y finalmente una vela verde grande',
        candles: [
          { o: 90, h: 92, l: 80, c: 82, context: true },
          { o: 82, h: 84, l: 72, c: 74, context: true },
          { o: 74, h: 75, l: 54, c: 56 },
          { o: 51, h: 53, l: 46, c: 48 },
          { o: 50, h: 70, l: 49, c: 68 },
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
        id: 'hanging-man',
        name: 'Hombre colgado',
        meaning: 'Vela roja en forma de martillo: la contraparte bajista del martillo, al final de una tendencia alcista',
        description:
          'Tras tres velas verdes ascendentes, una vela roja con forma de martillo: cuerpo pequeño arriba y mecha inferior larga',
        candles: [
          { o: 30, h: 40, l: 28, c: 38, context: true },
          { o: 38, h: 48, l: 36, c: 46, context: true },
          { o: 46, h: 56, l: 44, c: 54, context: true },
          { o: 60, h: 62, l: 38, c: 58 },
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
        id: 'dark-cloud-cover',
        name: 'Cubierta de nube oscura',
        meaning: 'Dos velas: la segunda es roja, abre por encima del cuerpo verde anterior y cierra bajo su punto medio',
        description:
          'Una vela verde larga seguida de una vela roja que abre por encima del cuerpo verde y cierra por debajo de su punto medio',
        candles: [
          { o: 26, h: 36, l: 24, c: 34, context: true },
          { o: 34, h: 44, l: 32, c: 42, context: true },
          { o: 42, h: 62, l: 41, c: 60 },
          { o: 65, h: 66, l: 45, c: 47 },
        ],
      },
      {
        id: 'evening-star',
        name: 'Estrella del atardecer',
        meaning: 'Tres velas: verde amplia, verde pequeña y roja amplia',
        description: 'Una vela verde amplia, una vela verde pequeña en lo alto y una vela roja amplia que cierra bajo la mitad de la primera',
        candles: [
          { o: 28, h: 38, l: 26, c: 36, context: true },
          { o: 36, h: 46, l: 34, c: 44, context: true },
          { o: 44, h: 66, l: 43, c: 64 },
          { o: 67, h: 71, l: 66, c: 70 },
          { o: 68, h: 69, l: 48, c: 50 },
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
      {
        id: 'falling-three-methods',
        name: 'Triple formación bajista',
        meaning: 'Una vela roja larga, seguida por tres velas verdes pequeñas y finalmente otra vela roja',
        description:
          'Una vela roja larga, tres velas verdes pequeñas dentro de su rango y otra vela roja larga que cierra más abajo',
        candles: [
          { o: 96, h: 98, l: 88, c: 90, context: true },
          { o: 88, h: 89, l: 62, c: 64 },
          { o: 66, h: 72, l: 65, c: 70 },
          { o: 69, h: 75, l: 68, c: 73 },
          { o: 72, h: 78, l: 71, c: 76 },
          { o: 75, h: 76, l: 50, c: 52 },
        ],
      },
      {
        id: 'rising-three-methods',
        name: 'Triple formación alcista',
        meaning: 'Tres velas rojas pequeñas situadas entre dos velas verdes grandes',
        description:
          'Una vela verde grande, tres velas rojas pequeñas dentro de su rango y otra vela verde grande que cierra más arriba',
        candles: [
          { o: 30, h: 34, l: 24, c: 26, context: true },
          { o: 28, h: 55, l: 27, c: 53 },
          { o: 51, h: 52, l: 44, c: 46 },
          { o: 48, h: 49, l: 41, c: 43 },
          { o: 45, h: 46, l: 38, c: 40 },
          { o: 42, h: 68, l: 41, c: 66 },
        ],
      },
    ],
  },
]