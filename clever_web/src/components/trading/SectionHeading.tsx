import React from 'react'

interface SectionHeadingProps {
  title: string
  subtitle?: string
}

/** Encabezado de sección: línea de acento pastel, título y subtítulo opcional. */
export const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle }) => (
  <header className="mb-5">
    <span className="mb-3 block h-1 w-8 rounded-full bg-gradient-to-r from-sky-200 to-violet-200" />
    <h2 className="text-lg font-semibold tracking-tight text-slate-800">{title}</h2>
    {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
  </header>
)
