import React from 'react'
import { HUD_ICONS } from './HudIcons'
import type { HudIconKey, HudToneKey } from './HudIcons'
import './cards/hudCards.css'

interface HudCardProps {
  title: string
  icon: HudIconKey
  accent?: [HudToneKey, HudToneKey]
  subtitle?: string
  className?: string
  children: React.ReactNode
}

export const HudCard: React.FC<HudCardProps> = ({ title, icon, accent = ['sky', 'violet'], subtitle, className = '', children }) => {
  const Icon = HUD_ICONS[icon]
  const style = { '--hc-a': `var(--hc-${accent[0]})`, '--hc-b': `var(--hc-${accent[1]})` } as React.CSSProperties
  return (
    <section aria-label={title} style={style} className={`hc-card ${className}`}>
      <div className="hc-inner">
        <header className="hc-head">
          <span aria-hidden="true" className="hc-badge">
            <Icon className="hc-svg" />
          </span>
          <div className="min-w-0">
            <h2 className="hc-title">{title}</h2>
            {subtitle && <p className="hc-sub">{subtitle}</p>}
          </div>
        </header>
        <div className="hc-body">{children}</div>
      </div>
    </section>
  )
}
