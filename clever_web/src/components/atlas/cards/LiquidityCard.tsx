import React from 'react'
import { SceneCard } from '../SceneCard'
import { AquariumScene } from '../scenes/AquariumScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, liquidityLabel } from '../atlasData'

/** Liquidez → acuario (poca: agua baja e inestable · mucha: profunda, estable y con peces) */
export const LiquidityCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Liquidez"
      tip="Qué tan fácil es comprar o vender sin mover mucho el precio. Aguas profundas y calmas indican alta liquidez."
      value={Math.round(v)}
      suffix="/100"
      label={liquidityLabel(v)}
      labelColor={goodColor(v)}
    >
      <AquariumScene value={v} />
    </SceneCard>
  )
}
