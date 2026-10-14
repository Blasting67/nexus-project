/* ------------------------------------------------------------------ */
/* Datos de la parte 5: errores comunes del trader                     */
/* ------------------------------------------------------------------ */

export type MistakeIconKey = 'signals' | 'hop' | 'layers' | 'copy' | 'coins' | 'mind' | 'shield' | 'briefcase'
export type MistakeCategory = 'analysis' | 'capital' | 'psychology'

export interface Mistake {
  id: string
  title: string
  text: string
  icon: MistakeIconKey
}

export interface MistakeGroup {
  category: MistakeCategory
  title: string
  mistakes: Mistake[]
}

export const MISTAKE_GROUPS: MistakeGroup[] = [
  {
    category: 'analysis',
    title: 'Análisis y estrategia',
    mistakes: [
      {
        id: 'no-signals',
        title: 'No analizar señales',
        text: 'Entrar al mercado por intuición, sin comprobar antes que una señal respalde la operación.',
        icon: 'signals',
      },
      {
        id: 'too-many-indicators',
        title: 'Usar demasiados indicadores',
        text: 'Demasiados indicadores generan señales contradictorias y confunden más de lo que ayudan.',
        icon: 'layers',
      },
      {
        id: 'copy-strategies',
        title: 'Copiar estrategias ajenas',
        text: 'Lo que funciona para otro trader puede no encajar con tu capital, tu tiempo ni tu tolerancia al riesgo.',
        icon: 'copy',
      },
    ],
  },
  {
    category: 'capital',
    title: 'Capital y gestión del riesgo',
    mistakes: [
      {
        id: 'low-capital',
        title: 'Tener poco capital',
        text: 'Con muy poco dinero, una sola pérdida pesa demasiado y se tiende a arriesgar de más.',
        icon: 'coins',
      },
      {
        id: 'believing-safe',
        title: 'Creer que es seguro',
        text: 'En el trading siempre hay riesgo: ninguna operación está garantizada.',
        icon: 'shield',
      },
      {
        id: 'main-income',
        title: 'Depender del trading como ingreso principal',
        text: 'La presión de cubrir gastos con las ganancias empuja a decidir con miedo y a asumir más riesgo.',
        icon: 'briefcase',
      },
    ],
  },
  {
    category: 'psychology',
    title: 'Psicología y disciplina',
    mistakes: [
      {
        id: 'market-hopping',
        title: 'Brincar de mercado en mercado',
        text: 'Cambiar de activo todo el tiempo impide dominar alguno y entender cómo se comporta.',
        icon: 'hop',
      },
      {
        id: 'psychology-over-technical',
        title: 'Enfocarse en lo psicológico, no en lo técnico',
        text: 'La mentalidad ayuda, pero no sustituye dominar el análisis técnico y tener una estrategia probada.',
        icon: 'mind',
      },
    ],
  },
]
