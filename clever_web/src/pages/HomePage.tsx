import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { MISSIONS_BY_CATEGORY, MODULES_BY_CATEGORY } from '../data/catalog'
import { CleverkorMascot3D } from '../components/CleverkorMascot3D'
import { DraggableMascot, type MascotSide } from '../components/DraggableMascot'

const TRADING_MODULES: string[] = MODULES_BY_CATEGORY.trading

const STEPS = [
  { icon: 'fa-solid fa-clipboard-question', title: 'Diagnóstico', text: 'Un examen corto detecta desde dónde empiezas.' },
  { icon: 'fa-solid fa-route', title: 'Tu ruta', text: 'Lecciones ordenadas según tu nivel, una a la vez.' },
  { icon: 'fa-solid fa-chart-line', title: 'Práctica real', text: 'Operas en el exchange spot simulado sin arriesgar dinero.' },
  { icon: 'fa-solid fa-medal', title: 'Sube de nivel', text: 'Ganas XP, monedas y rachas con cada misión diaria.' },
]


const TOP_RANKING = [
  { name: 'Juan P.', xp: 4500 },
  { name: 'María S.', xp: 4200 },
  { name: 'Luis R.', xp: 3900 },
  { name: 'Ana G.', xp: 3650 },
]

const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Juan P.',
    time: '18h',
    channel: 'Trading',
    title: '¿Cómo identifican un buen soporte?',
    body: 'Marqué esta zona en 4H y rebotó dos veces. ¿Opiniones?',
    likes: 7,
    comments: 5,
  },
  {
    id: 2,
    author: 'María S.',
    time: '1d',
    channel: 'General',
    title: 'Terminé mi primer módulo de gestión de riesgo',
    body: 'Lo que más me costó fue entender el stop-loss. Aquí mi resumen.',
    likes: 14,
    comments: 10,
  },
  {
    id: 3,
    author: 'Luis R.',
    time: '2d',
    channel: 'Exchange',
    title: 'Mi portafolio simulado de la semana',
    body: 'Subió 6% en el exchange spot, pero con mucha volatilidad.',
    likes: 9,
    comments: 3,
  },
]

const HOME_STYLES = `
.note-home{--ink:color-mix(in srgb,var(--primary) 86%,var(--text));--ink-2:color-mix(in srgb,#5b3e9e 72%,var(--text));--ink-3:color-mix(in srgb,#a8323e 75%,var(--text));--paper:color-mix(in srgb,var(--primary) 6%,var(--surface));--paper-2:color-mix(in srgb,var(--primary) 11%,var(--surface));--rule:color-mix(in srgb,var(--ink) 22%,transparent);font-family:"Schibsted Grotesk",system-ui,sans-serif;font-size:16px;color:var(--text)}
:root:is([data-theme="dark"],[data-theme="aurora"],[data-theme="neon"],[data-theme="sunset"],[data-theme="ocean"]) .note-home{--ink:color-mix(in srgb,var(--primary) 88%,var(--text));--ink-2:color-mix(in srgb,#b9a4ff 80%,var(--text));--ink-3:color-mix(in srgb,#ff8f9a 82%,var(--text));--paper:color-mix(in srgb,var(--primary) 7%,var(--bg-alt));--paper-2:color-mix(in srgb,var(--primary) 13%,var(--bg-alt))}
.note-display{font-family:"Archivo","Schibsted Grotesk",system-ui,sans-serif;font-stretch:112%;letter-spacing:-0.03em}
.note-wide{font-family:"Archivo","Schibsted Grotesk",system-ui,sans-serif;font-stretch:125%;letter-spacing:.02em}
.note-num{font-variant-numeric:tabular-nums lining-nums}
.note-home ::selection{background:color-mix(in srgb,var(--ink) 25%,transparent)}
.note-paper{background-color:var(--paper);background-image:repeating-linear-gradient(115deg,transparent 0 9px,color-mix(in srgb,var(--ink) 4%,transparent) 9px 10px);border:1px solid var(--rule)}
.note-btn{display:inline-flex;align-items:center;justify-content:center;gap:.55rem;height:3.25rem;padding:0 1.6rem;border-radius:999px;font-family:"Archivo","Schibsted Grotesk",system-ui,sans-serif;font-stretch:108%;font-weight:700;font-size:1rem;letter-spacing:-.005em;transition:transform .16s cubic-bezier(.23,1,.32,1),background-color .2s,border-color .2s,color .2s;cursor:pointer}
.note-btn:active{transform:scale(.97)}
.note-btn:focus-visible{outline:2px solid var(--ink);outline-offset:3px}
.note-btn-ink{background:var(--ink);color:var(--bg)}
.note-btn-ink:hover{background:color-mix(in srgb,var(--ink) 88%,var(--text))}
.note-btn-line{border:1.5px solid color-mix(in srgb,var(--ink) 45%,transparent);color:var(--ink);background:transparent}
.note-btn-line:hover{border-color:var(--ink);background:color-mix(in srgb,var(--ink) 6%,transparent)}
.note-card{background:var(--surface);border:1px solid var(--border);border-radius:20px;backdrop-filter:var(--card-blur);-webkit-backdrop-filter:var(--card-blur)}
.note-link{transition:border-color .2s,transform .3s cubic-bezier(.23,1,.32,1)}
.note-link:hover{border-color:color-mix(in srgb,var(--ink) 45%,var(--border));transform:translateY(-2px)}
.note-rosette{transform-origin:center;transform-box:fill-box;transition:transform 1.6s cubic-bezier(.23,1,.32,1)}
.note-bill:hover .note-rosette{transform:rotate(14deg)}
.note-bill:hover .note-rosette-alt{transform:rotate(-10deg)}
.note-enter{animation:note-enter .9s cubic-bezier(.23,1,.32,1) both}
@keyframes note-enter{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
.note-thread{background:repeating-linear-gradient(180deg,var(--ink-2) 0 14px,color-mix(in srgb,var(--ink-2) 70%,var(--surface)) 14px 16px)}
.note-scroll{animation:note-scroll 22s linear infinite}
@keyframes note-scroll{from{transform:translateX(0)}to{transform:translateX(-400px)}}
.note-shine{background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.2) 50%,transparent 58%);background-size:260% 100%;animation:note-shine 7s ease-in-out infinite}
@keyframes note-shine{0%{background-position:160% 0}60%,100%{background-position:-60% 0}}
.note-ring{background:conic-gradient(from 0deg,var(--ink),var(--ink-2),var(--ink-3),var(--ink));animation:note-spin 8s linear infinite}
@keyframes note-spin{to{transform:rotate(360deg)}}
.rail-fade{-webkit-mask-image:linear-gradient(to right,#000 85%,transparent);mask-image:linear-gradient(to right,#000 85%,transparent)}
@media (prefers-reduced-motion:reduce){
.note-enter,.note-scroll,.note-shine,.note-ring{animation:none!important}
.note-rosette,.note-link,.note-btn{transition:none}
}
`

const guillocheRing = (cx: number, cy: number, radius: number, amp: number, lobes: number, strands: number, twist = 0): string => {
  const steps = 900
  let d = ''
  for (let k = 0; k < strands; k++) {
    const phase = (k / strands) * Math.PI * 2
    for (let s = 0; s <= steps; s++) {
      const t = (s / steps) * Math.PI * 2
      const r = radius + amp * Math.sin(lobes * t + phase) + twist * Math.sin((lobes / 2) * t - phase)
      const x = cx + r * Math.cos(t)
      const y = cy + r * Math.sin(t)
      d += `${s === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    }
  }
  return d
}

const ROSETTE_A = guillocheRing(160, 160, 122, 20, 11, 18) + guillocheRing(160, 160, 80, 14, 8, 14) + guillocheRing(160, 160, 44, 8, 6, 10)
const ROSETTE_B = guillocheRing(160, 160, 126, 18, 14, 16, 6) + guillocheRing(160, 160, 88, 16, 9, 14)
const ROSETTE_SMALL = guillocheRing(50, 50, 36, 8, 7, 12)

const WAVE_LINES = Array.from({ length: 14 }).map((_, i) => {
  const y0 = 10 + i * 7
  let d = `M0 ${y0}`
  for (let x = 0; x <= 600; x += 10) {
    d += ` L${x} ${(y0 + Math.sin(x / 38 + i * 0.45) * 6).toFixed(1)}`
  }
  return d
})

const Rosette: React.FC<{ className?: string; variant?: 'a' | 'b' }> = ({ className = '', variant = 'a' }) => (
  <svg viewBox="0 0 320 320" className={className} aria-hidden="true">
    <path d={variant === 'a' ? ROSETTE_A : ROSETTE_B} fill="none" stroke="var(--ink)" strokeWidth="0.3" strokeOpacity="0.45" className={variant === 'a' ? 'note-rosette' : 'note-rosette note-rosette-alt'} />
  </svg>
)

const SmallRosette: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <path d={ROSETTE_SMALL} fill="none" stroke="var(--ink)" strokeWidth="0.6" strokeOpacity="0.7" />
  </svg>
)

const WaveField: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 600 110" preserveAspectRatio="none" className={className} aria-hidden="true">
    {WAVE_LINES.map((d, i) => (
      <path key={i} d={d} fill="none" stroke="var(--ink)" strokeWidth="0.6" strokeOpacity="0.28" />
    ))}
  </svg>
)

const MICROTEXT = 'CLEVER · TRADING Y FINANZAS · APRENDE PRACTICANDO · '.repeat(14)

const Microtext: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`note-wide overflow-hidden whitespace-nowrap text-[7px] font-semibold leading-none text-[var(--ink)] opacity-60 ${className}`} aria-hidden="true">
    {MICROTEXT}
  </div>
)

const STEP_X = 40
const CLOSES = [112, 98, 104, 84, 92, 70, 78, 58, 72, 96]
const WICKS = [8, 12, 7, 10, 9, 12, 8, 11, 7, 10]
const VOLUME = [14, 22, 12, 26, 16, 30, 18, 28, 20, 24]

const CANDLES = CLOSES.map((close, i) => {
  const open = CLOSES[(i + CLOSES.length - 1) % CLOSES.length]
  const top = Math.min(open, close)
  return { x: 20 + i * STEP_X, top, height: Math.max(Math.max(open, close) - top, 6), wick: WICKS[i], up: close < open }
})

const PRICE_LINE = (() => {
  const pts = [...CLOSES, CLOSES[0]].map((y, i) => ({ x: 20 + i * STEP_X, y }))
  let d = `M${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2
    const my = (pts[i].y + pts[i + 1].y) / 2
    d += ` Q${pts[i].x} ${pts[i].y} ${mx} ${my}`
  }
  d += ` L${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`
  return d
})()

const ChartTile: React.FC<{ dx: number }> = ({ dx }) => (
  <g transform={`translate(${dx} 0)`}>
    {CANDLES.map((c, i) => (
      <rect key={`v${i}`} x={c.x - 7} y={155 - VOLUME[i]} width="14" height={VOLUME[i]} rx="1.5" fill="var(--ink)" fillOpacity="0.14" />
    ))}
    {CANDLES.map((c) => (
      <g key={c.x}>
        <line x1={c.x} x2={c.x} y1={c.top - c.wick} y2={c.top + c.height + c.wick} stroke={c.up ? 'var(--ink)' : 'var(--ink-3)'} strokeWidth="1.6" />
        <rect x={c.x - 6} y={c.top} width="12" height={c.height} rx="1.5" fill={c.up ? 'var(--ink)' : 'var(--ink-3)'} fillOpacity={c.up ? 0.85 : 0.75} />
      </g>
    ))}
    <path d={PRICE_LINE} fill="none" stroke="var(--ink-2)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 5" />
  </g>
)

const ExchangeChart: React.FC = () => (
  <svg className="h-full w-full" viewBox="0 0 400 160" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    {[40, 80, 120].map((y) => (
      <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="var(--rule)" strokeWidth="0.8" />
    ))}
    <g className="note-scroll">
      <ChartTile dx={0} />
      <ChartTile dx={400} />
    </g>
  </svg>
)

const SectionHeading: React.FC<{ title: string; text?: string; action?: React.ReactNode }> = ({ title, text, action }) => (
  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--rule)] pb-5">
    <div className="max-w-2xl">
      <h2 className="note-display text-3xl font-extrabold leading-[1.05] text-[var(--text)] sm:text-[2.6rem]">{title}</h2>
      {text && <p className="mt-3 text-lg leading-relaxed text-[var(--text-muted)]">{text}</p>}
    </div>
    {action}
  </div>
)

const HeroBill: React.FC<{ onWave: () => void; wave: number }> = ({ onWave, wave }) => (
  <section className="note-bill note-paper note-enter relative isolate overflow-hidden rounded-[28px]">
    <Rosette className="pointer-events-none absolute -right-28 -top-36 -z-10 h-[520px] w-[520px] opacity-80" />
    <Rosette variant="b" className="pointer-events-none absolute -bottom-64 -left-40 -z-10 h-[520px] w-[520px] opacity-60" />
    <WaveField className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28 w-full" />

    <div className="absolute inset-x-6 top-4 sm:inset-x-8">
      <Microtext />
    </div>
    <div className="absolute inset-x-6 bottom-4 sm:inset-x-8">
      <Microtext />
    </div>

    <div className="grid gap-10 px-6 pb-14 pt-12 sm:px-10 lg:grid-cols-[1fr_auto_minmax(300px,380px)] lg:gap-12 lg:px-14 lg:pb-16 lg:pt-14">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 text-[var(--ink)]">
          <span className="note-wide text-sm font-extrabold">CLEVER</span>
          <span className="h-px w-10 bg-[var(--rule)]"></span>
          <span className="note-num text-sm font-medium text-[var(--text-muted)]">Serie TF · 000001</span>
        </div>

        <h1 className="note-display mt-10 max-w-[15ch] pr-16 sm:pr-0 text-[clamp(2.6rem,5vw,4.6rem)] font-black leading-[0.98] [font-stretch:100%] text-[var(--text)] [text-wrap:balance]">
          Aprende trading y finanzas con práctica real.
        </h1>

        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-[var(--text-muted)] sm:text-xl">
          Domina el análisis técnico con <strong className="font-semibold text-[var(--text)]">Kor</strong>, evaluaciones adaptativas y operaciones prácticas en el exchange spot con cotizaciones en vivo.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link to="/register" className="note-btn note-btn-ink">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
          <Link to="/diagnostico?cat=trading" className="note-btn note-btn-line">
            Hacer examen diagnóstico
          </Link>
        </div>

        <div className="mt-auto flex items-end gap-4 pt-12">
          <span className="note-display note-num text-6xl font-black leading-none text-[var(--ink)] opacity-90">01</span>
          <span className="pb-1 text-sm leading-snug text-[var(--text-muted)]">
            Emisión de práctica
            <br />
            Sin valor monetario
          </span>
        </div>
      </div>

      <div className="note-thread hidden w-1.5 rounded-full opacity-50 lg:block" aria-hidden="true"></div>

      <div className="relative mx-auto w-full max-w-[380px] self-center">
        <div className="relative aspect-[4/5] w-full">
          <div className="absolute inset-0 rounded-[50%] border border-[var(--rule)]"></div>
          <div className="absolute inset-3 rounded-[50%] border-2 border-[color-mix(in_srgb,var(--ink)_55%,transparent)]"></div>
          <div className="absolute inset-[22px] overflow-hidden rounded-[50%] bg-[var(--paper-2)]">
            <Rosette variant="b" className="absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 opacity-60" />
            <button
              type="button"
              onClick={onWave}
              className="relative block h-full w-full cursor-pointer focus-visible:outline-none"
              aria-label="Saludar a Kor"
            >
              <CleverkorMascot3D height="100%" className="h-full" waveTrigger={wave} />
            </button>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="note-wide text-xs font-bold text-[var(--ink)]">KOR</div>
          <div className="text-sm text-[var(--text-muted)]">Tu mentor en cada lección</div>
        </div>
      </div>
    </div>
  </section>
)

const FirstLessonSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Empieza tu primera lección" text="El camino de Trading y Finanzas está abierto. Entra, recórrelo y da el primer paso." />
    <Link
      to="/aprender?cat=trading"
      className="note-paper note-link group relative isolate grid overflow-hidden rounded-[24px] md:grid-cols-[1fr_auto]"
    >
      <SmallRosette className="pointer-events-none absolute -right-16 -top-16 -z-10 h-64 w-64 opacity-60" />
      <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className="fa-solid fa-chart-line"></i>
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
            <span className="note-wide text-xs font-extrabold text-[var(--ink)]">TRADING Y FINANZAS</span>
            <span className="h-px w-8 bg-[var(--rule)]"></span>
            <span className="note-num">{TRADING_MODULES.length} lecciones</span>
          </div>
          <h3 className="note-display mt-2 text-2xl font-black leading-tight text-[var(--text)] sm:text-3xl">
            Lección 01 · {TRADING_MODULES[0]}
          </h3>
          <p className="mt-2 max-w-xl text-base leading-relaxed text-[var(--text-muted)]">
            Qué es un mercado, cómo funcionan las acciones y por qué se mueve un precio. La base para todo lo que sigue.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-[var(--rule)] p-7 sm:p-9 md:border-l md:border-t-0">
        <span className="note-btn note-btn-ink pointer-events-none">
          Ir a la lección
          <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
        </span>
      </div>
    </Link>
  </section>
)

const CurriculumSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Lo que vas a dominar" text="Un solo camino, de tu primera vela japonesa a operar con disciplina." />
    <ol className="grid gap-x-12 sm:grid-cols-2">
      {TRADING_MODULES.map((title, i) => (
        <li key={title} className="group flex items-baseline gap-5 border-b border-[var(--rule)] py-5">
          <span className="note-display note-num w-10 shrink-0 text-2xl font-black text-[var(--ink)]">{String(i + 1).padStart(2, '0')}</span>
          <span className="note-display text-xl font-semibold leading-snug text-[var(--text)] sm:text-[1.35rem]">{title}</span>
        </li>
      ))}
    </ol>
  </section>
)

const StepsSection: React.FC = () => (
  <section className="space-y-10">
    <SectionHeading title="Cómo funciona" text="Cuatro pasos entre tu primera visita y tu primera operación." />
    <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {STEPS.map((step, i) => (
        <li key={step.title} className="space-y-4">
          <span className="relative flex h-16 w-16 items-center justify-center">
            <SmallRosette className="absolute inset-0 h-full w-full" />
            <span className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
              <i className={`${step.icon} text-sm`}></i>
            </span>
          </span>
          <div>
            <h3 className="note-display flex items-baseline gap-2 text-xl font-extrabold text-[var(--text)]">
              <span className="note-num text-[var(--ink)]">{i + 1}.</span>
              {step.title}
            </h3>
            <p className="mt-2 text-base leading-relaxed text-[var(--text-muted)]">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
)

const ExchangeShowcase: React.FC<{ includeMentor?: boolean }> = ({ includeMentor = true }) => (
  <section data-tour="home-tools" className="space-y-10">
    <SectionHeading title="Herramientas Prácticas" text="Entrena tus decisiones en el exchange spot simulado." />
    <Link to="/exchange" className={`note-paper note-link group relative isolate grid overflow-hidden rounded-[24px] ${includeMentor ? 'lg:grid-cols-[0.9fr_1.1fr]' : ''}`}>
      <div className="flex flex-col p-8 sm:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg)]">
          <i className="fa-solid fa-chart-line"></i>
        </span>
        <h3 className="note-display mt-6 text-3xl font-black text-[var(--text)] sm:text-4xl">Exchange Spot</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-[var(--text-muted)]">
          Opera videojuegos reales de IGDB con fondos de portafolio y gráficas de volumen.
        </p>
        <span className="note-display mt-8 inline-flex items-center gap-2 text-lg font-bold text-[var(--ink)]">
          Abrir Exchange Spot
          <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
        </span>
      </div>
      <div className={`relative min-h-[220px] border-t border-[var(--rule)] bg-[var(--surface)] ${includeMentor ? 'lg:border-l lg:border-t-0' : ''}`}>
        <ExchangeChart />
      </div>
    </Link>
    {includeMentor && (
      <Link to="/mentor" className="note-card note-link group flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] text-[var(--ink)]">
          <i className="fa-solid fa-robot"></i>
        </span>
        <span className="min-w-0 flex-1">
          <span className="note-display block text-xl font-bold text-[var(--text)]">Kor &middot; Mentor IA</span>
          <span className="mt-1 block text-base leading-relaxed text-[var(--text-muted)]">
            ¿Dudas sobre soportes, velas o gestión de riesgo? Kor te orienta en cualquier momento.
          </span>
        </span>
        <span className="note-display inline-flex items-center gap-2 text-base font-bold text-[var(--ink)]">
          Abrir chat con Kor
          <i className="fa-solid fa-arrow-right text-sm transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
        </span>
      </Link>
    )}
  </section>
)

const ClosingNote: React.FC = () => (
  <section className="note-bill relative isolate overflow-hidden rounded-[28px] bg-[var(--ink)] px-8 py-12 text-[var(--bg)] sm:px-14 sm:py-16">
    <svg viewBox="0 0 320 320" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[460px] w-[460px]" aria-hidden="true">
      <path d={ROSETTE_A} fill="none" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.35" className="note-rosette" />
    </svg>
    <div className="max-w-2xl">
      <h2 className="note-display text-4xl font-black leading-[1.02] sm:text-6xl">Tu primera emisión empieza con un diagnóstico.</h2>
      <p className="mt-5 max-w-xl text-lg leading-relaxed opacity-80">
        Crea tu cuenta, haz el examen y Kor arma tu ruta de Trading y Finanzas desde tu nivel real.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/register" className="note-btn bg-[var(--bg)] text-[var(--ink)] hover:opacity-90">
          Crear cuenta gratis
          <i className="fa-solid fa-arrow-right text-sm"></i>
        </Link>
        <Link to="/diagnostico?cat=trading" className="note-btn border-[1.5px] border-current/50 text-[var(--bg)] hover:border-current">
          Hacer examen diagnóstico
        </Link>
      </div>
    </div>
  </section>
)

export const HomePage: React.FC = () => {
  const { user, isGuest, completeMission } = usePlatform()

  const [mascotSide, setMascotSide] = useState<MascotSide>('left')
  const [heroWave, setHeroWave] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)

  const mission = MISSIONS_BY_CATEGORY.trading
  const today = new Date().toDateString()
  const isMissionDone = user._lastMissionDate === today

  const courseProgress: number = Math.min(100, Math.max(0, (user as any).courseProgress?.trading ?? 0))
  const nextLesson: string | undefined = (user as any).nextLesson?.trading
  const modulesDone = Math.min(TRADING_MODULES.length, Math.round((courseProgress / 100) * TRADING_MODULES.length))
  const currentModule = TRADING_MODULES[Math.min(modulesDone, TRADING_MODULES.length - 1)]

  const displayName: string = (user as any).username || (user as any).name || 'Usuario'
  const firstName: string = (user.name || displayName).split(' ')[0]
  const avatarUrl: string | undefined = (user as any).avatar || (user as any).avatarUrl
  const xpPct = Math.min(100, (user.xp / user.xpToNext) * 100)
  const folio = String(
    Array.from(displayName).reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 1000000, 7),
  ).padStart(6, '0')

  if (isGuest) {
    return (
      <div ref={rootRef} className="note-home mx-auto max-w-6xl space-y-28 py-6 sm:space-y-36">
        <style>{HOME_STYLES}</style>
        <HeroBill onWave={() => setHeroWave((w) => w + 1)} wave={heroWave} />
        <FirstLessonSection />
        <CurriculumSection />
        <StepsSection />
        <ExchangeShowcase />
        <ClosingNote />
      </div>
    )
  }

  const ProfileWidget = (
    <div className="note-card relative isolate overflow-hidden">
      <div className="relative h-24 overflow-hidden bg-[var(--ink)] text-[var(--bg)]">
        <svg viewBox="0 0 320 320" className="absolute -right-10 -top-24 h-72 w-72" aria-hidden="true">
          <path d={ROSETTE_B} fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.4" />
        </svg>
        <div className="absolute left-1/2 top-2 h-1.5 w-12 -translate-x-1/2 rounded-full border border-white/30 bg-black/30"></div>
        <div className="note-wide absolute left-4 top-3 text-[10px] font-extrabold opacity-90">CLEVER</div>
        <div className="note-wide absolute right-4 top-3 text-[10px] font-semibold opacity-80">CREDENCIAL</div>
        <div className="note-num absolute bottom-2 left-4 text-[11px] opacity-75">Folio {folio}</div>
      </div>

      <div className="-mt-12 flex justify-center">
        <div className="relative h-[104px] w-[104px]">
          <div className="note-ring absolute inset-0 rounded-full"></div>
          <div className="absolute inset-[4px] flex items-center justify-center overflow-hidden rounded-full bg-[var(--bg)]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-4xl text-[var(--ink)]"></i>
            )}
          </div>
          <div className="note-display note-num absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[var(--surface)] bg-[var(--ink)] text-sm font-extrabold text-[var(--bg)]">
            {user.level}
          </div>
        </div>
      </div>

      <div className="space-y-1.5 px-5 pt-3 text-center">
        <div className="note-display truncate text-2xl font-extrabold text-[var(--text)]">{displayName}</div>
        <span className="inline-block rounded-full border border-[var(--rule)] px-3 py-0.5 text-sm font-medium text-[var(--ink)]">
          Nivel {user.level} &middot; {user.levelLabel}
        </span>
      </div>

      <div className="mx-5 mt-4 grid grid-cols-3 divide-x divide-[var(--rule)] rounded-2xl border border-[var(--rule)]">
        {[
          { value: user.streak, label: 'Racha' },
          { value: user.level, label: 'Nivel' },
          { value: user.coins, label: 'Monedas' },
        ].map((stat) => (
          <div key={stat.label} className="py-2.5 text-center">
            <div className="note-display note-num text-xl font-extrabold text-[var(--text)]">{stat.value}</div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 px-5 pt-4">
        <div className="flex justify-between text-sm text-[var(--text-muted)]">
          <span>Experiencia</span>
          <span className="note-num">
            {user.xp} / {user.xpToNext} XP
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--paper-2)]">
          <div className="h-full rounded-full bg-[var(--ink)] transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" style={{ width: `${xpPct}%` }}></div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <Link to="/perfil" className="note-btn note-btn-line !h-11 w-full">
          Ver perfil
        </Link>
      </div>

      <div className="px-5 py-4">
        <div
          className="h-5 rounded-sm opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, var(--text) 0 2px, transparent 2px 4px, var(--text) 4px 5px, transparent 5px 8px, var(--text) 8px 11px, transparent 11px 13px)',
          }}
        ></div>
      </div>

      <div className="note-shine pointer-events-none absolute inset-0"></div>
    </div>
  )

  const MissionWidget = (
    <div className="note-paper relative isolate overflow-hidden rounded-[20px] p-6">
      <SmallRosette className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-36 w-36 opacity-60" />
      <div className="flex items-center justify-between gap-3">
        <h2 className="note-display text-xl font-extrabold text-[var(--text)]">Misión Diaria</h2>
        <span className="note-display note-num rounded-full border-[1.5px] border-[var(--ink)] px-3 py-0.5 text-sm font-extrabold text-[var(--ink)]">+{mission.xp} XP</span>
      </div>
      <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{mission.text}</p>
      <div className="pt-5">
        {isMissionDone ? (
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--success)] bg-[var(--success-bg)] px-4 py-3 text-base font-medium text-[var(--success)]">
            <i className="fa-solid fa-circle-check"></i>
            <span>Completada hoy. Vuelve mañana por otra.</span>
          </div>
        ) : (
          <button type="button" onClick={() => completeMission('trading')} className="note-btn note-btn-ink w-full">
            <i className="fa-solid fa-check text-sm"></i>
            Marcar como completada
          </button>
        )}
      </div>
    </div>
  )

  const RankingWidget = (
    <div data-tour="home-ranking" className="note-card p-5">
      <div className="flex items-center justify-between">
        <h2 className="note-display text-lg font-extrabold text-[var(--text)]">Top Ranking de Usuarios</h2>
        <Link to="/comunidad" className="text-sm font-medium text-[var(--ink)] hover:underline">
          Ver todo
        </Link>
      </div>
      <ol className="mt-3">
        {TOP_RANKING.map((r, i) => (
          <li key={r.name} className="flex items-center gap-3 border-b border-[var(--rule)] py-2.5 text-[15px] last:border-b-0">
            <span className="note-display note-num w-5 text-base font-extrabold text-[var(--ink)]">{i + 1}</span>
            <span className="flex-1 truncate font-medium text-[var(--text)]">{r.name}</span>
            <span className="note-num text-sm text-[var(--text-muted)]">{r.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  )

  const MentorWidget = (
    <Link to="/mentor" className="note-card note-link group block space-y-2 p-5">
      <h2 className="note-display flex items-center gap-2 text-lg font-extrabold text-[var(--text)]">
        <i className="fa-solid fa-robot text-sm text-[var(--ink)]"></i>
        Kor &middot; Mentor IA
      </h2>
      <p className="text-[15px] leading-relaxed text-[var(--text-muted)]">
        ¿Dudas sobre soportes, velas o gestión de riesgo? Kor te orienta en cualquier momento.
      </p>
      <span className="note-display inline-flex items-center gap-1.5 pt-1 text-base font-bold text-[var(--ink)]">
        Abrir chat con Kor
        <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
      </span>
    </Link>
  )

  return (
    <div ref={rootRef} className="note-home mx-auto max-w-6xl space-y-10 py-6">
      <style>{HOME_STYLES}</style>
      <DraggableMascot side={mascotSide} onSideChange={setMascotSide} anchorRef={rootRef} />

      <h1 className="note-display pr-20 text-4xl font-black leading-[1.02] text-[var(--text)] sm:text-[3.4rem] lg:pr-0">
        Hola, {firstName}.
        <span className="block text-[var(--text-muted)]">Continúa donde lo dejaste.</span>
      </h1>

      <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-16">
          <section className="note-bill note-paper relative isolate order-1 overflow-hidden rounded-[24px] lg:order-none">
            <Rosette className="pointer-events-none absolute -right-40 -top-44 -z-10 h-[440px] w-[440px]" />
            <div className="absolute inset-x-6 top-3">
              <Microtext />
            </div>
            <div className="p-6 pt-10 sm:p-9 sm:pt-12">
              <div className="flex items-center gap-3">
                <span className="note-wide text-xs font-extrabold text-[var(--ink)]">TRADING Y FINANZAS</span>
                <span className="h-px w-8 bg-[var(--rule)]"></span>
                <span className="note-num text-sm text-[var(--text-muted)]">
                  Módulo {String(Math.min(modulesDone + 1, TRADING_MODULES.length)).padStart(2, '0')} de {String(TRADING_MODULES.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="note-display mt-4 max-w-[18ch] text-3xl font-black leading-[1.02] text-[var(--text)] sm:text-[2.6rem]">
                {nextLesson || currentModule}
              </h2>

              <div className="mt-7 grid grid-cols-8 gap-1.5" aria-label={`Progreso del curso: ${courseProgress}%`}>
                {TRADING_MODULES.map((title, i) => (
                  <span
                    key={title}
                    title={title}
                    className={`h-2.5 rounded-full ${i < modulesDone ? 'bg-[var(--ink)]' : i === modulesDone ? 'bg-[color-mix(in_srgb,var(--ink)_45%,transparent)]' : 'bg-[var(--paper-2)]'}`}
                  ></span>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-sm text-[var(--text-muted)]">
                <span>
                  {modulesDone} de {TRADING_MODULES.length} módulos completados
                </span>
                <span className="note-num">{courseProgress}%</span>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link to="/aprender?cat=trading" className="note-btn note-btn-ink">
                  <i className="fa-solid fa-play text-sm"></i>
                  Seguir nivel
                </Link>
                <Link to="/aprender?cat=trading&view=path" className="note-btn note-btn-line">
                  Ver camino completo
                </Link>
              </div>
            </div>
          </section>

          <section className="order-4 min-w-0 space-y-6 lg:order-none">
            <SectionHeading
              title="Únete a la comunidad"
              text="Lo que otros estudiantes están compartiendo."
              action={
                <Link to="/comunidad" className="note-display group inline-flex shrink-0 items-center gap-1.5 text-base font-bold text-[var(--ink)]">
                  Ir a Comunidad
                  <i className="fa-solid fa-arrow-right text-xs transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1"></i>
                </Link>
              }
            />
            <div className="rail-fade -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 pr-16">
              {COMMUNITY_POSTS.map((p) => (
                <Link key={p.id} to="/comunidad" className="note-card note-link block w-[80%] shrink-0 snap-start space-y-3 p-5 sm:w-72">
                  <div className="flex items-center gap-3">
                    <span className="note-display flex h-10 w-10 items-center justify-center rounded-full border border-[var(--rule)] text-base font-extrabold text-[var(--ink)]">
                      {p.author.charAt(0)}
                    </span>
                    <div className="leading-tight">
                      <div className="text-[15px] font-semibold text-[var(--text)]">
                        {p.author} <span className="font-normal text-[var(--text-muted)]">&middot; {p.time}</span>
                      </div>
                      <div className="text-sm text-[var(--text-muted)]">#{p.channel}</div>
                    </div>
                  </div>
                  <h3 className="note-display text-lg font-bold leading-snug text-[var(--text)]">{p.title}</h3>
                  <p className="line-clamp-2 text-[15px] text-[var(--text-muted)]">{p.body}</p>
                  <div className="flex items-center gap-4 pt-1 text-sm text-[var(--text-muted)]">
                    <span className="note-num flex items-center gap-1.5">
                      <i className="fa-regular fa-heart"></i>
                      {p.likes}
                    </span>
                    <span className="note-num flex items-center gap-1.5">
                      <i className="fa-regular fa-comment"></i>
                      {p.comments}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="order-5 lg:order-none">
            <ExchangeShowcase includeMentor={false} />
          </div>
        </div>

        <aside className="contents lg:flex lg:flex-col lg:gap-5">
          <div className="order-2 lg:order-none">{ProfileWidget}</div>
          <div className="order-3 lg:order-none">{MissionWidget}</div>
          <div className="order-6 lg:order-none">{MentorWidget}</div>
          <div className="order-7 lg:order-none">{RankingWidget}</div>
        </aside>
      </div>
    </div>
  )
}
