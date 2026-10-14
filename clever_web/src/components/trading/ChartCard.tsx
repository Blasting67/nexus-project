import React from 'react'

export interface ChartTone {
  panel: string // fondo pastel del área de la gráfica
  chip: string // etiqueta "Para quién"
}

interface ChartCardProps {
  name: string
  shows: string // "Qué muestra"
  audience: string // "Para quién"
  description: string
  tone: ChartTone
  shown: boolean // la sección ya entró en pantalla
  index: number // orden, para la entrada escalonada
  className?: string
  children: React.ReactNode // la gráfica
}

/** Tarjeta de un tipo de gráfico: gráfica, nombre, qué muestra, para quién y una explicación breve. */
export const ChartCard: React.FC<ChartCardProps> = ({
  name,
  shows,
  audience,
  description,
  tone,
  shown,
  index,
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
    <div className="group h-full rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div
        className={`mb-4 flex h-36 items-center justify-center rounded-xl p-2 transition duration-300 group-hover:scale-[1.015] motion-reduce:transition-none ${tone.panel}`}
      >
        {children}
      </div>

      <h3 className="text-base font-semibold text-slate-800">{name}</h3>

      <dl className="mt-2 grid grid-cols-[5.5rem_1fr] items-baseline gap-x-2 gap-y-1.5 text-xs">
        <dt className="text-slate-400">Qué muestra</dt>
        <dd className="text-slate-700">{shows}</dd>
        <dt className="text-slate-400">Para quién</dt>
        <dd>
          <span className={`inline-block rounded-full px-2 py-0.5 font-medium ring-1 ${tone.chip}`}>{audience}</span>
        </dd>
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  </article>
)
