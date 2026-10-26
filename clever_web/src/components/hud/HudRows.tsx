import React, { useState } from 'react'
import type { HudRowItem } from './HudData'
import { HUD_ICONS } from './HudIcons'

export const HudRows: React.FC<{ items: HudRowItem[]; label: string }> = ({ items, label }) => {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ul aria-label={label} data-picked={selected ?? undefined} className="hc-rows">
      {items.map((item) => {
        const Icon = HUD_ICONS[item.icon]
        const on = selected === item.id
        return (
          <li key={item.id}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => setSelected(on ? null : item.id)}
              className={`hc-row hc-tone-${item.tone}`}
            >
              <span aria-hidden="true" className="hc-icon">
                <Icon className="hc-svg" />
              </span>
              <span className="min-w-0">
                <span className="hc-row-name">{item.name}</span>
                <span className="hc-row-text">{item.text}</span>
              </span>
              {item.tag && <span className="hc-tag">{item.tag}</span>}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
