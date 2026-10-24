import React, { useState } from 'react'
import type { HudRowItem } from './HudData'
import { HUD_ICONS, HUD_TONES } from './HudIcons'
import { useSlideState } from './HudSlide'

export const HudRows: React.FC<{ items: HudRowItem[]; label: string }> = ({ items, label }) => {
  const active = useSlideState() === 'active'
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul
      aria-label={label}
      className="-mr-1 flex min-h-0 flex-1 flex-col justify-between hr-list overflow-y-auto overflow-x-hidden pr-1"
    >
      {items.map((item, i) => {
        const Icon = HUD_ICONS[item.icon]
        const tone = HUD_TONES[item.tone]
        const on = selected === item.id
        const dim = selected !== null && !on

        return (
          <li
            key={item.id}
            style={{ transitionDelay: active ? `${380 + i * 60}ms` : '0ms' }}
            className={`hr-item border-b border-[var(--border)] last:border-b-0 ${active ? 'hr-in' : ''}`}
          >
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(on ? null : item.id)}
              className={`hr-row group flex w-full items-center gap-[clamp(0.6rem,1.4vh,1rem)] rounded-2xl px-2 py-[clamp(0.3rem,0.9vh,0.7rem)] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-300 ${
                on ? 'hud-panel-active shadow-md ring-1 ring-inset' : ''
              } ${dim ? 'opacity-55' : ''}`}
            >
              <span
                className={`hr-icon flex h-[clamp(2.1rem,4.6vh,2.75rem)] w-[clamp(2.1rem,4.6vh,2.75rem)] shrink-0 items-center justify-center rounded-full shadow-sm ${tone.circle} ${on ? 'hr-icon-on' : ''}`}
              >
                <Icon className="h-[55%] w-[55%]" />
              </span>

              <span className="hr-text min-w-0 flex-1">
                <span className="hud-ink block text-[clamp(0.85rem,1.9vh,1rem)] font-semibold leading-tight">{item.name}</span>
                <span className="hud-ink-soft block text-[clamp(0.75rem,1.6vh,0.875rem)] leading-snug">{item.text}</span>
              </span>

              {item.tag && (
                <span
                  className={`hr-tag hidden shrink-0 rounded-full px-3 py-1 text-xs font-medium ring-1 sm:inline-block ${tone.chip}`}
                >
                  {item.tag}
                </span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}