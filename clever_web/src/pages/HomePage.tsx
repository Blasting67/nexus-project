import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MISSIONS_BY_CATEGORY } from '../data/catalog'
import { DraggableMascot, type MascotSide } from '../components/DraggableMascot'

const ACCENTS = [
  { fg: '#2563eb', bg: 'rgba(37,99,235,0.12)', glow: 'rgba(37,99,235,0.10)' },
  { fg: '#ea580c', bg: 'rgba(234,88,12,0.12)', glow: 'rgba(234,88,12,0.10)' },
  { fg: '#7c3aed', bg: 'rgba(124,58,237,0.12)', glow: 'rgba(124,58,237,0.10)' },
  { fg: '#d97706', bg: 'rgba(217,119,6,0.12)', glow: 'rgba(217,119,6,0.10)' },
  { fg: '#16a34a', bg: 'rgba(22,163,74,0.12)', glow: 'rgba(22,163,74,0.10)' },
  { fg: '#0891b2', bg: 'rgba(8,145,178,0.12)', glow: 'rgba(8,145,178,0.10)' },
  { fg: '#4f46e5', bg: 'rgba(79,70,229,0.12)', glow: 'rgba(79,70,229,0.10)' },
  { fg: '#db2777', bg: 'rgba(219,39,119,0.12)', glow: 'rgba(219,39,119,0.10)' },
]

const TOOLS = [
  {
    to: '/exchange',
    icon: 'fa-solid fa-chart-line',
    title: 'Exchange Spot',
    desc: 'Opera videojuegos reales de IGDB con fondos de portafolio y gráficas de volumen.',
    color: '#0a74c4',
  },
  {
    to: '/experiencias',
    icon: 'fa-solid fa-bolt',
    title: 'Desafíos y Quizzes',
    desc: 'Evalúa tus conocimientos con escenarios de mercado y análisis situacionales.',
    color: '#6366f1',
  },
  {
    to: '/diario',
    icon: 'fa-solid fa-book-open',
    title: 'Diario de Trading',
    desc: 'Registra tus operaciones, analiza tus decisiones y mejora tu desempeño.',
    color: '#16a34a',
  },
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
    channel: 'Videojuegos',
    title: 'Mi portafolio simulado de la semana',
    body: 'Subió 6% en el exchange spot, pero con mucha volatilidad.',
    likes: 9,
    comments: 3,
  },
]

const HOME_STYLES = `
.ico{display:inline-block;transform-origin:center}
.group:hover .ico-wiggle{animation:ico-wiggle .5s ease-in-out infinite}
.group:hover .ico-tilt{animation:ico-tilt .7s ease-in-out infinite}
.group:hover .ico-flip{animation:ico-flip 1s ease-in-out infinite}
.group:hover .ico-bounce{animation:ico-bounce .6s ease-in-out infinite}
.group:hover .ico-rise{animation:ico-rise .8s ease-in-out infinite}
.group:hover .ico-pour{animation:ico-pour 1s ease-in-out infinite}
.group:hover .ico-spin{animation:ico-spin 1.6s linear infinite}
.group:hover .ico-flash{animation:ico-flash .6s ease-in-out infinite}
.group:hover .ico-pop{animation:ico-pop .7s ease-in-out infinite}
@keyframes ico-wiggle{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-3px) rotate(-14deg)}75%{transform:translateX(3px) rotate(14deg)}}
@keyframes ico-tilt{0%,100%{transform:rotate(0) scale(1)}30%{transform:rotate(-12deg) scale(1.12)}70%{transform:rotate(10deg) scale(1.12)}}
@keyframes ico-flip{0%{transform:perspective(160px) rotateY(0)}50%{transform:perspective(160px) rotateY(180deg) scale(1.1)}100%{transform:perspective(160px) rotateY(360deg)}}
@keyframes ico-bounce{0%,100%{transform:translateY(0) rotate(0)}40%{transform:translateY(-7px) rotate(-8deg)}70%{transform:translateY(0) rotate(6deg)}}
@keyframes ico-rise{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.15)}}
@keyframes ico-pour{0%,100%{transform:rotate(0)}40%,60%{transform:rotate(-28deg) translateY(-2px)}}
@keyframes ico-spin{to{transform:rotate(360deg)}}
@keyframes ico-flash{0%,100%{transform:scale(1);opacity:1}30%{transform:scale(1.3);opacity:.7}50%{transform:scale(.9);opacity:1}70%{transform:scale(1.25);opacity:.8}}
@keyframes ico-pop{0%,100%{transform:scale(1)}50%{transform:scale(1.25)}}

.learn-grad{background:linear-gradient(120deg,rgba(10,116,196,.18),rgba(99,102,241,.14),rgba(16,185,129,.13),rgba(10,116,196,.18));background-size:300% 300%;animation:learn-shift 12s ease-in-out infinite}
@keyframes learn-shift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.learn-dot{animation:learn-float 6s ease-in-out infinite}
@keyframes learn-float{0%,100%{transform:translateY(0);opacity:.2}50%{transform:translateY(-16px);opacity:.65}}

.learn-scroll{animation:learn-scroll 18s linear infinite}
@keyframes learn-scroll{from{transform:translateX(0)}to{transform:translateX(-400px)}}
.learn-candle{transform-box:fill-box;transform-origin:center;animation:learn-candle 3.6s ease-in-out infinite}
@keyframes learn-candle{0%,100%{transform:scaleY(.9)}50%{transform:scaleY(1.07)}}
.learn-dash{stroke-dasharray:4 6;animation:learn-dash 1.4s linear infinite}
@keyframes learn-dash{to{stroke-dashoffset:-20}}
.learn-live{transform-box:fill-box;transform-origin:center;animation:learn-live 2.2s ease-out infinite}
@keyframes learn-live{0%{transform:scale(.6);opacity:.9}100%{transform:scale(3);opacity:0}}

.profile-banner{background:linear-gradient(120deg,#0a74c4,#6366f1,#8b5cf6,#0a74c4);background-size:300% 300%;animation:learn-shift 10s ease-in-out infinite}
.profile-grid{background-image:linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px);background-size:18px 18px}
.profile-ring{background:conic-gradient(from 0deg,#0a74c4,#8b5cf6,#16a34a,#f59e0b,#0a74c4);animation:profile-spin 6s linear infinite}
@keyframes profile-spin{to{transform:rotate(360deg)}}
.profile-orb{animation:learn-float 7s ease-in-out infinite}
.profile-shine{background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.28) 50%,transparent 58%);background-size:260% 100%;animation:profile-shine 6s ease-in-out infinite}
@keyframes profile-shine{0%{background-position:160% 0}60%,100%{background-position:-60% 0}}

`

const iconAnim = (icon: string = ''): string => {
  const i = icon.toLowerCase()
  if (/gamepad|dice|puzzle|joystick/.test(i)) return 'ico-wiggle'
  if (/film|clapper|video|tv|ticket/.test(i)) return 'ico-tilt'
  if (/book|scroll|journal|pen|note/.test(i)) return 'ico-flip'
  if (/music|headphones|guitar|microphone|record/.test(i)) return 'ico-bounce'
  if (/landmark|building|monument|column|chart|coins|trend|arrow-up/.test(i)) return 'ico-rise'
  if (/flask|vial|microscope|brain/.test(i)) return 'ico-pour'
  if (/globe|earth|atom|compass|gear/.test(i)) return 'ico-spin'
  if (/bolt|fire|zap/.test(i)) return 'ico-flash'
  return 'ico-pop'
}

const TILE_W = 400
const STEP = 40
const X0 = 20
const CLOSES = [112, 98, 104, 84, 92, 70, 78, 58, 72, 96]
const WICKS = [8, 12, 7, 10, 9, 12, 8, 11, 7, 10]
const VOLUME = [14, 22, 12, 26, 16, 30, 18, 28, 20, 24]

const CANDLE_DEFS = CLOSES.map((close, i) => {
  const open = CLOSES[(i + CLOSES.length - 1) % CLOSES.length]
  const top = Math.min(open, close)
  const bottom = Math.max(open, close)
  return {
    x: X0 + i * STEP,
    top,
    height: Math.max(bottom - top, 6),
    wick: WICKS[i],
    up: close < open,
  }
})

const LINE_D = (() => {
  const pts = [...CLOSES, CLOSES[0]].map((y, i) => ({ x: X0 + i * STEP, y }))
  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 })
  let d = `M${pts[0].x} ${pts[0].y}`
  const m0 = mid(pts[0], pts[1])
  d += ` L${m0.x} ${m0.y}`
  for (let i = 1; i < pts.length - 1; i++) {
    const m = mid(pts[i], pts[i + 1])
    d += ` Q${pts[i].x} ${pts[i].y} ${m.x} ${m.y}`
  }
  const last = pts[pts.length - 1]
  d += ` L${last.x} ${last.y}`
  return d
})()

const DOTS = [
  { x: 60, y: 30 }, { x: 150, y: 52 }, { x: 230, y: 24 },
  { x: 300, y: 40 }, { x: 350, y: 20 }, { x: 100, y: 46 },
]

const ChartTile: React.FC<{ dx: number }> = ({ dx }) => (
  <g transform={`translate(${dx} 0)`}>
    {CANDLE_DEFS.map((c, i) => (
      <rect key={`v${i}`} x={c.x - 7} y={155 - VOLUME[i]} width="14" height={VOLUME[i]} rx="2" fill="var(--primary)" fillOpacity="0.14" />
    ))}
    {CANDLE_DEFS.map((c, i) => {
      const color = c.up ? '#16a34a' : '#ef4444'
      return (
        <g key={c.x} className="learn-candle" style={{ animationDelay: `${i * 0.35}s` }}>
          <line x1={c.x} x2={c.x} y1={c.top - c.wick} y2={c.top + c.height + c.wick} stroke={color} strokeOpacity="0.45" strokeWidth="2" strokeLinecap="round" />
          <rect x={c.x - 7} y={c.top} width="14" height={c.height} rx="3" fill={color} fillOpacity="0.38" />
        </g>
      )
    })}
    <path d={LINE_D} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </g>
)

const LearningBackground: React.FC = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
    <div className="absolute inset-0 learn-grad"></div>
    <svg
      className="absolute right-0 top-0 h-full w-full sm:w-[72%]"
      viewBox="0 0 400 160"
      preserveAspectRatio="xMaxYMid slice"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, #000 40%)',
        maskImage: 'linear-gradient(to right, transparent 0%, #000 40%)',
      }}
    >
      {[40, 80, 120].map((y) => (
        <line key={y} x1="0" x2="400" y1={y} y2={y} stroke="var(--primary)" strokeOpacity="0.1" />
      ))}

      <g className="learn-scroll">
        <ChartTile dx={0} />
        <ChartTile dx={TILE_W} />
      </g>

      <line className="learn-dash" x1="0" x2="400" y1="64" y2="64" stroke="#16a34a" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="388" cy="64" r="4" fill="#16a34a" />
      <circle className="learn-live" cx="388" cy="64" r="4" fill="none" stroke="#16a34a" strokeWidth="1.5" />

      {DOTS.map((d, i) => (
        <circle key={i} className="learn-dot" cx={d.x} cy={d.y} r="2.5" fill="#8b5cf6" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}
    </svg>
  </div>
)

const ToolCard: React.FC<{ tool: (typeof TOOLS)[number] }> = ({ tool }) => (
  <Link
    to={tool.to}
    className="platform-card platform-card-hover group p-5 flex flex-col items-center text-center gap-3 block text-decoration-none"
  >
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
      style={{ background: `${tool.color}1f`, color: tool.color }}
    >
      <i className={`${tool.icon} ico ${iconAnim(tool.icon)}`}></i>
    </div>
    <h3 className="text-sm font-bold text-[var(--text)]">{tool.title}</h3>
    <p className="text-xs text-[var(--text-muted)] leading-relaxed">{tool.desc}</p>
  </Link>
)

const CategoryCard: React.FC<{
  cat: any
  index: number
  onClick: () => void
}> = ({ cat, index, onClick }) => {
  const a = ACCENTS[index % ACCENTS.length]
  const modules: number = cat.modules?.length ?? cat.modulesCount ?? 5

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden text-left platform-card platform-card-hover p-4 flex items-center gap-3 group w-full"
      style={{ backgroundImage: `radial-gradient(circle at 100% 50%, ${a.glow}, transparent 60%)` }}
    >
      <div
        className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 group-hover:scale-110"
        style={{ background: a.bg, color: a.fg }}
      >
        <i className={`${cat.icon} ico ${iconAnim(cat.icon)}`}></i>
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-[var(--text)] truncate">{cat.name}</h3>
        <p className="text-xs text-[var(--text-muted)]">{modules} módulos para explorar</p>
      </div>

      <i
        className={`${cat.icon} absolute right-8 top-1/2 -translate-y-1/2 text-5xl pointer-events-none`}
        style={{ color: a.fg, opacity: 0.1 }}
        aria-hidden="true"
      ></i>
      <i className="fa-solid fa-arrow-up-right-from-square absolute right-4 top-4 text-[10px] text-[var(--text-muted)] group-hover:text-[var(--primary)]"></i>
    </button>
  )
}

export const HomePage: React.FC = () => {
  const { user, isGuest, completeMission } = usePlatform()
  const navigate = useNavigate()

  const [areasOpen, setAreasOpen] = useState(false)
  const [showAllAreas, setShowAllAreas] = useState(false)
  const [mascotSide, setMascotSide] = useState<MascotSide>('left')
  const rootRef = useRef<HTMLDivElement>(null)

  const missionCat = user.interests.includes('trading') ? 'trading' : user.interests[0] || 'trading'
  const mission = MISSIONS_BY_CATEGORY[missionCat] || MISSIONS_BY_CATEGORY.trading
  const today = new Date().toDateString()
  const isMissionDone = user._lastMissionDate === today

  const currentCat = CATEGORIES.find((c) => c.id === missionCat) || CATEGORIES[0]
  const courseProgress: number = Math.min(100, Math.max(0, (user as any).courseProgress?.[missionCat] ?? 0))
  const nextLesson: string = (user as any).nextLesson?.[missionCat] ?? 'Siguiente lección'

  const handleCategoryClick = (catId: string) => {
    if (isGuest) {
      navigate(`/diagnostico?cat=${catId}`)
    } else {
      if (!user.interests.includes(catId)) {
        user.interests.push(catId)
      }
      navigate('/aprender')
    }
  }

  const visibleCats = showAllAreas ? CATEGORIES : CATEGORIES.slice(0, 4)

  const displayName: string = (user as any).username || (user as any).name || 'Usuario'
  const avatarUrl: string | undefined = (user as any).avatar || (user as any).avatarUrl
  const xpPct = Math.min(100, (user.xp / user.xpToNext) * 100)

  const ProfileWidget = (
    <div className="platform-card relative isolate overflow-hidden p-0">
      <div className="relative h-24 profile-banner overflow-hidden">
        <div className="absolute inset-0 profile-grid opacity-60"></div>
        <div className="profile-orb absolute -left-4 top-6 w-16 h-16 rounded-full bg-white/25 blur-xl"></div>
        <div
          className="profile-orb absolute right-2 -top-2 w-20 h-20 rounded-full bg-fuchsia-300/30 blur-xl"
          style={{ animationDelay: '2s' }}
        ></div>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-black/30 border border-white/30"></div>
        <div className="absolute top-3 left-4 text-[10px] font-mono font-bold tracking-widest text-white/90">
          CLEVER
        </div>
        <div className="absolute top-3 right-4 text-[10px] font-mono tracking-widest text-white/80">
          CREDENCIAL
        </div>
      </div>

      <div className="-mt-12 flex justify-center">
        <div className="relative w-[104px] h-[104px]">
          <div className="absolute inset-0 rounded-full profile-ring"></div>
          <div className="absolute inset-[4px] rounded-full bg-[var(--bg)] flex items-center justify-center overflow-hidden">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <i className="fa-solid fa-user text-4xl text-[var(--primary)]"></i>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[var(--primary)] text-white border-2 border-[var(--bg)] flex items-center justify-center text-xs font-bold shadow">
            {user.level}
          </div>
        </div>
      </div>

      <div className="text-center px-5 pt-3 space-y-1.5">
        <div className="text-lg font-extrabold text-[var(--text)] tracking-tight truncate">{displayName}</div>
        <span className="inline-block text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--primary)]">
          Nivel {user.level} &middot; {user.levelLabel}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-5 pt-4">
        <div className="p-2 bg-[var(--bg-alt)] rounded-lg border border-[var(--border)] text-center">
          <i className="fa-solid fa-fire text-orange-500 text-sm"></i>
          <div className="text-sm font-bold text-[var(--text)] mt-1">{user.streak}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Racha</div>
        </div>
        <div className="p-2 bg-[var(--bg-alt)] rounded-lg border border-[var(--border)] text-center">
          <i className="fa-solid fa-star text-yellow-500 text-sm"></i>
          <div className="text-sm font-bold text-[var(--text)] mt-1">{user.level}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Nivel</div>
        </div>
        <div className="p-2 bg-[var(--bg-alt)] rounded-lg border border-[var(--border)] text-center">
          <i className="fa-solid fa-coins text-amber-500 text-sm"></i>
          <div className="text-sm font-bold text-[var(--text)] mt-1">{user.coins}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Monedas</div>
        </div>
      </div>

      <div className="px-5 pt-4 space-y-1">
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
          <span>XP</span>
          <span>
            {user.xp} / {user.xpToNext}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg-alt)] rounded overflow-hidden">
          <div className="h-full bg-[var(--primary)]" style={{ width: `${xpPct}%` }}></div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <Link to="/perfil" className="w-full platform-btn-secondary py-2 text-xs font-semibold justify-center">
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

      <div className="absolute inset-0 pointer-events-none profile-shine"></div>
    </div>
  )

  const MissionWidget = (
    <div className="platform-card p-5 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[var(--text)]">Misión Diaria</span>
        <span className="text-[10px] font-mono text-[var(--primary)]">+{mission.xp} XP</span>
      </div>

      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{mission.text}</p>

      {isMissionDone ? (
        <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1.5 pt-1">
          <i className="fa-solid fa-check text-[10px]"></i>
          <span>Completada hoy</span>
        </div>
      ) : (
        <button
          onClick={() => completeMission(missionCat)}
          className="w-full platform-btn-primary py-1.5 text-xs font-semibold justify-center cursor-pointer"
        >
          Marcar como completada
        </button>
      )}
    </div>
  )

  const ProgressWidget = (
    <div className="platform-card p-5 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[var(--text)]">Progreso de Usuario</span>
        <span className="text-[10px] font-mono text-[var(--text-muted)]">{user.levelLabel}</span>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
          <span>Nivel {user.level}</span>
          <span>
            {user.xp} / {user.xpToNext} XP
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--bg-alt)] rounded overflow-hidden">
          <div
            className="h-full bg-[var(--primary)]"
            style={{ width: `${Math.min(100, (user.xp / user.xpToNext) * 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[var(--border)] text-xs text-center font-mono">
        <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
          <div className="text-[10px] text-[var(--text-muted)]">Racha</div>
          <div className="font-bold text-[var(--text)]">{user.streak} días</div>
        </div>
        <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
          <div className="text-[10px] text-[var(--text-muted)]">Monedas</div>
          <div className="font-bold text-[var(--text)]">{user.coins}</div>
        </div>
      </div>
    </div>
  )

  const RankingWidget = (
    <div data-tour="home-ranking" className="platform-card p-5 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[var(--text)] flex items-center gap-1.5">
          <i className="fa-solid fa-trophy text-amber-500 text-[11px]"></i>
          Top Ranking de Usuarios
        </span>
        <Link to="/comunidad" className="text-[10px] text-[var(--primary)] hover:underline">
          Ver todo
        </Link>
      </div>

      <ol className="space-y-1.5">
        {TOP_RANKING.map((r, i) => (
          <li
            key={r.name}
            className="flex items-center gap-2.5 p-2 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-xs"
          >
            <span
              className="w-5 h-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{
                background: i === 0 ? 'rgba(245,158,11,0.18)' : 'transparent',
                color: i === 0 ? '#d97706' : 'var(--text-muted)',
              }}
            >
              {i + 1}
            </span>
            <span className="flex-1 truncate font-semibold text-[var(--text)]">{r.name}</span>
            <span className="font-mono text-[11px] text-[var(--text-muted)]">{r.xp} XP</span>
          </li>
        ))}
      </ol>
    </div>
  )

  const MentorWidget = (
    <div className="p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded space-y-2">
      <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
        <i className="fa-solid fa-robot text-[10px] text-[var(--primary)]"></i>
        <span>Kor &middot; Mentor IA</span>
      </div>
      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
        ¿Dudas sobre soportes, velas o gestión de riesgo? Kor te orienta en cualquier momento.
      </p>
      <Link to="/mentor" className="text-xs text-[var(--primary)] font-semibold hover:underline block pt-1">
        Abrir chat con Kor &rarr;
      </Link>
    </div>
  )

  if (isGuest) {
    return (
      <div ref={rootRef} className="max-w-6xl mx-auto py-6 space-y-12">
        <style>{HOME_STYLES}</style>
        <DraggableMascot side={mascotSide} onSideChange={setMascotSide} anchorRef={rootRef} />
        <section className="flex items-center min-h-[380px]">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
              <i className="fa-solid fa-sparkles text-[10px]"></i>
              <span>Cleverkor &middot; Mascota Oficial Kor</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight">
              Aprende trading, finanzas y cultura digital con práctica real.
            </h1>

            <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed max-w-xl">
              Domina el análisis técnico con <strong>Kor</strong>, la mascota inteligente de Cleverkor, evaluaciones adaptativas y operaciones prácticas en el exchange spot con cotizaciones en vivo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/diagnostico?cat=trading" className="platform-btn-primary py-2.5 px-5 text-xs font-semibold">
                <i className="fa-solid fa-graduation-cap text-xs"></i>
                <span>Hacer examen diagnóstico</span>
              </Link>
              <Link to="/exchange" className="platform-btn-secondary py-2.5 px-5 text-xs font-semibold">
                <i className="fa-solid fa-chart-line text-xs"></i>
                <span>Ver mercado spot</span>
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Crear cuenta
              </Link>
            </div>
          </div>

        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
          <div className="space-y-8 min-w-0">
            <section className="platform-card overflow-hidden">
              <button
                type="button"
                onClick={() => setAreasOpen((o) => !o)}
                aria-expanded={areasOpen}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <i className="fa-solid fa-book-open text-[var(--primary)]"></i>
                  <span>
                    <span className="block text-base font-bold text-[var(--text)]">Áreas de Conocimiento</span>
                    <span className="block text-xs text-[var(--text-muted)]">
                      Selecciona una categoría para comenzar tu ruta de estudio.
                    </span>
                  </span>
                </span>
                <i
                  className={`fa-solid fa-chevron-down text-[var(--text-muted)] transition-transform ${
                    areasOpen ? 'rotate-180' : ''
                  }`}
                ></i>
              </button>

              {areasOpen && (
                <div className="px-5 pb-5 space-y-4 border-t border-[var(--border)] pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {visibleCats.map((cat, i) => (
                      <CategoryCard key={cat.id} cat={cat} index={i} onClick={() => handleCategoryClick(cat.id)} />
                    ))}
                  </div>

                  {CATEGORIES.length > 4 && (
                    <button
                      type="button"
                      onClick={() => setShowAllAreas((s) => !s)}
                      className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      <span>{showAllAreas ? 'Ver menos' : 'Ver más'}</span>
                      <i className={`fa-solid ${showAllAreas ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                    </button>
                  )}
                </div>
              )}
            </section>

            <section data-tour="home-tools" className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-[var(--text)] tracking-tight">Herramientas Prácticas</h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Entrena tus decisiones con el mercado spot y desafíos.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TOOLS.map((t) => (
                  <ToolCard key={t.to} tool={t} />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-5">
            {RankingWidget}
            {MentorWidget}
          </aside>
        </div>
      </div>
    )
  }

  return (
    <div ref={rootRef} className="max-w-6xl mx-auto py-6 space-y-12">
      <style>{HOME_STYLES}</style>
      <DraggableMascot side={mascotSide} onSideChange={setMascotSide} anchorRef={rootRef} />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start">
        <div className="space-y-10 min-w-0">
          <section className="space-y-4 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text)] tracking-tight">Continúa donde lo dejaste</h2>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--primary)] bg-[var(--surface-alt)] px-2.5 py-1 rounded border border-[var(--border)]">
                <i className="fa-solid fa-robot text-[10px]"></i>
                <span>Kor &middot; Mentor Activo</span>
              </div>
            </div>

            <div className="platform-card relative isolate overflow-hidden p-6 sm:p-8 space-y-4">
              <LearningBackground />

              <div className="flex items-center gap-3 max-w-sm">
                <div className="flex-1 h-2 bg-[var(--bg-alt)] rounded overflow-hidden border border-[var(--border)]">
                  <div className="h-full bg-[var(--primary)]" style={{ width: `${courseProgress}%` }}></div>
                </div>
                <span className="text-xs font-mono font-semibold text-[var(--text)]">{courseProgress}%</span>
              </div>

              <div>
                <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Curso activo</div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] tracking-tight">
                  {currentCat.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-1">Próxima lección: {nextLesson}</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 relative">
                <Link to={`/aprender?cat=${missionCat}`} className="platform-btn-primary py-2.5 px-5 text-xs font-semibold">
                  Seguir nivel
                </Link>
                <Link
                  to={`/aprender?cat=${missionCat}&view=path`}
                  className="platform-btn-secondary py-2.5 px-5 text-xs font-semibold"
                >
                  Ver camino completo
                </Link>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[var(--text)] tracking-tight">Únete a la comunidad</h2>
              <Link to="/comunidad" className="text-xs text-[var(--primary)] font-medium hover:underline">
                Ir a Comunidad
              </Link>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {COMMUNITY_POSTS.map((p) => (
                <Link
                  key={p.id}
                  to="/comunidad"
                  className="platform-card platform-card-hover shrink-0 w-64 sm:w-72 snap-start p-4 space-y-3 block text-decoration-none"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-[11px] font-bold text-[var(--primary)]">
                      {p.author.charAt(0)}
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-bold text-[var(--text)]">
                        {p.author} <span className="font-normal text-[var(--text-muted)]">&middot; {p.time}</span>
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">#{p.channel}</div>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-[var(--text)] leading-snug">{p.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2">{p.body}</p>

                  <div className="flex items-center gap-4 pt-1 text-[11px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-regular fa-heart"></i>
                      {p.likes}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fa-regular fa-comment"></i>
                      {p.comments}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section data-tour="home-tools" className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[var(--text)] tracking-tight">Herramientas Prácticas</h2>
              <p className="text-xs text-[var(--text-muted)]">
                Entrena tus decisiones con el mercado spot y desafíos.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TOOLS.map((t) => (
                <ToolCard key={t.to} tool={t} />
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          {ProfileWidget}
          {MissionWidget}
          {ProgressWidget}
          {MentorWidget}
          {RankingWidget}
        </aside>
      </div>
    </div>
  )
}
