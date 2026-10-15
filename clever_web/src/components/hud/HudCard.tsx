import React from 'react'
import { HUD_ICONS } from './HudIcons'
import type { HudIconKey } from './HudIcons'

interface HudCardProps {
  title: string
  icon: HudIconKey
  className?: string
  children: React.ReactNode
}

/** Tarjeta translúcida del HUD: recuadro de icono con degradado, título y cuerpo flexible. */
export const HudCard: React.FC<HudCardProps> = ({ title, icon, className = '', children }) => {
  const Icon = HUD_ICONS[icon]
  return (
    <section
      aria-label={title}
      className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/75 p-[clamp(1rem,2.2vh,1.5rem)] shadow-xl shadow-indigo-200/30 ring-1 ring-slate-200/60 backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-indigo-200/40 motion-reduce:transition-none ${className}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute -right-14 -top-14 h-44 w-44 rounded-full bg-violet-200/35 blur-3xl" />
      <header className="relative mb-[clamp(0.6rem,1.8vh,1.25rem)] flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-violet-400 text-white shadow-lg shadow-violet-300/40">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="text-[clamp(1.05rem,2.5vh,1.5rem)] font-bold leading-tight tracking-tight text-slate-800">{title}</h2>
      </header>
      <div className="relative flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  )
}
