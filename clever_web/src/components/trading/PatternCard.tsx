import React from 'react'

interface PatternCardProps {
  name: string
  meaning: string
  candleCount: number
  panel: string // fondo (degradado) del área de la ilustración
  chip: string // etiqueta con el número de velas
  shown: boolean // la sección ya entró en pantalla
  index: number // orden dentro de su grupo, para la entrada escalonada
  /** tarjeta ancha (dos por fila) */
  wide?: boolean
  className?: string
  children: React.ReactNode // la ilustración
}

/** Tarjeta de un patrón: ilustración grande, nombre, número de velas y significado. */
export const PatternCard: React.FC<PatternCardProps> = ({
  name,
  meaning,
  candleCount,
  panel,
  chip,
  shown,
  index,
  wide = false,
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
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-md shadow-slate-200/70 ring-1 ring-slate-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-300/60 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <div className={`w-full shrink-0 rounded-xl p-1 ring-1 ring-white/80 ${panel} ${wide ? 'aspect-[440/162]' : 'aspect-[300/158]'}`}>{children}</div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <h4 className="text-[16px] font-bold leading-tight text-slate-900">{name}</h4>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${chip}`}>
          {candleCount} {candleCount === 1 ? 'vela' : 'velas'}
        </span>
      </div>
      <p className="mt-1 text-[12.5px] leading-snug text-slate-600">{meaning}</p>
    </div>
  </article>
)