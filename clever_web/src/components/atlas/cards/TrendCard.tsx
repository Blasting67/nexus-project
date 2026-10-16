import React from 'react'
import { SceneCard } from '../SceneCard'
import { CompassScene } from '../scenes/CompassScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, trendLabel } from '../atlasData'

/** Tendencia → brújula (la aguja sube con el mercado alcista y baja con el bajista) */
export const TrendCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Tendencia"
      tip="Muestra hacia dónde apunta el mercado: hacia abajo (bajista), estable (neutral) o hacia arriba (alcista)."
      tipMore={{ title: 'Indicadores que puedes usar', chips: ['Medias móviles (SMA y EMA)', 'Nube de Ichimoku'] }}
      value={Math.round(v)}
      suffix="/100"
      label={trendLabel(v)}
      labelColor={goodColor(v)}
    >
      <CompassScene value={v} />
    </SceneCard>
  )
}
