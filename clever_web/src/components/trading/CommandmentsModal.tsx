import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { COMMANDMENTS, COMMANDMENTS_SIGNATURE } from './CommandmentsData'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
const EXIT_MS = 300

interface CommandmentsModalProps {
  open: boolean
  onClose: () => void
}

/**
 * Modal con los doce mandamientos.
 * - Apertura y cierre suaves (fundido + ligero desplazamiento).
 * - Accesible: role="dialog", aria-modal, foco atrapado, Escape y clic fuera para cerrar,
 *   y el foco vuelve al botón que lo abrió.
 * - Bloquea el scroll de la página mientras está abierto.
 */
export const CommandmentsModal: React.FC<CommandmentsModalProps> = ({ open, onClose }) => {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // montar al abrir y desmontar cuando termina la animación de salida
  useEffect(() => {
    if (open) {
      setMounted(true)
      let inner = 0
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setVisible(true))
      })
      return () => {
        cancelAnimationFrame(outer)
        cancelAnimationFrame(inner)
      }
    }
    setVisible(false)
    const t = window.setTimeout(() => setMounted(false), EXIT_MS)
    return () => window.clearTimeout(t)
  }, [open])

  // scroll bloqueado, teclado (Escape y Tab) y devolución del foco
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return

      const items = dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (!dialogRef.current.contains(active)) {
        e.preventDefault()
        first.focus()
      } else if (e.shiftKey && active === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      previous?.focus()
    }
  }, [open])

  // foco inicial en el botón de cierre
  useEffect(() => {
    if (open && mounted) closeRef.current?.focus({ preventScroll: true })
  }, [open, mounted])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className={`fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/30 p-3 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none sm:p-6 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="commandments-title"
        className={`relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-2xl shadow-slate-900/10 transition duration-300 ease-out motion-reduce:transition-none ${
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-95 opacity-0'
        }`}
      >
        <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/80 via-white to-amber-50/70 py-5 pl-6 pr-16">
          <h2 id="commandments-title" className="text-lg font-semibold tracking-tight text-slate-800">
            Los 12 mandamientos del trader
          </h2>
        </div>

        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>

        <div
          tabIndex={0}
          role="region"
          aria-label="Lista de mandamientos"
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-200"
        >
          <ol role="list" className="space-y-0.5">
            {COMMANDMENTS.map((text, i) => (
              <li
                key={text}
                style={{ transitionDelay: visible ? `${120 + i * 35}ms` : '0ms' }}
                className={`transition duration-500 ease-out motion-reduce:transition-none ${
                  visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-violet-50/60">
                  <span
                    aria-hidden="true"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-50 text-xs font-semibold text-violet-600 ring-1 ring-violet-100"
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 sm:text-[15px]">
                    <span className="sr-only">{i + 1}. </span>
                    {text}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="border-t border-slate-100 px-6 py-3 text-center font-serif text-[11px] italic text-slate-400">
          {COMMANDMENTS_SIGNATURE}
        </p>
      </div>
    </div>,
    document.body,
  )
}
