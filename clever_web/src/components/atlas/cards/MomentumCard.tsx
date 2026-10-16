import React from 'react'
import { SceneCard } from '../SceneCard'
import { RocketScene } from '../scenes/RocketScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, momentumLabel } from '../atlasData'

/** Momentum → cohete (casi detenido … ascendiendo rápido) */
export const MomentumCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Momentum"
      tip="Mide la fuerza con la que se mueve el precio. Un cohete acelerando indica un impulso fuerte."
      tipMore={{ title: 'Indicadores que puedes usar', chips: ['RSI', 'MACD', 'KDJ'] }}
      value={Math.round(v)}
      suffix="/100"
      label={momentumLabel(v)}
      labelColor={goodColor(v)}
    >
      <RocketScene value={v} />
    </SceneCard>
  )
}
