import React, { useEffect, useState } from 'react'
import { SceneCard } from '../SceneCard'
import { GoldTankScene } from '../scenes/GoldTankScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { MAX_SUPPLY, clamp } from '../atlasData'

/** Suministro → contenedor de oro que se llena (emitido / máximo de 21 millones) */
export const SupplyCard: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  // al aparecer, el contenedor parte vacío y se llena hasta su nivel
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const s = useSmoothNumber(ready ? value : 0, 0.05)
  const pct = clamp(s / MAX_SUPPLY)

  return (
    <SceneCard
      title="Suministro"
      tip="Cuántos bitcoins existen ya respecto al máximo que jamás podrá existir: 21 millones."
      value={<span className="text-[21px]">{s.toFixed(1)}M</span>}
      suffix={`/${MAX_SUPPLY}M`}
      label={`${(pct * 100).toFixed(1)}% emitido`}
      labelColor="#d97706"
      className={className}
    >
      <GoldTankScene value={s} />
    </SceneCard>
  )
}