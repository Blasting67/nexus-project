import React from 'react'
import { SceneCard } from '../SceneCard'
import { WeatherScene } from '../scenes/WeatherScene'
import { useSmoothNumber } from '../useSmoothNumber'
import { goodColor, sentimentLabel } from '../atlasData'

/** Sentimiento → clima (0 tormenta … 100 muy optimista) */
export const SentimentCard: React.FC<{ value: number }> = ({ value }) => {
  const v = useSmoothNumber(value)

  return (
    <SceneCard
      title="Sentimiento"
      tip="Resume el ánimo general de quienes operan. Con sol, la mayoría se siente optimista; con tormenta, predomina el miedo."
      tipMore={{
        note: 'Puedes guiarte con el tipo de mercado actual (bull market o bear market) y con las noticias del momento.',
      }}
      value={Math.round(v)}
      suffix="/100"
      label={sentimentLabel(v)}
      labelColor={goodColor(v)}
    >
      <WeatherScene value={v} />
    </SceneCard>
  )
}
