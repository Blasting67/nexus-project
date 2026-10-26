import React, { useId } from 'react'
import { OPERATIONS } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS } from '../HudIcons'
import { useSlideState } from '../HudSlide'

const UP_POINTS: Array<[number, number]> = [[4, 58], [24, 50], [40, 54], [62, 38], [80, 42], [104, 24], [122, 28], [156, 8]]
const DOWN_POINTS: Array<[number, number]> = [[4, 12], [24, 18], [44, 16], [66, 34], [86, 30], [110, 50], [128, 46], [156, 62]]

const toPoints = (pts: Array<[number, number]>) => pts.map(([x, y]) => `${x},${y}`).join(' ')

const Trend: React.FC<{ points: Array<[number, number]>; active: boolean }> = ({ points, active }) => {
  const id = useId()
  const last = points[points.length - 1]
  return (
    <svg
      viewBox="0 0 160 70"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="motion-reduce:!transition-none"
      style={{
        clipPath: active ? 'inset(-6px -6px -6px -6px)' : 'inset(-6px 100% -6px -6px)',
        transition: active ? 'clip-path 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s' : 'none',
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${toPoints(points)} 156,70 4,70`} fill={`url(#${id})`} />
      <polyline
        points={toPoints(points)}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="3.2" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

interface PanelProps {
  up: boolean
  name: string
  chip: string
  text: string
  active: boolean
}

const Panel: React.FC<PanelProps> = ({ up, name, chip, text, active }) => {
  const Arrow = up ? HUD_ICONS.arrowUpRight : HUD_ICONS.arrowDownRight
  return (
    <article className={`hc-op ${up ? 'hc-tone-emerald' : 'hc-tone-rose'}`}>
      <div className="hc-op-grid">
        <div className="hc-op-copy">
          <div className="hc-op-head">
            <span aria-hidden="true" className="hc-icon">
              <Arrow className="hc-svg" />
            </span>
            <h3 className="hc-op-name">{name}</h3>
          </div>
          <span className="hc-tag">{chip}</span>
          <p className="hc-op-text">{text}</p>
        </div>
        <div className="hc-op-chart">
          <Trend points={up ? UP_POINTS : DOWN_POINTS} active={active} />
        </div>
      </div>
    </article>
  )
}

export const OperationTypesCard: React.FC = () => {
  const active = useSlideState() === 'active'
  const Info = HUD_ICONS.info

  return (
    <HudCard title="Tipos de operación" icon="swap" accent={['emerald', 'rose']}>
      <div className="hc-ops">
        <Panel up name={OPERATIONS.buy.name} chip={OPERATIONS.buy.chip} text={OPERATIONS.buy.text} active={active} />
        <Panel up={false} name={OPERATIONS.sell.name} chip={OPERATIONS.sell.chip} text={OPERATIONS.sell.text} active={active} />
      </div>
      <p className="hc-note">
        <Info className="hc-svg" />
        {OPERATIONS.note}
      </p>
    </HudCard>
  )
}
