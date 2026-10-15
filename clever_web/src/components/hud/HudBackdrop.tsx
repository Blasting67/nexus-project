import React from 'react'

/** Manchas pastel difuminadas detrás del HUD (el fondo de la página sigue siendo blanco). */
export const HudBackdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div className="absolute -left-24 top-28 h-80 w-80 rounded-full bg-violet-200/40 blur-3xl" />
    <div className="absolute -top-10 right-0 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
    <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
    <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-rose-100/40 blur-3xl" />
  </div>
)
