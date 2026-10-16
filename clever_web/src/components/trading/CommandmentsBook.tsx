import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSlideState } from '../hud/HudSlide'
import { COMMANDMENTS, COMMANDMENTS_SIGNATURE } from './CommandmentsData'
import { useReveal } from './useReveal'

/* ------------------------------------------------------------------ */
/* Geometría del libro: px de diseño (el libro entero se escala)        */
/* ------------------------------------------------------------------ */
const P = 300 // ancho de una página
const H = 414 // alto de una página (misma proporción que la portada)
const CARD_H = 540 // alto de la tarjeta (igual abierta o cerrada)
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

/** Portada + 4 hojas que se ojean. Índice 0 = portada. */
const LEAVES = 5
const OPEN_DELAY = [380, 1180, 1340, 1500, 1660]
const OPEN_DUR = [1000, 560, 560, 560, 620]
const CLOSE_DELAY = [560, 330, 220, 110, 0] // al cerrar, la última hoja regresa primero
const CLOSE_DUR = [820, 460, 460, 460, 460]
const OPEN_TOTAL = 2400
const CLOSE_TOTAL = 2300

const EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)'
const SOFT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const PAPER = 'linear-gradient(135deg, #fffdf6 0%, #fbf5e4 100%)'

/** La firma de la portada, en dos líneas: "Los mandamientos de" / "Cristian Hdz. Estrella". */
const SIGNATURE_LINES: [string, string] = (() => {
  const cut = COMMANDMENTS_SIGNATURE.indexOf(' de ') + 3
  return cut > 3 ? [COMMANDMENTS_SIGNATURE.slice(0, cut), COMMANDMENTS_SIGNATURE.slice(cut).trim()] : [COMMANDMENTS_SIGNATURE, '']
})()

const CSS = `
.bk-float{animation:bk-float 5.6s ease-in-out infinite}
.bk-float-soft{animation:bk-float-soft 6s ease-in-out infinite}
.bk-halo{animation:bk-halo 4.8s ease-in-out infinite}
.bk-rays{animation:bk-spin 70s linear infinite}
.bk-twinkle{animation:bk-twinkle 3.2s ease-in-out infinite}
.bk-shadow{animation:bk-shadow 5.6s ease-in-out infinite}
@keyframes bk-float{0%,100%{transform:translateY(0) rotate(-0.9deg)}50%{transform:translateY(-22px) rotate(1.1deg)}}
@keyframes bk-float-soft{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
@keyframes bk-halo{0%,100%{transform:scale(.93);opacity:.72}50%{transform:scale(1.09);opacity:1}}
@keyframes bk-spin{to{transform:rotate(360deg)}}
@keyframes bk-twinkle{0%,100%{opacity:0;transform:scale(.3) rotate(0)}50%{opacity:1;transform:scale(1) rotate(45deg)}}
@keyframes bk-shadow{0%,100%{opacity:1;transform:scaleX(1)}50%{opacity:.6;transform:scaleX(.86)}}
@media (prefers-reduced-motion:reduce){
  .bk-float,.bk-float-soft,.bk-halo,.bk-rays,.bk-twinkle,.bk-shadow{animation:none!important}
}
`

const SPARKS = [
  { x: -150, y: -96, s: 13, d: 0 },
  { x: 140, y: -118, s: 10, d: 0.7 },
  { x: -178, y: 34, s: 9, d: 1.3 },
  { x: 168, y: 52, s: 12, d: 0.35 },
  { x: -78, y: 142, s: 10, d: 1.0 },
  { x: 92, y: 134, s: 13, d: 1.7 },
]

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduced(mql.matches)
    mql.addEventListener?.('change', on)
    return () => mql.removeEventListener?.('change', on)
  }, [])
  return reduced
}

/* ------------------------------------------------------------------ */
/* Portada: la misma del libro de siempre + la firma pequeña debajo   */
/* ------------------------------------------------------------------ */
const CoverFace: React.FC = () => (
  <svg viewBox="18 6 142 196" className="h-full w-full" aria-hidden="true">
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

    <rect x="18" y="6" width="142" height="196" rx="6" fill="url(#book-cover)" stroke="#fff" strokeOpacity="0.7" />
    <rect x="18" y="6" width="16" height="196" rx="6" fill="url(#book-spine)" />
    <path d="M34 6v196" stroke="#fff" strokeOpacity="0.55" />

    {/* marcos */}
    <rect x="44" y="24" width="102" height="160" rx="4" fill="none" stroke="#fff" strokeOpacity="0.85" />
    <rect x="49" y="29" width="92" height="150" rx="3" fill="none" stroke="#fff" strokeOpacity="0.45" />

    {/* emblema */}
    <path d="M95 58l5 6-5 6-5-6z" fill="#6366f1" opacity="0.4" />
    <text x="95" y="116" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="38" fill="#4338ca" fillOpacity="0.55">
      XII
    </text>
    <path d="M75 128h40" stroke="#4338ca" strokeOpacity="0.25" />
    <text x="95" y="146" textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontSize="8.5" letterSpacing="2.4" fill="#4338ca" fillOpacity="0.5">
      MANDAMIENTOS
    </text>

    {/* firma */}
    <text
      textAnchor="middle"
      fontFamily="Georgia, 'Times New Roman', serif"
      fontStyle="italic"
      fontSize="6.8"
      letterSpacing="0.15"
      fill="#4338ca"
      fillOpacity="0.78"
    >
      <tspan x="95" y="161.5">
        {SIGNATURE_LINES[0]}
      </tspan>
      <tspan x="95" y="170.5">
        {SIGNATURE_LINES[1]}
      </tspan>
    </text>
  </svg>
)

/** Reverso de la portada (se ve un instante al abrir). */
const EndPaper: React.FC = () => (
  <div className="relative h-full w-full overflow-hidden" style={{ background: 'linear-gradient(135deg,#e0e7ff 0%,#ede9fe 55%,#fce7f3 100%)', borderRadius: '10px 2px 2px 10px' }}>
    <span className="absolute inset-5 rounded-md border border-white/80" />
    <span className="absolute inset-8 rounded border border-white/50" />
    <span className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-sm bg-indigo-300/25" />
  </div>
)

/* ------------------------------------------------------------------ */
/* Páginas                                                             */
/* ------------------------------------------------------------------ */
interface FaceProps {
  /** lado del libro en el que se ve: derecha (frente de la hoja) o izquierda (reverso) */
  side: 'right' | 'left'
  /** el reverso va girado 180° y oculto cuando mira hacia atrás */
  back?: boolean
  children?: React.ReactNode
}

/** Una cara de papel. Sombrea el lado del lomo. */
const Face: React.FC<FaceProps> = ({ side, back = false, children }) => (
  <div
    className="absolute inset-0 overflow-hidden"
    style={{
      background: PAPER,
      border: '1px solid #e7dfc6',
      borderRadius: side === 'right' ? '2px 10px 10px 2px' : '10px 2px 2px 10px',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      transform: back ? 'rotateY(180deg)' : undefined,
    }}
  >
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 z-10 w-12"
      style={
        side === 'right'
          ? { left: 0, background: 'linear-gradient(90deg, rgba(110,90,50,0.2), rgba(110,90,50,0))' }
          : { right: 0, background: 'linear-gradient(270deg, rgba(110,90,50,0.2), rgba(110,90,50,0))' }
      }
    />
    {children}
  </div>
)

/** Página sin texto: líneas muy tenues (las hojas que se ojean). */
const BlankLines: React.FC = () => (
  <div
    aria-hidden="true"
    className="absolute inset-x-8 inset-y-10"
    style={{ backgroundImage: 'repeating-linear-gradient(transparent 0 27px, rgba(148,163,184,0.15) 27px 28px)' }}
  />
)

/** Seis mandamientos con su número romano. */
const CommandmentsPage: React.FC<{ from: number; page: number }> = ({ from, page }) => {
  const items = COMMANDMENTS.slice(from, from + 6)
  return (
    <div className="relative flex h-full flex-col px-7 pb-5 pt-7 text-left">
      <header className="text-center">
        <p className="font-serif text-[10.5px] uppercase tracking-[0.3em] text-indigo-500/70">Mandamientos</p>
        <p className="mt-0.5 font-serif text-[16px] text-indigo-700/80">
          {ROMAN[from]} – {ROMAN[from + 5]}
        </p>
        <span className="mx-auto mt-2 block h-px w-24 bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
      </header>

      <ol role="list" className="mt-3 flex flex-1 flex-col justify-between gap-2.5">
        {items.map((text, i) => (
          <li key={text} className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-serif text-[12px] font-semibold text-indigo-700 ring-1 ring-indigo-200"
            >
              {ROMAN[from + i]}
            </span>
            <span className="font-serif text-[15px] leading-snug text-slate-700">
              <span className="sr-only">{from + i + 1}. </span>
              {text}
            </span>
          </li>
        ))}
      </ol>

      <footer className="pt-2 text-center font-serif text-[11px] text-slate-400" aria-hidden="true">
        — {page} —
      </footer>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tarjeta                                                             */
/* ------------------------------------------------------------------ */
/**
 * Parte 6: libro de los 12 mandamientos.
 * Cerrado, flota suavemente con un resplandor por detrás. Al tocarlo crece, los títulos se desvanecen,
 * la tapa se abre, se ojean unas hojas y queda abierto con seis mandamientos en cada página.
 * Se cierra con el botón (o Escape) y vuelve a su estado original.
 */
export const CommandmentsBook: React.FC = () => {
  const { ref, shown } = useReveal<HTMLElement>(0.2)
  const slide = useSlideState()
  const reduced = usePrefersReducedMotion()

  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false) // mientras corre la animación de abrir o cerrar
  const [hover, setHover] = useState(false)
  const [width, setWidth] = useState(768)
  const timer = useRef(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  // ancho de la tarjeta → escala del libro
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])

  const s1 = Math.min(1.2, (width - 48) / (2 * P), (CARD_H - 132) / H) // libro abierto
  const s0 = width < 520 ? 0.44 : 0.65 // libro cerrado (el tamaño de siempre)
  const compact = s1 < 0.7 // pantalla angosta: las dos páginas van una sobre otra, sin libro 3D
  const backDelay = compact ? 450 : 1700 // espera para que reaparezcan títulos y botón tras cerrar
  const closeBtnDelay = compact ? 500 : 1900 // espera para que aparezca "Cerrar el libro" tras abrir

  const toggle = useCallback((next: boolean) => {
    setOpen(next)
    setBusy(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setBusy(false), next ? OPEN_TOTAL : CLOSE_TOTAL)
  }, [])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Escape cierra; el foco pasa al botón de cerrar y regresa al abrir
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') toggle(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, toggle])
  useEffect(() => {
    if (open) closeRef.current?.focus({ preventScroll: true })
    else if (wasOpen.current) openRef.current?.focus({ preventScroll: true })
    wasOpen.current = open
  }, [open])

  // si la sección sale de la vista, el libro se cierra para volver a su estado original
  useEffect(() => {
    if (slide !== 'active' && open) {
      window.clearTimeout(timer.current)
      setOpen(false)
      setBusy(false)
    }
  }, [slide, open])

  const peeking = !open && !busy && hover // al pasar el mouse, la tapa se entreabre
  const t = (ms: number, delay = 0, ease = SOFT, prop = 'transform') => (reduced ? 'none' : `${prop} ${ms}ms ${ease} ${delay}ms`)
  const fade = (visible: boolean, openDelay = 0, closeDelay = 0): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    visibility: visible ? 'visible' : 'hidden',
    transition: reduced ? 'none' : `opacity 450ms ease ${visible ? openDelay : closeDelay}ms, visibility 0s linear ${visible ? 0 : closeDelay + 450}ms`,
  })

  return (
    <section
      ref={ref}
      aria-label="Los 12 mandamientos del trader"
      style={{ minHeight: CARD_H }}
      className={`relative overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-b from-violet-50/60 via-white to-amber-50/50 text-center shadow-sm shadow-slate-200/50 transition duration-700 ease-out motion-reduce:transition-none ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
      }`}
    >
      <style>{CSS}</style>

      {/* ---------- escenario del libro ---------- */}
      <div
        className="absolute inset-0"
        style={{ ...(compact ? fade(!open, 0, 0) : {}), perspective: 'none' }}
        aria-hidden={!open || compact}
      >
        {/* resplandor por detrás: halo, rayos lentos y destellos */}
        <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ transform: `translate(-50%, -50%) scale(${open ? 1.7 : 1})`, transition: t(1100) }}>
          <div className="bk-rays absolute -left-[280px] -top-[280px] h-[560px] w-[560px] rounded-full" style={{ opacity: open ? 0.4 : 0.7, transition: reduced ? 'none' : 'opacity 900ms ease', background: 'repeating-conic-gradient(from 0deg, rgba(253,224,138,0.55) 0deg 5deg, transparent 5deg 16deg)', WebkitMaskImage: 'radial-gradient(circle, #000 14%, transparent 66%)', maskImage: 'radial-gradient(circle, #000 14%, transparent 66%)' }} />
          <div className="bk-halo absolute -left-[230px] -top-[230px] h-[460px] w-[460px] rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(253,230,138,0.78) 0%, rgba(196,181,253,0.55) 38%, rgba(125,211,252,0.28) 62%, rgba(125,211,252,0) 72%)' }} />
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2" style={{ opacity: open ? 0.35 : 1, transition: reduced ? 'none' : 'opacity 900ms ease' }}>
          {SPARKS.map((s) => (
            <span
              key={s.x + '-' + s.y}
              className="bk-twinkle absolute block bg-gradient-to-br from-amber-300 to-violet-300"
              style={{ left: s.x, top: s.y, width: s.s, height: s.s, animationDelay: `${s.d}s`, clipPath: 'polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)' }}
            />
          ))}
        </div>

        {/* el libro: se escala y se desplaza para quedar centrado cerrado o abierto */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: 2 * P,
            height: H,
            marginLeft: -P,
            marginTop: -H / 2,
            transform: open ? `scale(${s1}) translateX(0px)` : `scale(${s0}) translateX(${-P / 2}px)`,
            transition: t(open ? 1000 : 900, open ? 0 : 1250),
          }}
        >
          {/* sombra sobre la que "flota" */}
          <div
            className="bk-shadow pointer-events-none absolute left-1/2 rounded-full"
            style={{
              bottom: -34,
              width: 520,
              height: 30,
              marginLeft: -260,
              background: 'radial-gradient(ellipse at center, rgba(15,23,42,0.22), rgba(15,23,42,0) 70%)',
              transform: open ? 'translateX(0px)' : `translateX(${P / 2}px)`,
            }}
          />

          <div className={open ? 'bk-float-soft' : 'bk-float'} style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* hojas que asoman por la derecha (grosor del libro) */}
            {[2, 1, 0].map((i) => (
              <span
                key={'r' + i}
                aria-hidden="true"
                className="absolute"
                style={{ left: P + 17 + i * 6.3, top: 8 + i * 6.3, width: 291, height: 401, background: ['#fffbeb', '#fffdf6', '#ffffff'][i], border: '1px solid #e7dfc6', borderRadius: 6 }}
              />
            ))}
            {/* y por la izquierda cuando está abierto */}
            {[2, 1, 0].map((i) => (
              <span
                key={'l' + i}
                aria-hidden="true"
                className="absolute"
                style={{ left: P - 17 - i * 6.3 - 291, top: 8 + i * 6.3, width: 291, height: 401, background: ['#fffbeb', '#fffdf6', '#ffffff'][i], border: '1px solid #e7dfc6', borderRadius: 6, opacity: open ? 1 : 0, transition: reduced ? 'none' : `opacity 500ms ease ${open ? 1600 : 0}ms` }}
              />
            ))}

            {/* marcador de tela */}
            <span
              aria-hidden="true"
              className="absolute"
              style={{ left: P + P * 0.7 - 14, top: H - 6, width: 28, height: 42, background: '#fda4af', opacity: 0.85, clipPath: 'polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)' }}
            />

            {/* página derecha fija: mandamientos VII – XII */}
            <div className="absolute right-0 top-0" style={{ width: P, height: H }}>
              <Face side="right">
                <CommandmentsPage from={6} page={2} />
              </Face>
            </div>

            {/* hojas que giran sobre el lomo: portada y cuatro hojas */}
            {Array.from({ length: LEAVES }, (_, i) => {
              const angle = open ? -180 : i === 0 && peeking ? -16 : 0
              const delay = busy || i !== 0 ? (open ? OPEN_DELAY[i] : CLOSE_DELAY[i]) : 0
              const dur = busy || i !== 0 ? (open ? OPEN_DUR[i] : CLOSE_DUR[i]) : 520
              const zRight = 10 - i
              const zLeft = 2 + i
              return (
                <div
                  key={i}
                  className="absolute right-0 top-0"
                  style={{
                    width: P,
                    height: H,
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    transform: `perspective(2400px) rotateY(${angle}deg)`,
                    zIndex: open ? zLeft : zRight,
                    // el orden de apilado cambia a mitad del giro, cuando la hoja está de canto
                    transition: reduced ? 'none' : `transform ${dur}ms ${EASE} ${delay}ms, z-index 0s linear ${delay + dur / 2}ms`,
                  }}
                >
                  {i === 0 ? (
                    <>
                      <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                        <CoverFace />
                      </div>
                      <div className="absolute inset-0" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                        <EndPaper />
                      </div>
                    </>
                  ) : (
                    <>
                      <Face side="right">
                        <BlankLines />
                      </Face>
                      <Face side="left" back>
                        {i === LEAVES - 1 ? <CommandmentsPage from={0} page={1} /> : <BlankLines />}
                      </Face>
                    </>
                  )}
                </div>
              )
            })}

            {/* sombra del lomo con el libro abierto */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-0"
              style={{ left: P - 16, width: 32, height: H, zIndex: 20, background: 'linear-gradient(90deg, rgba(90,70,30,0), rgba(90,70,30,0.2), rgba(90,70,30,0))', opacity: open ? 1 : 0, transition: reduced ? 'none' : `opacity 600ms ease ${open ? 1700 : 0}ms` }}
            />

            {/* zona para tocar el libro cerrado */}
            <div
              aria-hidden="true"
              className="absolute right-0 top-0"
              style={{ width: P, height: H, zIndex: 30, cursor: 'pointer', pointerEvents: open ? 'none' : 'auto' }}
              onClick={() => toggle(true)}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            />
          </div>
        </div>
      </div>

      {/* ---------- títulos de la tarjeta (se van al abrir el libro) ---------- */}
      <div className={`z-10 px-6 pt-10 ${open ? 'absolute inset-x-0 top-0' : 'relative'}`} style={fade(!open, backDelay, 0)}>
        <span className="mx-auto mb-3 block h-1 w-8 rounded-full bg-gradient-to-r from-violet-200 to-amber-200" />
        <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">Los 12 mandamientos del trader</h2>
        <p className="mt-1 text-sm text-slate-500">Ábrelo para leer los doce mandamientos.</p>
      </div>

      <button
        ref={openRef}
        type="button"
        onClick={() => toggle(true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        aria-expanded={open}
        aria-label="Abrir Los 12 mandamientos del trader"
        tabIndex={open ? -1 : 0}
        style={fade(!open, backDelay, 0)}
        className="group absolute bottom-8 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-5 py-2 text-sm font-medium text-violet-700 shadow-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-violet-300 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2"
      >
        Abrir el libro
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 10h12M11 5l5 5-5 5" />
        </svg>
      </button>

      {/* ---------- pantallas angostas: las dos páginas una sobre otra ---------- */}
      {compact && (
        <div
          role="group"
          aria-label="Los 12 mandamientos del trader"
          aria-hidden={!open}
          className="relative z-10 mx-auto grid w-full max-w-[22rem] gap-4 px-4 pb-24 pt-6"
          style={{ ...fade(open, 450, 0), position: open ? 'relative' : 'absolute', inset: open ? undefined : 0, pointerEvents: open ? 'auto' : 'none' }}
        >
          {[0, 6].map((from, idx) => (
            <div key={from} className="relative overflow-hidden" style={{ background: PAPER, border: '1px solid #e7dfc6', borderRadius: 10, minHeight: 390 }}>
              <CommandmentsPage from={from} page={idx + 1} />
            </div>
          ))}
        </div>
      )}

      {/* ---------- cerrar el libro ---------- */}
      <button
        ref={closeRef}
        type="button"
        onClick={() => toggle(false)}
        aria-label="Cerrar el libro"
        tabIndex={open ? 0 : -1}
        style={fade(open, closeBtnDelay, 0)}
        className="group absolute bottom-4 left-1/2 z-20 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-violet-200 bg-white/90 px-5 py-2 text-sm font-medium text-violet-700 shadow-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-violet-300 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2"
      >
        <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 10H4M9 5l-5 5 5 5" />
        </svg>
        Cerrar el libro
      </button>
    </section>
  )
}