/** Id de la sección "Análisis" en el HUD de /analisis. */
export const ANALYSIS_SECTION_ID = 'analysis'

/** Aviso de navegación para abrir /analisis directamente en la sección "Análisis". */
export const OPEN_ANALYSIS_SECTION = { section: ANALYSIS_SECTION_ID } as const

/** Índice de la sección que pidió la navegación (0 si no pidió ninguna o no existe). */
export function requestedSectionIndex(state: unknown, ids: string[]): number {
  const wanted = (state as { section?: unknown } | null)?.section
  const i = typeof wanted === 'string' ? ids.indexOf(wanted) : -1
  return i === -1 ? 0 : i
}
