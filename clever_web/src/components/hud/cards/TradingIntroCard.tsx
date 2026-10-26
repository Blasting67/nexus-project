import React, { useEffect, useState } from 'react'
import { TRADING_INTRO } from '../HudData'
import { HudCard } from '../HudCard'
import { HUD_ICONS } from '../HudIcons'
import { useSlideState } from '../HudSlide'

const reduced = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const TradingIntroCard: React.FC = () => {
  const visible = useSlideState() === 'active'
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const Bulb = HUD_ICONS.bulb

  useEffect(() => {
    if (visible) setCurrent(0)
  }, [visible])

  useEffect(() => {
    if (!visible || paused || reduced()) return
    const id = window.setInterval(() => setCurrent((c) => (c + 1) % TRADING_INTRO.steps.length), 2600)
    return () => window.clearInterval(id)
  }, [visible, paused])

  return (
    <HudCard title="¿Qué es hacer Trading?" icon="book" accent={['sky', 'violet']}>
      <p className="hc-lead">
        <span className="hc-tag hc-tone-violet">
          <Bulb className="hc-svg" />
          Analogía
        </span>
        {TRADING_INTRO.analogy}
      </p>

      <ol className="hc-steps" onMouseLeave={() => setPaused(false)}>
        {TRADING_INTRO.steps.map((step, i) => {
          const Icon = HUD_ICONS[step.icon]
          return (
            <li
              key={step.when}
              data-on={current === i ? '' : undefined}
              data-passed={i < current ? '' : undefined}
              aria-current={current === i ? 'step' : undefined}
              onMouseEnter={() => {
                setPaused(true)
                setCurrent(i)
              }}
              className={`hc-step hc-tone-${step.tone}`}
            >
              <span aria-hidden="true" className="hc-icon">
                <Icon className="hc-svg" />
              </span>
              <div className="min-w-0">
                <p className="hc-step-when">{step.when}</p>
                <p className="hc-step-text">{step.text}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </HudCard>
  )
}
