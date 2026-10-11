import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { CATEGORIES, MISSIONS_BY_CATEGORY } from '../data/catalog'

/* ------------------------------------------------------------------ */
/*  Datos auxiliares                                                   */
/* ------------------------------------------------------------------ */

// Colores de acento para los iconos de categoría (se asignan por posición).
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

// Herramientas prácticas (las 2 originales + Diario de Trading)
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

// TODO: reemplazar por el ranking real (API / contexto)
const TOP_RANKING = [
  { name: 'Juan P.', xp: 4500 },
  { name: 'María S.', xp: 4200 },
  { name: 'Luis R.', xp: 3900 },
  { name: 'Ana G.', xp: 3650 },
]

// TODO: reemplazar por publicaciones reales de la comunidad (API / contexto)
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

/* ------------------------------------------------------------------ */
/*  Componentes pequeños reutilizables                                 */
/* ------------------------------------------------------------------ */

const ToolCard: React.FC<{ tool: (typeof TOOLS)[number] }> = ({ tool }) => (
  <Link
    to={tool.to}
    className="platform-card platform-card-hover p-5 flex flex-col items-center text-center gap-3 block text-decoration-none"
  >
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
      style={{ background: `${tool.color}1f`, color: tool.color }}
    >
      <i className={tool.icon}></i>
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
  // Si tu catálogo trae los módulos, se cuentan; si no, se muestra 5 por defecto.
  const modules: number = cat.modules?.length ?? cat.modulesCount ?? 5

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden text-left platform-card platform-card-hover p-4 flex items-center gap-3 group w-full"
      style={{ backgroundImage: `radial-gradient(circle at 100% 50%, ${a.glow}, transparent 60%)` }}
    >
      <div
        className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-lg"
        style={{ background: a.bg, color: a.fg }}
      >
        <i className={cat.icon}></i>
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-bold text-[var(--text)] truncate">{cat.name}</h3>
        <p className="text-xs text-[var(--text-muted)]">{modules} módulos para explorar</p>
      </div>

      {/* Icono de fondo difuminado */}
      <i
        className={`${cat.icon} absolute right-8 top-1/2 -translate-y-1/2 text-5xl pointer-events-none`}
        style={{ color: a.fg, opacity: 0.1 }}
        aria-hidden="true"
      ></i>
      <i className="fa-solid fa-arrow-up-right-from-square absolute right-4 top-4 text-[10px] text-[var(--text-muted)] group-hover:text-[var(--primary)]"></i>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Página                                                             */
/* ------------------------------------------------------------------ */

export const HomePage: React.FC = () => {
  const { user, isGuest, completeMission } = usePlatform()
  const navigate = useNavigate()

  const [areasOpen, setAreasOpen] = useState(false)
  const [showAllAreas, setShowAllAreas] = useState(false)

  const missionCat = user.interests.includes('trading') ? 'trading' : user.interests[0] || 'trading'
  const mission = MISSIONS_BY_CATEGORY[missionCat] || MISSIONS_BY_CATEGORY.trading
  const today = new Date().toDateString()
  const isMissionDone = user._lastMissionDate === today

  const currentCat = CATEGORIES.find((c) => c.id === missionCat) || CATEGORIES[0]
  // TODO: conecta aquí el progreso real del curso. Por ahora usa user.courseProgress si existe.
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

  /* ---------------- Widgets de la columna derecha ---------------- */

  const ProfileWidget = (
    <div className="platform-card p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center text-lg text-[var(--primary)]">
          <i className="fa-solid fa-user"></i>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-[var(--text)] truncate">
            {(user as any).username || (user as any).name || 'Usuario'}
          </div>
          <div className="text-[11px] text-[var(--text-muted)]">
            Nivel {user.level} &middot; {user.levelLabel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
          <i className="fa-solid fa-fire text-orange-500 text-sm"></i>
          <div className="text-sm font-bold text-[var(--text)] mt-1">{user.streak}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Racha</div>
        </div>
        <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
          <i className="fa-solid fa-star text-yellow-500 text-sm"></i>
          <div className="text-sm font-bold text-[var(--text)] mt-1">{user.level}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Nivel</div>
        </div>
        <div className="p-2 bg-[var(--bg-alt)] rounded border border-[var(--border)]">
          <i className="fa-solid fa-coins text-amber-500 text-sm"></i>
          <div className="text-sm font-bold text-[var(--text)] mt-1">{user.coins}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Monedas</div>
        </div>
      </div>

      <Link to="/perfil" className="w-full platform-btn-secondary py-2 text-xs font-semibold justify-center">
        Ver perfil
      </Link>
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
          className="w-full platform-btn-primary py-1.5 text-xs font-semibold justify-center"
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
    <div className="platform-card p-5 space-y-3">
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
        <span>Mentor IA de Clever</span>
      </div>
      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
        ¿Dudas sobre soportes, velas o gestión de riesgo? Consulta al tutor en cualquier momento.
      </p>
      <Link to="/mentor" className="text-xs text-[var(--primary)] font-semibold hover:underline block pt-1">
        Abrir chat con Mentor &rarr;
      </Link>
    </div>
  )

  /* ================================================================ */
  /*  VISTA INVITADO                                                   */
  /* ================================================================ */
  if (isGuest) {
    return (
      <div className="max-w-6xl mx-auto py-4 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-8 min-w-0">
          {/* Hero compacto */}
          <section className="space-y-3">
            <div className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">
              Plataforma Educativa &middot; Mercado Financiero
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--text)] tracking-tight leading-tight max-w-2xl">
              Aprende trading, finanzas y cultura digital con práctica real.
            </h1>

            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
              Domina el análisis técnico mediante lecciones estructuradas, evaluaciones adaptativas y operaciones
              prácticas en el exchange spot con cotizaciones en vivo.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/diagnostico?cat=trading" className="platform-btn-primary py-2.5 px-5 text-xs font-semibold">
                <span>Hacer examen diagnóstico</span>
              </Link>
              <Link to="/exchange" className="platform-btn-secondary py-2.5 px-5 text-xs font-semibold">
                <span>Ver mercado spot</span>
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]"
              >
                Crear cuenta
              </Link>
            </div>
          </section>

          {/* Áreas de conocimiento desplegables */}
          <section className="platform-card overflow-hidden">
            <button
              type="button"
              onClick={() => setAreasOpen((o) => !o)}
              aria-expanded={areasOpen}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
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
                    className="mx-auto flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
                  >
                    <span>{showAllAreas ? 'Ver menos' : 'Ver más'}</span>
                    <i className={`fa-solid ${showAllAreas ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]`}></i>
                  </button>
                )}
              </div>
            )}
          </section>

          {/* Herramientas prácticas */}
          <section className="space-y-4">
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

        {/* Columna derecha */}
        <aside className="space-y-5">
          {MissionWidget}
          {ProgressWidget}
          {RankingWidget}
          {MentorWidget}
        </aside>
      </div>
    )
  }

  /* ================================================================ */
  /*  VISTA REGISTRADO                                                 */
  /* ================================================================ */
  return (
    <div className="max-w-6xl mx-auto py-4 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
      <div className="space-y-10 min-w-0">
        {/* Continúa donde lo dejaste */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-[var(--text)] tracking-tight">Continúa donde lo dejaste</h2>

          <div
            className="platform-card relative overflow-hidden p-6 sm:p-8 space-y-4"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(10,116,196,0.14) 0%, rgba(99,102,241,0.10) 55%, transparent 100%)',
            }}
          >
            <i
              className={`${currentCat.icon} absolute -right-4 -bottom-6 text-[9rem] pointer-events-none`}
              style={{ color: 'var(--primary)', opacity: 0.08 }}
              aria-hidden="true"
            ></i>

            <div className="flex items-center gap-3 max-w-sm">
              <div className="flex-1 h-2 bg-[var(--bg-alt)] rounded overflow-hidden border border-[var(--border)]">
                <div className="h-full bg-[var(--primary)]" style={{ width: `${courseProgress}%` }}></div>
              </div>
              <span className="text-xs font-mono font-semibold text-[var(--text)]">{courseProgress}%</span>
            </div>

            <div>
              <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">Curso</div>
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

        {/* Comunidad */}
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

        {/* Herramientas prácticas */}
        <section className="space-y-4">
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

      {/* Columna derecha */}
      <aside className="space-y-5">
        {ProfileWidget}
        {MissionWidget}
        {ProgressWidget}
        {MentorWidget}
        {RankingWidget}
      </aside>
    </div>
  )
}
