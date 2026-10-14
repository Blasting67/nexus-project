import React, { useCallback, useState } from 'react'
import { CommandmentsModal } from './CommandmentsModal'
import { useReveal } from './useReveal'

/** Libro ilustrado en SVG. Al pasar el mouse (o enfocarlo) la tapa se abre un poco. */
const BookIllustration: React.FC = () => (
  <svg viewBox="0 0 180 224" className="relative h-52 w-auto sm:h-60" aria-hidden="true">
    <defs>
      <linearGradient id="book-cover" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c7d2fe" />
        <stop offset="55%" stopColor="#ddd6fe" />
        <stop offset="100%" stopColor="#fbcfe8" />
      </linearGradient>
      <linearGradient id="book-spine" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* sombra */}
    <ellipse cx="92" cy="216" rx="62" ry="5" fill="#0f172a" opacity="0.08" />

    {/* marcador de tela asomando por abajo */}
    <path d="M118 200h14v20l-7-5-7 5z" fill="#fda4af" opacity="0.85" />

    {/* hojas que asoman por la derecha */}
    <rect x="32" y="16" width="138" height="190" rx="5" fill="#fff" stroke="#e7dfc6" />
    <rect x="29" y="13" width="138" height="190" rx="5" fill="#fffdf6" stroke="#e7dfc6" />
    <rect x="26" y="10" width="138" height="190" rx="5" fill="#fffbeb" stroke="#e7dfc6" />

    {/* primera página (se ve al abrir la tapa) */}
    <g fill="#e2e8f0">
      <rect x="104" y="34" width="38" height="3.5" rx="1.75" fill="#cbd5e1" />
      <rect x="104" y="52" width="46" height="2.5" rx="1.25" />
      <rect x="104" y="62" width="40" height="2.5" rx="1.25" />
      <rect x="104" y="72" width="46" height="2.5" rx="1.25" />
      <rect x="104" y="82" width="34" height="2.5" rx="1.25" />
      <rect x="104" y="98" width="46" height="2.5" rx="1.25" />
      <rect x="104" y="108" width="42" height="2.5" rx="1.25" />
    </g>

    {/* tapa: se abre girando sobre el lomo */}
    <g className="origin-left transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-box:fill-box] group-hover:[transform:scaleX(0.55)_skewY(-3deg)] group-focus-visible:[transform:scaleX(0.55)_skewY(-3deg)] motion-reduce:transition-none">
      <rect x="18" y="6" width="142" height="196" rx="6" fill="url(#book-cover)" stroke="#fff" strokeOpacity="0.7" />
      <rect x="18" y="6" width="16" height="196" rx="6" fill="url(#book-spine)" />
      <path d="M34 6v196" stroke="#fff" strokeOpacity="0.55" />

      {/* marcos */}
      <rect x="44" y="24" width="102" height="160" rx="4" fill="none" stroke="#fff" strokeOpacity="0.85" />
      <rect x="49" y="29" width="92" height="150" rx="3" fill="none" stroke="#fff" strokeOpacity="0.45" />

      {/* emblema */}
      <path d="M95 58l5 6-5 6-5-6z" fill="#6366f1" opacity="0.4" />
      <text
        x="95"
        y="116"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="38"
        fill="#4338ca"
        fillOpacity="0.55"
      >
        XII
      </text>
      <path d="M75 128h40" stroke="#4338ca" strokeOpacity="0.25" />
      <text
        x="95"
        y="146"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="8.5"
        letterSpacing="2.4"
        fill="#4338ca"
        fillOpacity="0.5"
      >
        MANDAMIENTOS
      </text>
    </g>
  </svg>
)

/** Parte 6: libro de los 12 mandamientos; al abrirlo aparece un modal accesible. */
export const CommandmentsBook: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.2)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <section
      ref={ref}
      aria-label="Los 12 mandamientos del trader"
      className={`relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/60 via-white to-amber-50/50 px-6 py-10 text-center shadow-sm shadow-slate-200/50 transition duration-700 ease-out motion-reduce:transition-none sm:py-12 ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <span className="mx-auto mb-3 block h-1 w-8 rounded-full bg-gradient-to-r from-violet-200 to-amber-200" />
      <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">Los 12 mandamientos del trader</h2>
      <p className="mt-1 text-sm text-slate-500">Ábrelo para leer los doce mandamientos.</p>

      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Abrir Los 12 mandamientos del trader"
        className="group mx-auto mt-8 flex flex-col items-center gap-6 rounded-3xl p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-4"
      >
        <span className="relative block">
          {/* iluminación tenue por detrás */}
          <span
            aria-hidden="true"
            className="absolute -inset-10 animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-gradient-to-br from-amber-200/60 via-violet-200/50 to-sky-200/50 blur-3xl transition-transform duration-700 group-hover:scale-110 motion-reduce:animate-none"
          />
          <span className="relative block transition duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none">
            <BookIllustration />
          </span>
        </span>

        <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-5 py-2 text-sm font-medium text-violet-700 shadow-sm transition duration-300 group-hover:border-violet-300 group-hover:bg-white group-hover:shadow-md">
          Abrir el libro
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 10h12M11 5l5 5-5 5" />
          </svg>
        </span>
      </button>

      <CommandmentsModal open={open} onClose={close} />
    </section>
  )
}
