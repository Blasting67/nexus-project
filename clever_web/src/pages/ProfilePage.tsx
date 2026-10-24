import React, { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS, CATEGORIES } from '../data/catalog'
import { resolveAvatarSrc } from '../data/avatarPresets'
import {
  DEFAULT_BANNER_A,
  DEFAULT_BANNER_B,
  DEFAULT_CUSTOMIZATION,
  MAX_PINNED_ACHIEVEMENTS,
  MAX_STATUS_LENGTH,
  STAT_OPTIONS,
  STATUS_ICONS,
} from '../data/profileCustomizationOptions'
import { ProfileStudio, STUDIO_TAB_IDS } from '../components/profile/ProfileStudio'
import type { StudioTabId } from '../components/profile/ProfileStudio'
import {
  AvatarFrame,
  CountUp,
  LevelJourney,
  PROFILE_STYLES,
  ProfileBanner,
  StreakCalendar,
  TiltCard,
} from '../components/profile/ProfileVisuals'
import { exportProfileCard } from '../components/profile/profileCard'
import { loadProfileCustomization, saveProfileCustomization } from '../services/profileCustomizationService'
import type { ProfileCustomization, StatId } from '../types/profileCustomization'

type AchievementItem = {
  id: string
  name: string
  description?: string
  icon?: string
}

type ProfileTab = 'overview' | 'achievements' | 'topics'

type AchievementFilter = 'all' | 'unlocked' | 'locked'

type ToastFunction = (message: string, type: 'success' | 'error') => void

const PROFILE_TABS: { id: ProfileTab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Resumen', icon: 'fa-solid fa-gauge-high' },
  { id: 'achievements', label: 'Logros', icon: 'fa-solid fa-trophy' },
  { id: 'topics', label: 'Temas', icon: 'fa-solid fa-layer-group' },
]

const FILTERS: { id: AchievementFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'unlocked', label: 'Desbloqueados' },
  { id: 'locked', label: 'Bloqueados' },
]

const STAT_COLORS: Record<StatId, string> = {
  level: '#eab308',
  coins: '#f59e0b',
  streak: '#f97316',
  achievements: '#0ea5e9',
  topics: '#8b5cf6',
}

const getAchievementIcon = (achievement: AchievementItem) =>
  achievement.icon && achievement.icon.includes('fa-') ? achievement.icon : 'fa-solid fa-medal'

export const ProfilePage: React.FC = () => {
  const platform = usePlatform()
  const { user } = platform
  const showToast = (platform as unknown as { showToast?: ToastFunction }).showToast

  const [saved, setSaved] = useState<ProfileCustomization>(() => loadProfileCustomization(user.username))
  const [draft, setDraft] = useState<ProfileCustomization>(saved)
  const [studioOpen, setStudioOpen] = useState(false)
  const [studioTab, setStudioTab] = useState<StudioTabId>('banner')
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')
  const [filter, setFilter] = useState<AchievementFilter>('all')
  const [isExporting, setIsExporting] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [editingStatus, setEditingStatus] = useState(false)
  const [statusDraft, setStatusDraft] = useState('')
  const [statusIconDraft, setStatusIconDraft] = useState(DEFAULT_CUSTOMIZATION.statusIcon)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  useEffect(() => {
    const loaded = loadProfileCustomization(user.username)
    setSaved(loaded)
    setDraft(loaded)
  }, [user.username])

  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved)

  useEffect(() => {
    const requested = searchParams.get('studio')
    if (requested && STUDIO_TAB_IDS.includes(requested as StudioTabId)) {
      setStudioTab(requested as StudioTabId)
      setStudioOpen(true)
      setSearchParams({}, { replace: true })
    }
  }, [])

  useEffect(() => {
    if (!studioOpen) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (isDirty) setConfirmDiscard(true)
      else setStudioOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [studioOpen, isDirty])

  const active = studioOpen ? draft : saved

  const displayName = user.name || user.username
  const avatarSrc = resolveAvatarSrc(user.avatar, user.username)
  const initials = (displayName || 'U').slice(0, 2).toUpperCase()

  const allAchievements = ACHIEVEMENTS as unknown as AchievementItem[]
  const unlockedAchievements = allAchievements.filter((a) => user.achievements.includes(a.id))
  const lockedAchievements = allAchievements.filter((a) => !user.achievements.includes(a.id))
  const nextAchievement = lockedAchievements[0]

  const featured =
    unlockedAchievements.find((a) => a.id === user.featuredAchievement) ||
    unlockedAchievements[unlockedAchievements.length - 1]

  const pinnedItems = active.pinnedAchievements
    .map((id) => unlockedAchievements.find((a) => a.id === id))
    .filter((a): a is AchievementItem => Boolean(a))

  const hasXp = typeof user.xp === 'number' && user.xpToNext > 0
  const xpPercent = hasXp ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0

  const colorA = active.bannerColorA || DEFAULT_BANNER_A
  const colorB = active.bannerColorB || DEFAULT_BANNER_B
  const frameColor = active.frameColor || 'var(--primary)'
  const spacing = active.density === 'compact' ? 'space-y-4' : 'space-y-6'

  const followedCategories = CATEGORIES.filter((c) => user.interests.includes(c.id))
  const otherCategories = CATEGORIES.filter((c) => !user.interests.includes(c.id))

  const filteredAchievements = useMemo(() => {
    if (filter === 'unlocked') return unlockedAchievements
    if (filter === 'locked') return lockedAchievements
    return allAchievements
  }, [filter, allAchievements, unlockedAchievements, lockedAchievements])

  const statValues: Record<StatId, { value: number; suffix?: string; label: string }> = {
    level: { value: user.level, label: 'Nivel' },
    coins: { value: user.coins, label: 'Monedas' },
    streak: { value: user.streak, label: user.streak === 1 ? 'Día de racha' : 'Días de racha' },
    achievements: {
      value: unlockedAchievements.length,
      suffix: `/${allAchievements.length}`,
      label: 'Logros',
    },
    topics: { value: user.interests.length, label: 'Temas activos' },
  }

  const openStudio = (tab: StudioTabId) => {
    setDraft(saved)
    setConfirmDiscard(false)
    setStudioTab(tab)
    setStudioOpen(true)
  }

  const handleDraftChange = (patch: Partial<ProfileCustomization>) => {
    setDraft((current) => ({ ...current, ...patch }))
  }

  const handleSave = () => {
    const ok = saveProfileCustomization(user.username, draft)
    if (ok) {
      setSaved(draft)
      setStudioOpen(false)
      setConfirmDiscard(false)
      showToast?.('Personalización guardada', 'success')
    } else {
      showToast?.('No se pudo guardar la personalización', 'error')
    }
  }

  const handleReset = () => {
    setDraft(DEFAULT_CUSTOMIZATION)
  }

  const handleRequestClose = () => {
    if (isDirty) setConfirmDiscard(true)
    else setStudioOpen(false)
  }

  const handleDiscard = () => {
    setDraft(saved)
    setConfirmDiscard(false)
    setStudioOpen(false)
  }

  const startStatusEdit = () => {
    setStatusDraft(saved.status)
    setStatusIconDraft(saved.statusIcon)
    setEditingStatus(true)
  }

  const cancelStatusEdit = () => {
    setEditingStatus(false)
  }

  const commitStatus = () => {
    const next = { ...saved, status: statusDraft.trim(), statusIcon: statusIconDraft }
    const ok = saveProfileCustomization(user.username, next)
    if (!ok) {
      showToast?.('No se pudo guardar el estado', 'error')
      return
    }
    setSaved(next)
    setDraft((current) => ({ ...current, status: next.status, statusIcon: next.statusIcon }))
    setEditingStatus(false)
    showToast?.(next.status ? 'Estado actualizado' : 'Estado eliminado', 'success')
  }

  const handleTogglePin = (id: string) => {
    const has = saved.pinnedAchievements.includes(id)
    if (!has && saved.pinnedAchievements.length >= MAX_PINNED_ACHIEVEMENTS) {
      showToast?.(`Solo puedes fijar ${MAX_PINNED_ACHIEVEMENTS} logros`, 'error')
      return
    }
    const next = {
      ...saved,
      pinnedAchievements: has
        ? saved.pinnedAchievements.filter((a) => a !== id)
        : [...saved.pinnedAchievements, id],
    }
    saveProfileCustomization(user.username, next)
    setSaved(next)
    setDraft((current) => ({ ...current, pinnedAchievements: next.pinnedAchievements }))
  }

  const handleExport = async () => {
    if (isExporting) return
    setIsExporting(true)
    try {
      await exportProfileCard({
        displayName,
        username: user.username,
        level: user.level,
        levelLabel: user.levelLabel,
        coins: user.coins,
        streak: user.streak,
        achievementsUnlocked: unlockedAchievements.length,
        achievementsTotal: allAchievements.length,
        avatar: avatarSrc,
        shape: active.avatarShape,
        initials,
        colorA: active.bannerColorA,
        colorB: active.bannerColorB,
        status: active.status,
      })
      showToast?.('Tarjeta descargada', 'success')
    } catch {
      showToast?.('No se pudo generar la tarjeta', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const heroStyle: React.CSSProperties = active.glow
    ? { boxShadow: `0 20px 50px -22px ${colorA}` }
    : {}

  const tabIndex = PROFILE_TABS.findIndex((t) => t.id === activeTab)

  return (
    <div className={`max-w-5xl mx-auto py-4 ${spacing}`}>
      <style>{PROFILE_STYLES}</style>

      <section className="pf-rise platform-card overflow-hidden transition-shadow" style={heroStyle}>
        <ProfileBanner
          style={active.bannerStyle}
          colorA={colorA}
          colorB={colorB}
          speed={active.bannerSpeed}
          cover={user.cover || undefined}
          className="h-40 sm:h-56"
        />

        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-20">
            <div className="mx-auto sm:mx-0 flex-shrink-0">
              <AvatarFrame
                src={avatarSrc}
                initials={initials}
                alt={`Avatar de ${displayName}`}
                shape={active.avatarShape}
                frame={active.frameStyle}
                frameColor={frameColor}
                showLevelRing={active.showLevelRing && hasXp}
                progress={xpPercent}
                level={user.level}
              />
            </div>

            <div className="flex-1 min-w-0 text-center sm:text-left sm:pb-2 space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text)] leading-tight truncate">
                {displayName}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-mono text-[var(--text-muted)]">@{user.username}</span>
                <span className="px-2 py-0.5 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
                  {user.levelLabel}
                </span>
                {featured && (
                  <span className="px-2 py-0.5 rounded-full border border-[var(--primary)] text-xs text-[var(--primary)] flex items-center gap-1.5">
                    <i className="fa-solid fa-medal text-[10px]"></i>
                    {featured.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:pb-2">
              <button
                type="button"
                onClick={() => openStudio('banner')}
                className="platform-btn-primary py-2 px-3.5 text-xs font-semibold cursor-pointer"
              >
                <i className="fa-solid fa-wand-magic-sparkles mr-1.5"></i>
                Personalizar
              </button>
              <Link to="/personalizacion" className="platform-btn-secondary py-2 px-3.5 text-xs font-semibold">
                <i className="fa-solid fa-pen mr-1.5"></i>
                Editar datos
              </Link>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="platform-btn-secondary py-2 px-3.5 text-xs font-semibold cursor-pointer disabled:opacity-60"
              >
                {isExporting ? (
                  <i className="fa-solid fa-circle-notch fa-spin mr-1.5"></i>
                ) : (
                  <i className="fa-solid fa-download mr-1.5"></i>
                )}
                Tarjeta
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            {editingStatus ? (
              <div className="flex w-full flex-col gap-2 rounded-xl border border-[var(--primary)] bg-[var(--bg-alt)] p-2.5 sm:w-auto sm:min-w-[22rem]">
                <div className="flex items-center gap-2">
                  <i className={`${statusIconDraft} w-5 text-center text-[var(--primary)]`}></i>
                  <input
                    autoFocus
                    type="text"
                    value={statusDraft}
                    maxLength={MAX_STATUS_LENGTH}
                    onChange={(event) => setStatusDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') commitStatus()
                      if (event.key === 'Escape') cancelStatusEdit()
                    }}
                    placeholder="Qué estás haciendo ahora"
                    aria-label="Tu estado"
                    className="flex-1 bg-transparent text-xs text-[var(--text)] outline-none"
                  />
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {statusDraft.length}/{MAX_STATUS_LENGTH}
                  </span>
                  <button
                    type="button"
                    onClick={commitStatus}
                    aria-label="Guardar estado"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--primary-text)] cursor-pointer"
                  >
                    <i className="fa-solid fa-check text-xs"></i>
                  </button>
                  <button
                    type="button"
                    onClick={cancelStatusEdit}
                    aria-label="Cancelar"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)] cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-xs"></i>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {STATUS_ICONS.map((item) => (
                    <button
                      key={item.icon}
                      type="button"
                      title={item.label}
                      aria-label={item.label}
                      onClick={() => setStatusIconDraft(item.icon)}
                      className={`flex h-7 w-7 items-center justify-center rounded-lg border text-xs transition-colors cursor-pointer ${
                        statusIconDraft === item.icon
                          ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-text)]'
                          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                      }`}
                    >
                      <i className={item.icon}></i>
                    </button>
                  ))}
                </div>
              </div>
            ) : active.status ? (
              <button
                type="button"
                onClick={startStatusEdit}
                title="Editar estado"
                className="group inline-flex items-center gap-2 self-center rounded-full border border-[var(--border)] bg-[var(--bg-alt)] px-3 py-1.5 text-xs text-[var(--text)] transition-colors hover:border-[var(--primary)] sm:self-auto cursor-pointer"
              >
                <i className={`${active.statusIcon} text-[var(--primary)]`}></i>
                {active.status}
                <i className="fa-solid fa-pen text-[9px] text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={startStatusEdit}
                className="inline-flex items-center gap-2 self-center rounded-full border border-dashed border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)] sm:self-auto cursor-pointer"
              >
                <i className="fa-solid fa-plus text-[10px]"></i>
                Agregar un estado
              </button>
            )}

            {user.bio ? (
              <p className="text-sm text-[var(--text)] text-center sm:text-left">{user.bio}</p>
            ) : (
              <p className="text-sm text-[var(--text-muted)] text-center sm:text-left">
                <Link to="/personalizacion" className="text-[var(--primary)] hover:underline">
                  Agrega una bio
                </Link>{' '}
                para contarle a la comunidad quién eres.
              </p>
            )}
          </div>

          {hasXp && (
            <div className="mt-5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span className="font-semibold text-[var(--text)]">Nivel {user.level}</span>
                <span>
                  {user.xp} / {user.xpToNext} XP para el nivel {user.level + 1}
                </span>
              </div>
              <div
                className="relative h-3 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] overflow-hidden"
                role="progressbar"
                aria-valuenow={xpPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progreso de experiencia"
              >
                <div
                  className="pf-xp-fill h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.max(xpPercent, 3)}%`, background: `linear-gradient(90deg, ${colorA}, ${colorB})` }}
                />
                {[25, 50, 75].map((mark) => (
                  <span
                    key={mark}
                    className="absolute top-0 h-full w-px bg-[var(--border)]"
                    style={{ left: `${mark}%` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <div className={`grid gap-3 grid-cols-2 ${active.visibleStats.length >= 4 ? 'md:grid-cols-4' : active.visibleStats.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {STAT_OPTIONS.filter((option) => active.visibleStats.includes(option.id)).map((option, index) => {
          const stat = statValues[option.id]
          const color = STAT_COLORS[option.id]
          return (
            <TiltCard
              key={option.id}
              enabled={active.tilt}
              className="pf-rise platform-card p-4 flex items-center gap-3 overflow-hidden"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
              >
                <i className={`${option.icon} ${option.id === 'streak' && user.streak > 0 ? 'pf-flame' : ''}`}></i>
              </div>
              <div className="min-w-0" style={{ animationDelay: `${index * 80}ms` }}>
                <div className="text-2xl font-extrabold leading-tight text-[var(--text)]">
                  <CountUp value={stat.value} />
                  {stat.suffix && <span className="text-sm font-semibold text-[var(--text-muted)]">{stat.suffix}</span>}
                </div>
                <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
              </div>
            </TiltCard>
          )
        })}
      </div>

      <div className="platform-card p-1.5">
        <div className="relative grid grid-cols-3">
          <div
            className="absolute top-0 left-0 h-full w-1/3 rounded-lg bg-[var(--primary)] transition-transform duration-300"
            style={{ transform: `translateX(${tabIndex * 100}%)` }}
          />
          {PROFILE_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative z-10 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                activeTab === tab.id ? 'text-white' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <i className={tab.icon}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div key={activeTab} className={`pf-rise ${spacing}`}>
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className={`lg:col-span-3 ${spacing}`}>
                {active.showStreakCalendar && (
                  <div className="platform-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                        <i className="fa-solid fa-calendar-days text-[var(--primary)]"></i>
                        Calendario de racha
                      </h2>
                      <span className="text-xs text-[var(--text-muted)]">
                        {user.streak} {user.streak === 1 ? 'día seguido' : 'días seguidos'}
                      </span>
                    </div>
                    <StreakCalendar streak={user.streak} />
                  </div>
                )}

                {active.showLevelJourney && (
                  <div className="platform-card p-5 space-y-4">
                    <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                      <i className="fa-solid fa-route text-[var(--primary)]"></i>
                      Ruta de niveles
                    </h2>
                    <LevelJourney level={user.level} xp={user.xp} xpToNext={user.xpToNext} />
                  </div>
                )}

                {!active.showStreakCalendar && !active.showLevelJourney && (
                  <div className="platform-card p-6 text-center space-y-2">
                    <p className="text-sm text-[var(--text-muted)]">Ocultaste los paneles de actividad.</p>
                    <button
                      type="button"
                      onClick={() => openStudio('showcase')}
                      className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Volver a mostrarlos
                    </button>
                  </div>
                )}
              </div>

              <div className={`lg:col-span-2 ${spacing}`}>
                {user.goal && (
                  <div className="platform-card p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                        <i className="fa-solid fa-flag-checkered text-[var(--primary)]"></i>
                        Mi meta
                      </h2>
                      <Link to="/personalizacion" className="text-xs text-[var(--primary)] hover:underline">
                        Editar
                      </Link>
                    </div>
                    <p className="text-sm text-[var(--text)]">{user.goal}</p>
                  </div>
                )}

                <div className="platform-card p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                      <i className="fa-solid fa-thumbtack text-[var(--primary)]"></i>
                      Vitrina
                    </h2>
                    <button
                      type="button"
                      onClick={() => openStudio('showcase')}
                      className="text-xs text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Editar
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: MAX_PINNED_ACHIEVEMENTS }, (_, i) => {
                      const item = pinnedItems[i]
                      if (!item) {
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => (unlockedAchievements.length > 0 ? openStudio('showcase') : setActiveTab('achievements'))}
                            className="aspect-square rounded-xl border border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-1 text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                          >
                            <i className="fa-solid fa-plus text-sm"></i>
                            <span className="text-[10px]">Fijar</span>
                          </button>
                        )
                      }
                      return (
                        <div
                          key={item.id}
                          title={item.name}
                          className="pf-float aspect-square rounded-xl flex flex-col items-center justify-center gap-1.5 p-2 text-center text-white"
                          style={{
                            background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
                            animationDelay: `${i * 0.4}s`,
                          }}
                        >
                          <i className={`${getAchievementIcon(item)} text-xl`}></i>
                          <span className="text-[10px] font-semibold leading-tight line-clamp-2">{item.name}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {nextAchievement && (
                  <div className="platform-card p-5 space-y-3">
                    <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
                      <i className="fa-solid fa-bullseye text-[var(--primary)]"></i>
                      Próximo logro
                    </h2>
                    <div className="flex items-start gap-3 rounded-xl border border-dashed border-[var(--border)] p-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--bg-alt)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0">
                        <i className="fa-solid fa-lock"></i>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-[var(--text)]">{nextAchievement.name}</div>
                        {nextAchievement.description && (
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">{nextAchievement.description}</div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('achievements')}
                      className="text-xs font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                    >
                      Ver todos los logros
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'achievements' && (
          <>
            <div className="platform-card p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[var(--text)]">
                  {unlockedAchievements.length} de {allAchievements.length} desbloqueados
                </span>
                <span className="text-[var(--text-muted)]">
                  {allAchievements.length > 0 ? Math.round((unlockedAchievements.length / allAchievements.length) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--bg-alt)] border border-[var(--border)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${allAchievements.length > 0 ? (unlockedAchievements.length / allAchievements.length) * 100 : 0}%`,
                    background: `linear-gradient(90deg, ${colorA}, ${colorB})`,
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {FILTERS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
                      filter === item.id
                        ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                        : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredAchievements.map((achievement) => {
                const unlocked = user.achievements.includes(achievement.id)
                const pinned = saved.pinnedAchievements.includes(achievement.id)
                return (
                  <TiltCard
                    key={achievement.id}
                    enabled={active.tilt && unlocked}
                    className={`platform-card p-4 flex items-start gap-3 ${unlocked ? '' : 'opacity-70'}`}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={
                        unlocked
                          ? { background: `linear-gradient(135deg, ${colorA}, ${colorB})`, color: '#ffffff' }
                          : { background: 'var(--bg-alt)', color: 'var(--text-muted)' }
                      }
                    >
                      <i className={unlocked ? getAchievementIcon(achievement) : 'fa-solid fa-lock'}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold text-[var(--text)]">{achievement.name}</div>
                      {achievement.description && (
                        <div className="text-xs text-[var(--text-muted)] mt-0.5">{achievement.description}</div>
                      )}
                      <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                        {unlocked ? 'Desbloqueado' : 'Bloqueado'}
                      </div>
                    </div>
                    {unlocked && (
                      <button
                        type="button"
                        onClick={() => handleTogglePin(achievement.id)}
                        title={pinned ? 'Quitar de la vitrina' : 'Fijar en la vitrina'}
                        aria-label={pinned ? 'Quitar de la vitrina' : 'Fijar en la vitrina'}
                        className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs transition-colors cursor-pointer ${
                          pinned
                            ? 'border-[var(--primary)] bg-[var(--primary)] text-white'
                            : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                        }`}
                      >
                        <i className="fa-solid fa-thumbtack"></i>
                      </button>
                    )}
                  </TiltCard>
                )
              })}
            </div>
          </>
        )}

        {activeTab === 'topics' && (
          <>
            <div className="platform-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text)]">Temas que sigues</h2>
                <Link to="/aprender" className="text-xs text-[var(--primary)] hover:underline">
                  Explorar
                </Link>
              </div>
              {followedCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {followedCategories.map((category) => (
                    <Link
                      key={category.id}
                      to="/aprender"
                      className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-3 transition-all hover:-translate-y-0.5 hover:border-[var(--primary)]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-lg text-[var(--primary)] transition-transform group-hover:scale-110">
                        <i className={category.icon}></i>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-[var(--text)] truncate">{category.name}</div>
                        <div className="text-[11px] text-[var(--text-muted)]">Continuar aprendiendo</div>
                      </div>
                      <i className="fa-solid fa-arrow-right text-xs text-[var(--text-muted)] transition-transform group-hover:translate-x-1"></i>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[var(--text-muted)]">
                  Aún no sigues ningún tema.{' '}
                  <Link to="/aprender" className="text-[var(--primary)] hover:underline">
                    Elige tus primeros temas
                  </Link>
                  .
                </p>
              )}
            </div>

            {otherCategories.length > 0 && (
              <div className="platform-card p-5 space-y-4">
                <h2 className="text-sm font-bold text-[var(--text)]">Descubre más</h2>
                <div className="flex flex-wrap gap-2">
                  {otherCategories.map((category) => (
                    <Link
                      key={category.id}
                      to="/aprender"
                      className="inline-flex items-center gap-2 rounded-full border border-dashed border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      <i className={category.icon}></i>
                      {category.name}
                      <i className="fa-solid fa-plus text-[9px]"></i>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ProfileStudio
        open={studioOpen}
        tab={studioTab}
        onTabChange={setStudioTab}
        draft={draft}
        onChange={handleDraftChange}
        onSave={handleSave}
        onReset={handleReset}
        onClose={handleRequestClose}
        isDirty={isDirty}
        confirmDiscard={confirmDiscard}
        onDiscard={handleDiscard}
        onKeepEditing={() => setConfirmDiscard(false)}
        unlockedAchievements={unlockedAchievements.map((a) => ({ id: a.id, name: a.name }))}
        hasCover={Boolean(user.cover)}
      />
    </div>
  )
}