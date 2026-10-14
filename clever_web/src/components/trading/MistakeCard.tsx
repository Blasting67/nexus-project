import React from 'react'

interface MistakeCardProps {
  title: string
  text: string
  icon: React.ReactNode
  iconTone: string // colores pastel del icono
  shown: boolean // la sección ya entró en pantalla
  index: number // orden dentro del grupo, para la entrada escalonada
  className?: string
}

/** Tarjeta de un error común: icono discreto, título breve y explicación concisa. */
export const MistakeCard: React.FC<MistakeCardProps> = ({
  title,
  text,
  icon,
  iconTone,
  shown,
  index,
  className = '',
}) => (
  // el contenedor exterior hace la entrada; el interior, el hover (así no se mezclan los retrasos)
  <article
    style={{ transitionDelay: `${index * 80}ms` }}
    className={`transition duration-700 ease-out motion-reduce:transition-none ${
      shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
    } ${className}`}
  >
    <div className="group h-full rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm shadow-slate-200/50 transition duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md hover:shadow-slate-200/70 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      <span
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none ${iconTone}`}
      >
        {icon}
      </span>
      <h4 className="text-base font-semibold leading-snug text-slate-800">{title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{text}</p>
    </div>
  </article>
)
