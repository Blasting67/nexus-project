import React from 'react'
import { Link } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS, CATEGORIES } from '../data/catalog'

type StatCardProps = {
  icon: string
  label: string
  value: React.ReactNode
  iconClass?: string
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, iconClass }) => (
  <div className="platform-card p-4 flex items-center gap-3">
    <div
      className={`w-9 h-9 rounded bg-[var(--bg-alt)] border border-[var(--border)] flex items-center justify-center flex-shrink-0 ${
        iconClass || 'text-[var(--primary)]'
      }`}
    >
      <i className={icon}></i>
    </div>
    <div className="min-w-0">
      <div className="text-xl font-bold leading-tight text-[var(--text)]">{value}</div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  </div>
)

export const ProfilePage: React.FC = () => {
  const { user } = usePlatform()

  const displayName = user.name || user.username
  const initials = (displayName || 'U').slice(0, 2).toUpperCase()

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => user.achievements.includes(a.id))
  const lockedAchievements = ACHIEVEMENTS.filter((a) => !user.achievements.includes(a.id))

  // Título destacado: el logro elegido, o el último desbloqueado como fallback
  const featured =
    unlockedAchievements.find((a) => a.id === user.featuredAchievement) ||
    unlockedAchievements[unlockedAchievements.length - 1]

  // XP: solo se muestra si hay un objetivo válido (el sistema de XP aún se está definiendo)
  const hasXp = typeof user.xp === 'number' && user.xpToNext > 0
  const xpPercent = hasXp ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0

  const bannerStyle: React.CSSProperties = user.cover
    ? { backgroundImage: `url(${user.cover})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {
        backgroundImage:
          'linear-gradient(135deg, var(--primary), color-mix(in srgb, var(--primary) 35%, var(--bg-alt)))',
      }

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      {/* Cabecera: banner + avatar + identidad */}
      <div className="platform-card overflow-hidden">
        <div className="h-32 sm:h-40 w-full" style={bannerStyle} aria-hidden="true" />

        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-[var(--surface)] text-[var(--text)] font-bold text-2xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0 overflow-hidden"
              style={{
                border: '3px solid var(--surface)',
                boxShadow: '0 0 0 2px var(--primary)',
              }}
            >
              {user.avatar ? (
                <img src={user.avatar} alt={`Avatar de ${displayName}`} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-center sm:text-left">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-[var(--text)] leading-tight">{displayName}</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs font-mono text-[var(--text-muted)]">@{user.username}</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
                    {user.levelLabel}
                  </span>
                  {featured && (
                    <span className="px-2 py-0.5 rounded border border-[var(--primary)] text-xs text-[var(--primary)] flex items-center gap-1.5">
                      <i className="fa-solid fa-medal text-[10px]"></i>
                      {featured.name}
                    </span>
                  )}
                </div>
              </div>

              <Link to="/personalizacion" className="platform-btn-secondary py-1.5 px-3 text-xs self-center sm:self-auto">
                Editar perfil
              </Link>
            </div>
          </div>

          {user.bio ? (
            <p className="mt-4 text-sm text-[var(--text)] max-w-xl text-center sm:text-left mx-auto sm:mx-0">
              {user.bio}
            </p>
          ) : (
            <p className="mt-4 text-sm text-[var(--text-muted)] text-center sm:text-left">
              <Link to="/personalizacion" className="text-[var(--primary)] hover:underline">
                Agrega una bio
              </Link>{' '}
              para contarle a la comunidad quién eres.
            </p>
          )}

          {/* Progreso de XP */}
          {hasXp && (
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>Nivel {user.level}</span>
                <span>
                  {user.xp} / {user.xpToNext} XP para el nivel {user.level + 1}
                </span>
              </div>
              <div
                className="h-2 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] overflow-hidden"
                role="progressbar"
                aria-valuenow={xpPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progreso de experiencia"
              >
                <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon="fa-solid fa-star" label="Nivel" value={user.level} iconClass="text-yellow-400" />
        <StatCard icon="fa-solid fa-coins" label="Monedas" value={user.coins} iconClass="text-amber-400" />
        <StatCard
          icon="fa-solid fa-fire"
          label={user.streak === 1 ? 'Día de racha' : 'Días de racha'}
          value={user.streak}
          iconClass="text-orange-500"
        />
        <StatCard
          icon="fa-solid fa-trophy"
          label="Logros"
          value={`${unlockedAchievements.length}/${ACHIEVEMENTS.length}`}
        />
      </div>

      {/* Temas y logros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="platform-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
            <span className="font-bold text-[var(--text)]">Temas activos</span>
            <Link to="/explorar" className="text-[var(--primary)] hover:underline">
              Explorar
            </Link>
          </div>

          {user.interests.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {user.interests.map((catId) => {
                const cat = CATEGORIES.find((c) => c.id === catId)
                if (!cat) return null

                return (
                  <span
                    key={cat.id}
                    className="px-2.5 py-1 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text-muted)] flex items-center gap-1.5"
                  >
                    <i className={cat.icon}></i>
                    <span>{cat.name}</span>
                  </span>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">
              Aún no sigues ningún tema.{' '}
              <Link to="/explorar" className="text-[var(--primary)] hover:underline">
                Elige tus primeros temas
              </Link>
              .
            </p>
          )}
        </div>

        <div className="platform-card p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-[var(--border)] pb-2 text-xs">
            <span className="font-bold text-[var(--text)]">Logros ({unlockedAchievements.length})</span>
            <Link to="/logros" className="text-[var(--primary)] hover:underline">
              Ver todos
            </Link>
          </div>

          {unlockedAchievements.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {unlockedAchievements.slice(0, 6).map((ach) => (
                <div
                  key={ach.id}
                  title={ach.name}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text)]"
                >
                  <i className="fa-solid fa-medal text-[var(--primary)]"></i>
                  <span>{ach.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-muted)]">
                Aún no tienes logros. Estos son los próximos que puedes conseguir:
              </p>
              <div className="space-y-2">
                {lockedAchievements.slice(0, 3).map((ach) => (
                  <div
                    key={ach.id}
                    className="flex items-start gap-3 p-2.5 rounded border border-dashed border-[var(--border)]"
                  >
                    <i className="fa-solid fa-lock text-[10px] mt-1 text-[var(--text-muted)]"></i>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[var(--text)]">{ach.name}</div>
                      {(ach as { description?: string }).description && (
                        <div className="text-xs text-[var(--text-muted)]">
                          {(ach as { description?: string }).description}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}