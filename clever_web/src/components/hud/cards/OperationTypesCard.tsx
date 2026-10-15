import React from 'react'
import { OPERATIONS } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS } from '../HudIcons'
import { useSlideState } from '../HudSlide'

const UP_POINTS: Array<[number, number]> = [[4, 58], [24, 50], [40, 54], [62, 38], [80, 42], [104, 24], [122, 28], [156, 8]]
const DOWN_POINTS: Array<[number, number]> = [[4, 12], [24, 18], [44, 16], [66, 34], [86, 30], [110, 50], [128, 46], [156, 62]]

const toPoints = (pts: Array<[number, number]>) => pts.map(([x, y]) => `${x},${y}`).join(' ')

/** Gráfica de área que se "dibuja" de izquierda a derecha cuando la sección aparece. */
const Trend: React.FC<{ points: Array<[number, number]>; up: boolean; active: boolean }> = ({ points, up, active }) => {
  const color = up ? '#34d399' : '#fb7185'
  const id = up ? 'hud-buy' : 'hud-sell'
  const last = points[points.length - 1]
  return (
    <svg
      viewBox="0 0 160 70"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="h-full min-h-[3.5rem] w-full overflow-visible"
      style={{
        clipPath: active ? 'inset(-6px -6px -6px -6px)' : 'inset(-6px 100% -6px -6px)',
        transition: active ? 'clip-path 1.3s ease-out 0.7s' : 'none',
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`${toPoints(points)} 156,70 4,70`} fill={`url(#${id})`} />
      <polyline
        points={toPoints(points)}
        fill="none"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={last[0]} cy={last[1]} r="3.4" fill="#fff" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
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
    <article
      className={`group grid min-h-0 flex-1 grid-cols-2 items-center gap-3 rounded-3xl p-[clamp(0.75rem,1.8vh,1.25rem)] ring-1 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${
        up
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50/60 ring-emerald-100 hover:shadow-emerald-200/50'
          : 'bg-gradient-to-br from-rose-50 to-pink-50/60 ring-rose-100 hover:shadow-rose-200/50'
      }`}
    >
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2.5">
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-300 group-hover:scale-110 motion-reduce:transition-none ${
              up ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
            }`}
          >
            <Arrow className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <h3 className={`text-[clamp(0.85rem,1.9vh,1rem)] font-bold leading-tight ${up ? 'text-emerald-800' : 'text-rose-800'}`}>{name}</h3>
        </div>
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            up ? 'bg-emerald-100/80 text-emerald-700' : 'bg-rose-100/80 text-rose-700'
          }`}
        >
          {chip}
        </span>
        <p className="mt-2 text-[clamp(0.75rem,1.7vh,0.9rem)] leading-snug text-slate-600">{text}</p>
      </div>
      <div className="h-full min-h-[4rem]">
        <Trend points={up ? UP_POINTS : DOWN_POINTS} up={up} active={active} />
      </div>
    </article>
  )
}

/** Introducción: Tipos de operación (BUY y SELL), con su gráfica y la aclaración sobre vender en corto. */
export const OperationTypesCard: React.FC = () => {
  const active = useSlideState() === 'active'
  const Info = HUD_ICONS.info

  return (
    <HudCard title="Tipos de operación" icon="swap">
      <div className="grid min-h-0 flex-1 gap-3 md:grid-cols-2">
        <Panel up name={OPERATIONS.buy.name} chip={OPERATIONS.buy.chip} text={OPERATIONS.buy.text} active={active} />
        <Panel up={false} name={OPERATIONS.sell.name} chip={OPERATIONS.sell.chip} text={OPERATIONS.sell.text} active={active} />
      </div>
      <p className="mt-3 flex items-start gap-2 rounded-2xl bg-violet-50/70 px-4 py-2.5 text-xs leading-snug text-slate-600 ring-1 ring-violet-100">
        <Info className="mt-px h-4 w-4 shrink-0 text-violet-400" />
        {OPERATIONS.note}
      </p>
    </HudCard>
  )
}