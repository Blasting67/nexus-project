import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnalysisOptionCard } from '../components/analysis/AnalysisOptionCard'
import { ANALYSIS_OPTIONS } from '../components/analysis/AnalysisOptions'

/* ------------------------------------------------------------------ */
/* Paleta pastel (clases completas para que Tailwind las detecte)      */
/* ------------------------------------------------------------------ */

interface Tone {
  badge: string // fondo del icono
  soft: string // fondo cuando está seleccionado
  hover: string // fondo al pasar el mouse
  border: string // borde cuando está seleccionado
  chip: string // etiqueta pequeña
  dot: string // punto de la línea de tiempo
  text: string // texto de acento
}

const TONES: Tone[] = [
  { badge: 'bg-rose-100', soft: 'bg-rose-100/80', hover: 'hover:bg-rose-100/60', border: 'border-rose-200', chip: 'bg-rose-100 text-rose-700', dot: 'bg-rose-300', text: 'text-rose-700' },
  { badge: 'bg-amber-100', soft: 'bg-amber-100/80', hover: 'hover:bg-amber-100/60', border: 'border-amber-200', chip: 'bg-amber-100 text-amber-800', dot: 'bg-amber-300', text: 'text-amber-800' },
  { badge: 'bg-emerald-100', soft: 'bg-emerald-100/80', hover: 'hover:bg-emerald-100/60', border: 'border-emerald-200', chip: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-300', text: 'text-emerald-700' },
  { badge: 'bg-sky-100', soft: 'bg-sky-100/80', hover: 'hover:bg-sky-100/60', border: 'border-sky-200', chip: 'bg-sky-100 text-sky-700', dot: 'bg-sky-300', text: 'text-sky-700' },
  { badge: 'bg-violet-100', soft: 'bg-violet-100/80', hover: 'hover:bg-violet-100/60', border: 'border-violet-200', chip: 'bg-violet-100 text-violet-700', dot: 'bg-violet-300', text: 'text-violet-700' },
  { badge: 'bg-fuchsia-100', soft: 'bg-fuchsia-100/80', hover: 'hover:bg-fuchsia-100/60', border: 'border-fuchsia-200', chip: 'bg-fuchsia-100 text-fuchsia-700', dot: 'bg-fuchsia-300', text: 'text-fuchsia-700' },
]

/* ------------------------------------------------------------------ */
/* Contenido                                                           */
/* ------------------------------------------------------------------ */

const ANALOGY_STEPS = [
  { icon: '🛒', when: 'Hoy', text: 'Las manzanas están baratas: compras 10 kilos' },
  { icon: '⏳', when: 'La semana siguiente', text: 'Las manzanas escasean' },
  { icon: '💰', when: 'Las vendes', text: 'A un precio más alto' },
]

interface RowItem {
  icon: string
  title: string
  text: string
  tag?: string
}

const CONCEPTS: RowItem[] = [
  { icon: '🧑‍💻', title: 'Trader', text: 'La persona que compra y vende' },
  { icon: '🤝', title: 'Broker', text: 'El intermediario (plataforma)' },
  { icon: '🏛️', title: 'CETES', text: 'Bonos del gobierno, muy seguros' },
  { icon: '🍰', title: 'Acciones', text: 'Pedacitos de una empresa' },
  { icon: '📊', title: 'Índices', text: 'Grupos de acciones (NASDAQ, S&P 500, Dow Jones)' },
  { icon: '🌽', title: 'Commodities', text: 'Cosas reales: maíz, petróleo, oro' },
  { icon: '💱', title: 'Forex', text: 'Cambio de monedas' },
  { icon: '📜', title: 'Derivados', text: 'Contratos sobre precios futuros' },
]

const MARKETS: RowItem[] = [
  { icon: '🏢', title: 'Acciones', text: 'Compras parte de una empresa', tag: 'Apple, Tesla' },
  { icon: '🏦', title: 'Bonos', text: 'Prestas dinero a gobierno o empresa', tag: 'CETES' },
  { icon: '🧺', title: 'ETFs', text: 'Canasta de activos', tag: 'SPY (replica S&P 500)' },
  { icon: '🪙', title: 'Criptoactivos', text: 'Monedas digitales', tag: 'Bitcoin, Ethereum' },
  { icon: '💵', title: 'Forex', text: 'Cambio de divisas', tag: 'Peso/Dólar' },
  { icon: '📝', title: 'Derivados OTC', text: 'Contratos personalizados', tag: 'Swaps, forwards' },
]

const TRADERS = [
  { icon: '⚡', name: 'Scalper', text: 'Compra y vende en segundos', pitch: 'no pierdes ni un segundo.' },
  { icon: '🌞', name: 'Day Trader', text: 'Cierra el mismo día', pitch: 'vives el presente.' },
  { icon: '🌊', name: 'Swing Trader', text: 'Días o semanas', pitch: 'estas al tanto con las noticias y sabes cuando moverte.' },
  { icon: '🏔️', name: 'Position Trader', text: 'Meses', pitch: 'confías en tu análisis y eres paciente.' },
]

/* ------------------------------------------------------------------ */
/* Animación de entrada al hacer scroll                                */
/* ------------------------------------------------------------------ */

/**
 * `shown`: el elemento ya entró en pantalla (dispara la animación de entrada escalonada).
 * `settled`: terminó la entrada; a partir de ahí se quitan los retrasos para que el hover responda al instante.
 */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      setSettled(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!shown || settled) return
    const id = window.setTimeout(() => setSettled(true), 1200)
    return () => window.clearTimeout(id)
  }, [shown, settled])

  return { ref, shown, settled }
}

/* ------------------------------------------------------------------ */
/* Tablas dinámicas (filas interactivas)                               */
/* ------------------------------------------------------------------ */

/** Cada fila entra escalonada, reacciona al hover y, al tocarla, se enfoca y atenúa a las demás. */
const InteractiveRows: React.FC<{ items: RowItem[]; shown: boolean; settled: boolean; label: string }> = ({
  items,
  shown,
  settled,
  label,
}) => {
  const [active, setActive] = useState<number | null>(null)

  return (
    <ul aria-label={label} className="space-y-2">
      {items.map((item, i) => {
        const tone = TONES[i % TONES.length]
        const isActive = active === i
        const dim = active !== null && !isActive

        return (
          <li key={item.title}>
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => setActive(isActive ? null : i)}
              style={{ transitionDelay: settled ? '0ms' : `${i * 70}ms` }}
              className={`group flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition duration-500 ease-out hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none ${tone.hover} ${
                !shown ? 'translate-y-3 opacity-0' : dim ? 'opacity-50' : 'opacity-100'
              } ${isActive ? `${tone.soft} ${tone.border} scale-[1.015] shadow-md` : 'border-transparent bg-white/70'}`}
            >
              <span
                aria-hidden="true"
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tone.badge} ${
                  isActive ? '-rotate-6 scale-110' : ''
                }`}
              >
                {item.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-slate-800">{item.title}</span>
                  {item.tag && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium transition duration-300 group-hover:scale-105 ${tone.chip}`}
                    >
                      {item.tag}
                    </span>
                  )}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-slate-600">{item.text}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

const TableCard: React.FC<{ title: string; hint: string; items: RowItem[]; surface: string }> = ({
  title,
  hint,
  items,
  surface,
}) => {
  const { ref, shown, settled } = useReveal<HTMLElement>()

  return (
    <section ref={ref} aria-label={title} className={`rounded-3xl border p-5 shadow-sm ${surface}`}>
      <header className="mb-4 flex items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        <span className="text-[11px] text-slate-400">{hint}</span>
      </header>
      <InteractiveRows items={items} shown={shown} settled={settled} label={title} />
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Tarjeta principal: ¿Qué es hacer Trading?                           */
/* ------------------------------------------------------------------ */

const TradingIntroCard: React.FC = () => {
  const { ref, shown, settled } = useReveal<HTMLElement>()

  return (
    <section
      ref={ref}
      aria-label="¿Qué es hacer Trading?"
      className="relative overflow-hidden rounded-3xl border border-violet-200/60 bg-gradient-to-br from-violet-20 via-fuchsia-40 to-sky-20 p-6 shadow-sm sm:p-8"
    >
      {/* manchas decorativas */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute -bottom-12 right-0 h-48 w-48 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <div className="relative">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">¿Qué es hacer Trading?</h2>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm">
            🤔Analogía
          </span>
          <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
            Es como ir al tianguis. Ves que las manzanas están baratas hoy, compras 10 kilos, y la semana siguiente
            las vendes más caras porque escasearon.
          </p>
        </div>

        <ol className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
          {ANALOGY_STEPS.flatMap((step, i) => {
            const tone = TONES[i + 3] // sky, violet, fuchsia
            const card = (
              <li
                key={step.when}
                style={{ transitionDelay: settled ? '0ms' : `${i * 150}ms` }}
                className={`group rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-white backdrop-blur-sm transition duration-500 ease-out hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none ${
                  shown ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl transition duration-300 group-hover:-rotate-6 group-hover:scale-110 ${tone.badge}`}
                >
                  {step.icon}
                </span>
                <div className={`text-[11px] font-semibold uppercase tracking-wider ${tone.text}`}>{step.when}</div>
                <p className="mt-0.5 text-sm text-slate-700">{step.text}</p>
              </li>
            )
            if (i === ANALOGY_STEPS.length - 1) return [card]
            return [
              card,
              <li
                key={`arrow-${i}`}
                aria-hidden="true"
                className="flex items-center justify-center text-xl text-violet-300"
              >
                <span className="sm:hidden">↓</span>
                <span className="hidden sm:inline">→</span>
              </li>,
            ]
          })}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Tipos de trader + pregunta final                                    */
/* ------------------------------------------------------------------ */

const TraderTypesCard: React.FC = () => {
  const { ref, shown, settled } = useReveal<HTMLElement>()
  const [picked, setPicked] = useState<number | null>(null)
  const choice = picked !== null ? TRADERS[picked] : null

  return (
    <section
      ref={ref}
      aria-label="Tipos de trader"
      className="rounded-3xl border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 via-violet-50 to-sky-50 p-5 shadow-sm sm:p-6"
    >
      <header className="mb-4">
        <h2 className="text-base font-bold text-slate-800">Tipos de trader</h2>
        <p className="text-xs text-slate-500">De las operaciones más rápidas a las más pacientes</p>
      </header>

      {/* línea de tiempo (solo en pantallas anchas) */}
      <div aria-hidden="true" className="mb-3 hidden md:block">
        <div className="relative grid grid-cols-4">
          <span
            className="absolute inset-x-[12.5%] top-1/2 h-1.5 -translate-y-1/2 rounded-full"
            style={{ background: 'linear-gradient(90deg,#fecdd3,#fde68a,#a7f3d0,#bae6fd)' }}
          />
          {TRADERS.map((t, i) => (
            <span key={t.name} className="relative flex justify-center">
              <span
                className={`h-3.5 w-3.5 rounded-full ring-4 ring-white transition duration-300 ${TONES[i].dot} ${
                  picked === i ? 'scale-150' : ''
                }`}
              />
            </span>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-slate-400">
          <span>Más rápido</span>
          <span>Más paciente</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {TRADERS.map((t, i) => {
          const tone = TONES[i]
          const isPicked = picked === i
          return (
            <button
              key={t.name}
              type="button"
              aria-pressed={isPicked}
              onClick={() => setPicked(isPicked ? null : i)}
              style={{ transitionDelay: settled ? '0ms' : `${i * 90}ms` }}
              className={`group flex flex-col items-center rounded-2xl border p-4 text-center transition duration-500 ease-out hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 motion-reduce:transition-none ${tone.hover} ${
                shown ? 'opacity-100' : 'translate-y-3 opacity-0'
              } ${isPicked ? `${tone.soft} ${tone.border} scale-[1.03] shadow-md` : 'border-transparent bg-white/70'}`}
            >
              <span
                aria-hidden="true"
                className={`mb-2 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl transition duration-300 group-hover:scale-110 ${tone.badge} ${
                  isPicked ? 'animate-[bounce_1s_ease-in-out_2] motion-reduce:animate-none' : ''
                }`}
              >
                {t.icon}
              </span>
              <span className="text-sm font-semibold text-slate-800">{t.name}</span>
              <span className="mt-0.5 text-xs text-slate-600">{t.text}</span>
            </button>
          )
        })}
      </div>

      {/* pregunta final */}
      <div className="mt-6 rounded-2xl bg-white/70 px-4 py-5 text-center shadow-sm ring-1 ring-white">
        <p className="text-base font-bold text-slate-800 sm:text-lg">Y tú, ¿qué tipo de trader quieres ser?</p>
        <p aria-live="polite" className="mt-1.5 min-h-[1.25rem] text-sm text-slate-600">
          {choice ? (
            <>
              Team <span className={`font-semibold ${TONES[picked ?? 0].text}`}>{choice.name}</span>:{' '}
              {choice.pitch}
            </>
          ) : (
            'Toca una opción para elegir.'
          )}
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export const AnalysisPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      <div className="border-b border-[var(--border)] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)] tracking-tight">
            Análisis Técnico
          </h1>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Guía práctica para la interpretación de gráficos de precios y estructuras de mercado.
          </p>
        </div>

        <Link
          to="/exchange"
          className="platform-btn-secondary py-1.5 px-3 text-xs self-start sm:self-auto"
        >
          Ver gráficos en vivo
        </Link>
      </div>

      {/* Introducción al trading */}
      <section aria-label="Introducción al trading" className="space-y-5">
        <TradingIntroCard />

        <div className="grid gap-5 lg:grid-cols-2">
          <TableCard
            title="Conceptos básicos"
            hint=""
            items={CONCEPTS}
            surface="border-sky-100 bg-gradient-to-br from-sky-50 via-white to-emerald-50"
          />
          <TableCard
            title="Mercados donde se opera"
            hint=""
            items={MARKETS}
            surface="border-amber-100 bg-gradient-to-br from-amber-50 via-white to-rose-50"
          />
        </div>

        <TraderTypesCard />
      </section>

      {/* Selector de tipo de análisis: cada tarjeta navega a su ruta */}
      <section aria-label="Tipo de análisis" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ANALYSIS_OPTIONS.map(({ kind, path, ...option }) => (
          <AnalysisOptionCard key={kind} {...option} to={path} />
        ))}
      </section>
    </div>
  )
}