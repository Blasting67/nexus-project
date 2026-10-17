import React from 'react'

export interface ChartTone {
  panel: string // fondo (degradado) del área de la gráfica
  chip: string // etiqueta "Para quién"
  accent: string // color de acento (hex)
  glow: string // resplandor de la esquina (rgba)
}

interface ChartCardProps {
  name: string
  alias?: string // nombre en inglés o alternativo
  shows: string // "Qué muestra"
  audience: string // "Para quién"
  description: string
  tone: ChartTone
  shown: boolean // la sección ya entró en pantalla
  index: number // orden, para la entrada escalonada
  number?: number // número del gráfico (01, 02…)
  className?: string
  children: React.ReactNode // la gráfica
}

/** Tarjeta de un tipo de gráfico: gráfica grande, nombre, qué muestra, para quién y una explicación breve. */
export const ChartCard: React.FC<ChartCardProps> = ({
  name,
  alias,
  shows,
  audience,
  description,
  tone,
  shown,
  index,
  number,
  className = '',
  children,
}) => (
  // el contenedor exterior hace la entrada; el interior, el hover (así no se mezclan los retrasos)
  <article
    style={{ transitionDelay: `${index * 80}ms` }}
    className={`transition duration-700 ease-out motion-reduce:transition-none ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
    } ${className}`}
  >
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-5 shadow-lg shadow-slate-200/70 ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {/* resplandor de color en la esquina */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full"
        style={{ background: `radial-gradient(circle, ${tone.glow} 0%, transparent 68%)` }}
      />

      <header className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[22px] font-bold leading-tight tracking-tight text-slate-900">{name}</h3>
          {alias && (
            <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: tone.accent }}>
              {alias}
            </p>
          )}
        </div>
        {number !== undefined && (
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-bold text-white shadow-md"
            style={{ background: `linear-gradient(135deg, ${tone.accent}, ${tone.accent}bb)` }}
          >
            {String(number).padStart(2, '0')}
          </span>
        )}
      </header>

      {/* la gráfica */}
      <div className={`relative mt-3 flex min-h-0 flex-1 items-center justify-center rounded-2xl p-2 ring-1 ring-white/80 ${tone.panel}`}>
        <div className="aspect-[520/300] max-h-full w-full">{children}</div>
        <span className="pointer-events-none absolute bottom-2 right-3 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-medium text-slate-400 opacity-100 transition-opacity duration-300 group-hover:opacity-0">
          Pasa el mouse sobre la gráfica
        </span>
      </div>

      <dl className="relative mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Qué muestra</dt>
          <dd className="mt-0.5 min-h-[2.5rem] text-[13px] font-medium leading-snug text-slate-800">{shows}</dd>
        </div>
        <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100">
          <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Uso</dt>
          <dd className="mt-1 min-h-[2.5rem]">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[12px] font-semibold ring-1 ${tone.chip}`}>{audience}</span>
          </dd>
        </div>
      </dl>

      <p className="relative mt-3 text-[13px] leading-relaxed text-slate-600">{description}</p>
    </div>
  </article>
)