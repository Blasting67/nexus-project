import React from 'react'
import { SceneCard } from '../SceneCard'
import { MountainScene } from '../scenes/MountainScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { riskColor, uncertaintyLabel } from '../atlasData'

/** Incertidumbre → niebla sobre montañas (sin tapar nunca la interfaz) */
export const UncertaintyCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Incertidumbre"
      tip="Qué tan predecible se ve el panorama. Más niebla significa que es más difícil anticipar lo que viene."
      value={Math.round(v)}
      suffix="/100"
      label={uncertaintyLabel(v)}
      labelColor={riskColor(v)}
      extra={
        <div className="mt-1 flex items-center gap-1.5 text-[9.5px] text-[var(--text-muted)]" aria-hidden="true">
          <span>Baja</span>
          <div className="relative h-1 flex-1 rounded-full bg-gradient-to-r from-emerald-300/80 via-amber-300/80 to-rose-300/80">
            <span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--surface)] bg-[var(--text)]"
              style={{ left: `${v}%` }}
            />
          </div>
          <span>Alta</span>
        </div>
      }
    >
      <MountainScene value={v} />
    </SceneCard>
  )
}
