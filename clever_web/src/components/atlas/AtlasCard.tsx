import React, { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Botón "?" con explicación sencilla (hover o clic).
 * El cuadro se dibuja en <body> con position: fixed y un z-index muy alto, así que
 * nunca queda recortado por la tarjeta ni tapado por otras tarjetas. Se coloca solo:
 * debajo del botón y, si no cabe, arriba; siempre dentro de la pantalla.
 */
export const InfoTip: React.FC<{
  text: string
  /** Ya no se usa (la posición es automática); se conserva para no romper llamadas existentes. */
  align?: 'left' | 'right'
}> = ({ text }) => {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (!open) {
      setPos(null)
      return
    }

    const place = () => {
      const btn = btnRef.current
      const tip = tipRef.current
      if (!btn || !tip) return
      const r = btn.getBoundingClientRect()
      const margin = 10
      const w = tip.offsetWidth
      const h = tip.offsetHeight
      const left = Math.min(
        Math.max(margin, r.left + r.width / 2 - w / 2),
        window.innerWidth - w - margin,
      )
      let top = r.bottom + margin
      if (top + h > window.innerHeight - margin && r.top - margin - h > margin) {
        top = r.top - margin - h
      }
      setPos({ top, left })
    }

    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  return (
    <span
      className="inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={btnRef}
        type="button"
        aria-label="¿Qué significa?"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold shadow-sm transition duration-200 ${
          open
            ? 'scale-110 border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-400/50'
            : 'border-amber-300 bg-amber-50 text-amber-700 hover:scale-110 hover:border-amber-500 hover:bg-amber-500 hover:text-white hover:shadow-md hover:shadow-amber-400/50'
        }`}
      >
        ?
      </button>

      {open &&
        createPortal(
          <span
            ref={tipRef}
            role="tooltip"
            className="pointer-events-none fixed z-[9999] w-60 rounded-xl border border-amber-300 bg-white p-3.5 text-left text-[13px] font-normal leading-relaxed text-slate-700 shadow-2xl shadow-slate-900/20 ring-4 ring-amber-100/70"
            style={{
              top: pos?.top ?? 0,
              left: pos?.left ?? 0,
              visibility: pos ? 'visible' : 'hidden',
            }}
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  )
}

interface AtlasCardProps {
  title: string
  tip: string
  /** color del resplandor suave de la esquina (rgba) */
  tint?: string
  className?: string
  /** contenido extra a la derecha del título (ej. pestañas) */
  actions?: React.ReactNode
  children: React.ReactNode
}

export const AtlasCard: React.FC<AtlasCardProps> = ({
  title,
  tip,
  tint = 'rgba(251,191,36,0.08)',
  className = '',
  actions,
  children,
}) => (
  <section
    className={`relative z-0 flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm shadow-slate-200/70 transition duration-300 focus-within:z-20 hover:z-20 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${className}`}
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl"
      style={{ background: `radial-gradient(120% 90% at 90% -10%, ${tint}, transparent 60%)` }}
    />
    <header className="relative z-10 mb-3 flex items-center justify-between gap-2">
      <h3 className="text-sm font-medium text-slate-700">{title}</h3>
      <div className="flex items-center gap-2">
        {actions}
        <InfoTip text={tip} />
      </div>
    </header>
    <div className="relative z-10 flex flex-1 flex-col">{children}</div>
  </section>
)

/* Número grande + etiqueta de estado */
export const Readout: React.FC<{
  value: React.ReactNode
  suffix?: string
  label?: string
  labelColor?: string
}> = ({ value, suffix, label, labelColor }) => (
  <div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</span>
      {suffix && <span className="text-xs text-slate-400">{suffix}</span>}
    </div>
    {label && (
      <div className="mt-0.5 text-sm font-medium" style={{ color: labelColor }}>
        {label}
      </div>
    )}
  </div>
)