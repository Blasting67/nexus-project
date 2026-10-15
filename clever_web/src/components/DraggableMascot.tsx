import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { CleverkorMascot3D } from './CleverkorMascot3D'

export type MascotSide = 'left' | 'right'

interface DraggableMascotProps {
  side: MascotSide
  onSideChange: (side: MascotSide) => void
  /** Elemento que contiene el contenido de la página; los márgenes vacíos a sus lados son el "espacio seguro" */
  anchorRef: React.RefObject<HTMLElement | null>
}

interface Dims {
  w: number
  h: number
  leftX: number
  rightX: number
  top: number
}

const NAV = 64 // alto aproximado de la barra de navegación (la mascota se centra en el resto de la pantalla)
const MIN_W = 130 // si el margen es más angosto que esto, la mascota se oculta
const MAX_W = 400
const SHOUTS = ['¡Suéltame!', '¡Eh, no me agarres!', '¡Cuidado!', '¡Bájame!']

const STYLES = `
.mascot-bubble{animation:mascot-bubble .4s ease-in-out infinite alternate}
@keyframes mascot-bubble{
  from{transform:translateX(-50%) rotate(-3deg)}
  to{transform:translateX(-50%) rotate(3deg)}
}
.mascot-hint{opacity:0;transition:opacity .2s}
.mascot-wrap:hover .mascot-hint{opacity:1}
.mascot-wrap[data-dragging="true"] .mascot-hint{opacity:0}
`

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const DraggableMascot: React.FC<DraggableMascotProps> = ({ side, onSideChange, anchorRef }) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  const swingRef = useRef<HTMLDivElement>(null)
  const dimsRef = useRef<Dims | null>(null)
  const sideRef = useRef<MascotSide>(side)
  sideRef.current = side

  const drag = useRef<{ startX: number; base: number; x: number; last: number; moved: number; active: boolean } | null>(null)
  const idleTimer = useRef<number | undefined>(undefined)

  // Resorte para el balanceo (ángulo) y el "levantamiento" mientras lo agarran
  const spring = useRef({ a: 0, v: 0, target: 0, lift: 0, liftTarget: 0, raf: 0 })

  const [dims, setDims] = useState<Dims | null>(null)
  const [dragging, setDragging] = useState(false)
  const [shout, setShout] = useState(SHOUTS[0])
  const [waveTrigger, setWaveTrigger] = useState(0)

  /* ---------- Geometría: centra la mascota en cada margen vacío ---------- */
  const measure = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const r = anchor.getBoundingClientRect()
    const vw = document.documentElement.clientWidth
    const leftGutter = r.left
    const rightGutter = vw - r.right
    const w = clamp(Math.min(leftGutter, rightGutter) - 12, 0, MAX_W)

    if (w < MIN_W) {
      dimsRef.current = null
      setDims(null)
      return
    }
    const h = clamp(w * 1.3, 200, Math.max(200, window.innerHeight - NAV - 40))
    // Centrada verticalmente en el área visible debajo de la barra de navegación
    const top = NAV + (window.innerHeight - NAV - h) / 2
    const next: Dims = {
      w,
      h,
      leftX: leftGutter / 2 - w / 2,
      rightX: vw - rightGutter / 2 - w / 2,
      top,
    }
    dimsRef.current = next
    setDims(next)
  }, [anchorRef])

  // Importante: useEffect y no useLayoutEffect. El contenedor padre recibe su ref DESPUÉS de que
  // los hijos hacen layout, así que en el primer layout anchorRef.current todavía es null.
  useEffect(() => {
    measure()
    const raf = requestAnimationFrame(measure)
    const t = window.setTimeout(measure, 250)
    window.addEventListener('resize', measure)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    if (ro && anchorRef.current) ro.observe(anchorRef.current)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.removeEventListener('resize', measure)
      ro?.disconnect()
    }
  }, [measure, anchorRef])

  /* ---------- Posicionamiento ---------- */
  const slotX = (s: MascotSide) => {
    const d = dimsRef.current
    if (!d) return 0
    return s === 'right' ? d.rightX : d.leftX
  }

  const place = useCallback((target: MascotSide, animate: boolean) => {
    const el = wrapRef.current
    if (!el) return
    el.style.transition = animate ? 'transform .6s cubic-bezier(.34,1.56,.64,1)' : 'none'
    el.style.transform = `translateX(${slotX(target)}px)`
  }, [])

  // Coloca (sin animación) al montar y cuando cambian las medidas
  useLayoutEffect(() => {
    if (dims && !drag.current) place(sideRef.current, false)
  }, [dims, place])

  /* ---------- Balanceo con resorte (se siente físico, no un temblor) ---------- */
  const tick = useCallback(() => {
    const s = spring.current
    s.v += (s.target - s.a) * 0.12
    s.v *= 0.82
    s.a += s.v
    s.lift += (s.liftTarget - s.lift) * 0.18

    const el = swingRef.current
    if (el) {
      const scale = 1 + (-s.lift) * 0.004
      el.style.transform = `translateY(${s.lift}px) rotate(${s.a}deg) scale(${scale})`
    }

    const settled =
      Math.abs(s.a) < 0.03 && Math.abs(s.v) < 0.03 && Math.abs(s.lift - s.liftTarget) < 0.05 && s.target === 0
    if (settled && !drag.current) {
      s.raf = 0
      if (el) el.style.transform = ''
      return
    }
    s.raf = requestAnimationFrame(tick)
  }, [])

  const kick = useCallback(() => {
    if (!spring.current.raf) spring.current.raf = requestAnimationFrame(tick)
  }, [tick])

  useEffect(
    () => () => {
      cancelAnimationFrame(spring.current.raf)
      window.clearTimeout(idleTimer.current)
    },
    [],
  )

  /* ---------- Eventos de arrastre (solo eje X) ---------- */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el || !dimsRef.current) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const base = slotX(sideRef.current)
    drag.current = { startX: e.clientX, base, x: base, last: e.clientX, moved: 0, active: false }
    el.style.transition = 'none'
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    const el = wrapRef.current
    const dm = dimsRef.current
    if (!d || !el || !dm) return

    d.moved = Math.max(d.moved, Math.abs(e.clientX - d.startX))
    if (!d.active) {
      if (d.moved < 4) return
      d.active = true
      spring.current.liftTarget = -10
      setShout(SHOUTS[Math.floor(Math.random() * SHOUTS.length)])
      setDragging(true)
    }

    d.x = clamp(d.base + (e.clientX - d.startX), dm.leftX, dm.rightX)
    el.style.transform = `translateX(${d.x}px)`

    // Hacia donde lo jalan, el cuerpo se queda atrás y se balancea
    const vx = e.clientX - d.last
    d.last = e.clientX
    spring.current.target = clamp(vx * 1.6, -24, 24)
    window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => {
      spring.current.target = 0
      kick()
    }, 70)
    kick()
  }

  const endDrag = () => {
    const d = drag.current
    const dm = dimsRef.current
    if (!d || !dm) return
    drag.current = null
    window.clearTimeout(idleTimer.current)
    spring.current.target = 0
    spring.current.liftTarget = 0
    setDragging(false)

    // Toque sin arrastre: Kor saluda
    if (!d.active) {
      setWaveTrigger((n) => n + 1)
      return
    }

    // Se acomoda en el margen más cercano
    const target: MascotSide = d.x > (dm.leftX + dm.rightX) / 2 ? 'right' : 'left'
    place(target, true)
    if (target !== sideRef.current) onSideChange(target)

    // Pequeño empujón al soltar para que "rebote" al aterrizar
    spring.current.v += target === 'right' ? 3 : -3
    kick()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const target: MascotSide = sideRef.current === 'left' ? 'right' : 'left'
      place(target, true)
      onSideChange(target)
      spring.current.v += target === 'right' ? 3 : -3
      kick()
    }
  }

  if (!dims || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={wrapRef}
      data-dragging={dragging}
      className="mascot-wrap select-none"
      style={{
        position: 'fixed',
        top: dims.top,
        left: 0,
        width: dims.w,
        height: dims.h,
        zIndex: 30,
        willChange: 'transform',
      }}
    >
      <style>{STYLES}</style>

      <div ref={swingRef} style={{ width: '100%', height: '100%', transformOrigin: '50% 12%' }}>
        <CleverkorMascot3D height="100%" grabbed={dragging} waveTrigger={waveTrigger} />
      </div>

      {dragging && (
        <div
          className="mascot-bubble"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--text, #111)',
            background: 'var(--bg, #fff)',
            border: '1px solid var(--border, #e5e7eb)',
            boxShadow: '0 2px 8px rgba(0,0,0,.12)',
          }}
        >
          {shout}
        </div>
      )}

      <div
        className="mascot-hint"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          padding: '4px 12px',
          borderRadius: 999,
          fontSize: 11,
          fontFamily: 'monospace',
          color: 'var(--text-muted, #6b7280)',
          background: 'var(--bg, #fff)',
          border: '1px solid var(--border, #e5e7eb)',
          boxShadow: '0 2px 8px rgba(0,0,0,.1)',
        }}
      >
        ↔ Arrástrame
      </div>

      {/* Capa que recibe el arrastre */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Mover a Kor al otro margen de la pantalla"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute',
          inset: 0,
          touchAction: 'none',
          cursor: dragging ? 'grabbing' : 'grab',
        }}
      ></div>
    </div>,
    document.body,
  )
}