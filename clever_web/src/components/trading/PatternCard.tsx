import React from 'react'

interface PatternCardProps {
  name: string
  meaning: string
  candleCount: number
  panel: string // fondo pastel del área de la ilustración
  chip: string // etiqueta con el número de velas
  shown: boolean // la sección ya entró en pantalla
  index: number // orden dentro de su grupo, para la entrada escalonada
  className?: string
  children: React.ReactNode // la ilustración
}

/** Tarjeta de un patrón: ilustración, nombre, número de velas y significado breve. */
export const PatternCard: React.FC<PatternCardProps> = ({
  name,
  meaning,
  candleCount,
  panel,
  chip,
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
      <div className={`mb-4 flex h-32 items-center justify-center rounded-xl p-2 ${panel}`}>{children}</div>

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-base font-semibold text-slate-800">{name}</h4>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${chip}`}>
          {candleCount} {candleCount === 1 ? 'vela' : 'velas'}
        </span>
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{meaning}</p>
    </div>
  </article>
)
