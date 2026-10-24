import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { ACHIEVEMENTS, MODULES_BY_CATEGORY } from '../data/catalog'
import { resolveAvatarSrc } from '../data/avatarPresets'
import { LEARN_WORLDS, MAX_PINNED_ACHIEVEMENTS, STAT_OPTIONS } from '../data/profileCustomizationOptions'
import { NOTE_STYLES, Rosette } from '../components/note/NoteKit'
import { ProfileStudio, STUDIO_TAB_IDS } from '../components/profile/ProfileStudio'
import type { StudioTabId } from '../components/profile/ProfileStudio'
import { CountUp, LevelJourney, PROFILE_STYLES, StreakCalendar } from '../components/profile/ProfileVisuals'
import { CardHero, CredentialHero, LAYOUT_STYLES, OfficeHero, getFolio } from '../components/profile/ProfileLayouts'
import type { AchievementItem, HeroProps } from '../components/profile/ProfileLayouts'
import { exportProfileCard } from '../components/profile/profileCard'
import { useProfileCustomization } from '../services/profileCustomizationService'
import type { StatId } from '../types/profileCustomization'

const STAT_TONES: Record<StatId, string> = {
  level: 'var(--ink-2)',
  coins: '#d99a1e',
  streak: 'var(--ink-3)',
  achievements: 'var(--ink)',
  topics: 'var(--ink)',
}

const PAGE_STYLES = `
.pp-stamp-in{animation:pp-stamp .55s cubic-bezier(.23,1,.32,1) both}
@keyframes pp-stamp{0%{opacity:0;transform:scale(1.5) rotate(var(--r,0deg))}60%{opacity:1;transform:scale(.94) rotate(var(--r,0deg))}100%{transform:scale(1) rotate(var(--r,0deg))}}
.pp-cal .aspect-square{aspect-ratio:1.45}
@media (prefers-reduced-motion:reduce){.pp-stamp-in{animation:none}}
`

const SectionHead: React.FC<{ kicker: string; title: string; action?: React.ReactNode }> = ({ kicker, title, action }) => (
  <div className="mb-4 flex items-end justify-between gap-3">
    <div>
      <div className="note-wide text-[10px] font-bold text-[var(--ink)]">{kicker}</div>
      <h2 className="note-display mt-1 text-[24px] font-black leading-none text-[var(--text)]">{title}</h2>
    </div>
    {action}
  </div>
)

const GuestProfile: React.FC = () => (
  <div className="note-home mx-auto max-w-3xl py-10">
    <style>{NOTE_STYLES}</style>
    <section className="note-paper relative overflow-hidden rounded-[28px] p-8 text-center sm:p-12">
      <Rosette className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 opacity-60" />
      <div className="relative">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ink)] text-2xl text-[var(--bg)]">
          <i className="fa-solid fa-id-card"></i>
        </span>
        <h1 className="note-display mt-6 text-[40px] font-black leading-[0.95] text-[var(--text)]">Tu credencial te espera</h1>
        <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-[var(--text-muted)]">
          Crea tu cuenta para tener un perfil propio, ganar sellos, juntar monedas Kor y desbloquear temas, barras y mundos.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/register" className="note-btn note-btn-ink">
            Crear cuenta gratis
            <i className="fa-solid fa-arrow-right text-[13px]"></i>
          </Link>
          <Link to="/login" className="note-btn note-btn-line">
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  </div>
)

export const ProfilePage: React.FC = () => {
  const { user, isGuest, showToast } = usePlatform()
  const [custom, update] = useProfileCustomization(user.username)
  const [searchParams, setSearchParams] = useSearchParams()
  const [isExporting, setIsExporting] = useState(false)

  const requested = searchParams.get('estudio') as StudioTabId | null
  const studioOpen = Boolean(requested && STUDIO_TAB_IDS.includes(requested))
  const studioTab: StudioTabId = studioOpen ? (requested as StudioTabId) : 'diseno'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  if (isGuest) return <GuestProfile />

  const openStudio = (tab: StudioTabId) => setSearchParams({ estudio: tab })
  const changeTab = (tab: StudioTabId) => setSearchParams({ estudio: tab }, { replace: true })
  const closeStudio = () => setSearchParams({}, { replace: false })

  const displayName = user.name || user.username
  const avatarSrc = resolveAvatarSrc(user.avatar, user.username)
  const initials = (displayName || 'U').slice(0, 2).toUpperCase()
  const allAchievements = ACHIEVEMENTS as unknown as AchievementItem[]
  const unlocked = allAchievements.filter((item) => user.achievements.includes(item.id))
  const pinned = custom.pinnedAchievements.map((id) => unlocked.find((item) => item.id === id)).filter((item): item is AchievementItem => Boolean(item))
  const xpPercent = user.xpToNext > 0 ? Math.min(100, Math.round((user.xp / user.xpToNext) * 100)) : 0
  const lessonsTotal = (MODULES_BY_CATEGORY.trading || []).length || 8
  const lessonsDone = Math.min(lessonsTotal, (user.moduleProgress?.trading || []).length)
  const world = LEARN_WORLDS.find((item) => item.id === custom.learnWorld) || LEARN_WORLDS[0]
  const gap = custom.density === 'compact' ? 'space-y-5' : 'space-y-8'

  const togglePin = (id: string) => {
    const has = custom.pinnedAchievements.includes(id)
    if (!has && custom.pinnedAchievements.length >= MAX_PINNED_ACHIEVEMENTS) {
      showToast(`Solo puedes destacar ${MAX_PINNED_ACHIEVEMENTS} sellos`, 'error')
      return
    }
    update({ pinnedAchievements: has ? custom.pinnedAchievements.filter((item) => item !== id) : [...custom.pinnedAchievements, id] })
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
        achievementsUnlocked: unlocked.length,
        achievementsTotal: allAchievements.length,
        avatar: avatarSrc,
        shape: custom.avatarShape,
        initials,
        colorA: custom.bannerColorA,
        colorB: custom.bannerColorB,
        status: custom.status,
      })
      showToast('Tarjeta descargada', 'success')
    } catch {
      showToast('No se pudo generar la tarjeta', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const statusSlot = custom.status ? (
    <button
      type="button"
      onClick={() => openStudio('datos')}
      title="Editar estado"
      className="group inline-flex shrink-0 items-center gap-2 self-center rounded-full border border-[var(--rule)] bg-[var(--paper)] px-3.5 py-2 text-[14px] text-[var(--text)] transition-colors hover:border-[var(--ink)] sm:self-auto"
    >
      <i className={`${custom.statusIcon} text-[var(--ink)]`}></i>
      {custom.status}
      <i className="fa-solid fa-pen text-[10px] text-[var(--text-muted)] opacity-0 transition-opacity group-hover:opacity-100"></i>
    </button>
  ) : (
    <button
      type="button"
      onClick={() => openStudio('datos')}
      className="inline-flex shrink-0 items-center gap-2 self-center rounded-full border border-dashed border-[var(--rule)] px-3.5 py-2 text-[14px] text-[var(--text-muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] sm:self-auto"
    >
      <i className="fa-solid fa-plus text-[11px]"></i>
      Agregar un estado
    </button>
  )

  const actions = (
    <>
      <button type="button" onClick={() => openStudio('diseno')} className="note-btn note-btn-ink h-11 px-5 text-[15px]">
        <i className="fa-solid fa-wand-magic-sparkles text-[13px]"></i>
        Personalizar
      </button>
      <button type="button" onClick={handleExport} disabled={isExporting} aria-label="Descargar tarjeta" title="Descargar tarjeta" className="note-btn note-btn-line h-11 w-11 px-0 disabled:opacity-60">
        {isExporting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-download text-[14px]"></i>}
      </button>
    </>
  )

  const heroProps: HeroProps = {
    user,
    custom,
    avatarSrc,
    initials,
    displayName,
    xpPercent,
    unlocked,
    pinned,
    folio: getFolio(user.username),
    lessonsDone,
    lessonsTotal,
    statusSlot,
    actions,
  }

  const statValues: Record<StatId, { value: number; suffix?: string; note: string }> = {
    level: { value: user.level, note: `${Math.max(0, user.xpToNext - user.xp)} XP para el siguiente` },
    coins: { value: user.coins, note: 'Úsalas en el estudio' },
    streak: { value: user.streak, suffix: user.streak === 1 ? ' día' : ' días', note: user.streak > 0 ? 'Sigue así mañana' : 'Empieza hoy' },
    achievements: { value: unlocked.length, suffix: `/${allAchievements.length}`, note: 'Sellos ganados' },
    topics: { value: lessonsDone, suffix: `/${lessonsTotal}`, note: 'Lecciones completadas' },
  }

  const visibleStats = STAT_OPTIONS.filter((option) => custom.visibleStats.includes(option.id))

  return (
    <div className={`note-home mx-auto max-w-6xl py-2 transition-[padding] duration-300 sm:py-4 ${studioOpen ? 'lg:pr-[452px]' : ''}`}>
      <style>{NOTE_STYLES}</style>
      <style>{PROFILE_STYLES}</style>
      <style>{LAYOUT_STYLES}</style>
      <style>{PAGE_STYLES}</style>

      <div className={gap}>
        <div key={custom.profileLayout} className="note-enter">
          {custom.profileLayout === 'office' && <OfficeHero {...heroProps} />}
          {custom.profileLayout === 'card' && <CardHero {...heroProps} />}
          {custom.profileLayout === 'credential' && <CredentialHero {...heroProps} />}
        </div>

        <section>
          <SectionHead
            kicker="ESTADO DE CUENTA"
            title="Tus números"
            action={
              <button type="button" onClick={() => openStudio('diseno')} className="text-[14px] font-semibold text-[var(--ink)] hover:underline">
                Elegir cuáles
              </button>
            }
          />
          <div className={`note-card grid overflow-hidden ${visibleStats.length >= 4 ? 'grid-cols-2 lg:grid-cols-4' : visibleStats.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2'}`}>
            {visibleStats.map((option, index) => {
              const stat = statValues[option.id]
              const tone = STAT_TONES[option.id]
              return (
                <div key={option.id} className={`relative p-5 sm:p-6 ${index > 0 ? 'border-l border-dashed border-[var(--rule)]' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg text-[13px]" style={{ background: `color-mix(in srgb, ${tone} 14%, transparent)`, color: tone }}>
                      <i className={`${option.icon} ${option.id === 'streak' && user.streak > 0 ? 'pf-flame' : ''}`}></i>
                    </span>
                    <span className="note-wide text-[10px] font-bold text-[var(--text-muted)]">{option.label.toUpperCase()}</span>
                  </div>
                  <div className="note-display note-num mt-3 text-[40px] font-black leading-none text-[var(--text)]">
                    <CountUp value={stat.value} />
                    {stat.suffix && <span className="text-[18px] font-bold text-[var(--text-muted)]">{stat.suffix}</span>}
                  </div>
                  <div className="mt-1.5 text-[13px] text-[var(--text-muted)]">{stat.note}</div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <section>
            <SectionHead
              kicker="LIBRETA DE SELLOS"
              title={`${unlocked.length} de ${allAchievements.length} sellos`}
              action={<span className="text-[13px] text-[var(--text-muted)]">Toca un sello para destacarlo</span>}
            />
            <div className="note-card relative overflow-hidden p-5 sm:p-6">
              <div className="pointer-events-none absolute inset-0 opacity-50" style={{ background: 'repeating-linear-gradient(0deg, transparent 0 31px, var(--rule) 31px 32px)' }}></div>
              <div className="relative grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-4">
                {allAchievements.map((item, index) => {
                  const isUnlocked = user.achievements.includes(item.id)
                  const isPinned = custom.pinnedAchievements.includes(item.id)
                  const rotation = ((index * 37) % 17) - 8
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => togglePin(item.id)}
                      title={item.desc || item.name}
                      aria-pressed={isPinned}
                      aria-label={`${item.name}. ${isUnlocked ? (isPinned ? 'Destacado' : 'Desbloqueado') : 'Bloqueado'}`}
                      className="group flex flex-col items-center gap-2 text-center disabled:cursor-default"
                    >
                      <span
                        className={`pl-stamp relative flex h-20 w-20 items-center justify-center rounded-full ${isUnlocked ? 'pp-stamp-in' : ''}`}
                        style={
                          isUnlocked
                            ? ({
                                '--r': `${rotation}deg`,
                                transform: `rotate(${rotation}deg)`,
                                border: '3px double var(--ink-3)',
                                color: 'var(--ink-3)',
                                background: 'color-mix(in srgb, var(--ink-3) 7%, var(--surface))',
                                animationDelay: `${index * 60}ms`,
                              } as React.CSSProperties)
                            : { border: '2px dashed var(--rule)', color: 'var(--text-dim)' }
                        }
                      >
                        {isUnlocked && <span className="absolute inset-1.5 rounded-full border border-dashed border-[color-mix(in_srgb,var(--ink-3)_45%,transparent)]"></span>}
                        <i className={`${isUnlocked ? item.icon || 'fa-solid fa-medal' : 'fa-solid fa-lock'} text-[22px]`}></i>
                        {isPinned && (
                          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] text-[var(--bg)]">
                            <i className="fa-solid fa-thumbtack"></i>
                          </span>
                        )}
                      </span>
                      <span className={`text-[13px] font-semibold leading-tight ${isUnlocked ? 'text-[var(--text)]' : 'text-[var(--text-dim)]'}`}>{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </section>

          <div className="space-y-6">
            <section>
              <SectionHead kicker="TU CAMINO" title={world.label} />
              <div className="note-card overflow-hidden">
                <div className="flex items-center gap-4 p-5">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--ink)] text-[22px] text-[var(--bg)]">
                    <i className={world.icon}></i>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-semibold text-[var(--text)]">Trading y Finanzas</div>
                    <div className="note-num text-[13px] text-[var(--text-muted)]">
                      {lessonsDone} de {lessonsTotal} lecciones
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 px-5">
                  {Array.from({ length: lessonsTotal }).map((_, i) => (
                    <span key={i} className={`h-2 flex-1 rounded-full ${i < lessonsDone ? 'bg-[var(--ink)]' : 'bg-[var(--rule)]'}`}></span>
                  ))}
                </div>
                <div className="mt-5 flex border-t border-[var(--rule)]">
                  <Link to="/aprender" className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[14px] font-bold text-[var(--ink)] hover:bg-[var(--paper)]">
                    {lessonsDone >= lessonsTotal ? 'Repasar' : 'Continuar'}
                    <i className="fa-solid fa-arrow-right text-[12px]"></i>
                  </Link>
                  <button type="button" onClick={() => openStudio('mundo')} className="flex flex-1 items-center justify-center gap-2 border-l border-[var(--rule)] py-3.5 text-[14px] font-semibold text-[var(--text-muted)] hover:bg-[var(--paper)] hover:text-[var(--text)]">
                    <i className="fa-solid fa-earth-americas text-[12px]"></i>
                    Cambiar mundo
                  </button>
                </div>
              </div>
            </section>

            <section>
              <SectionHead
                kicker="MI META"
                title="Hacia dónde voy"
                action={
                  <button type="button" onClick={() => openStudio('datos')} className="text-[14px] font-semibold text-[var(--ink)] hover:underline">
                    Editar
                  </button>
                }
              />
              <div className="note-card p-5">
                {user.goal ? (
                  <p className="note-display text-[20px] font-bold leading-snug text-[var(--text)]">{user.goal}</p>
                ) : (
                  <button type="button" onClick={() => openStudio('datos')} className="text-[15px] text-[var(--text-muted)] hover:text-[var(--ink)]">
                    Escribe una meta para tenerla siempre a la vista
                  </button>
                )}
              </div>
            </section>
          </div>
        </div>

        {(custom.showStreakCalendar || custom.showLevelJourney) && (
          <div className={`grid gap-6 ${custom.showStreakCalendar && custom.showLevelJourney ? 'lg:grid-cols-2' : ''}`}>
            {custom.showStreakCalendar && (
              <section>
                <SectionHead kicker="ASISTENCIA" title="Calendario de racha" action={<span className="note-num text-[14px] font-semibold text-[var(--ink-3)]">{user.streak} {user.streak === 1 ? 'día' : 'días'}</span>} />
                <div className="pp-cal note-card p-5">
                  <StreakCalendar streak={user.streak} />
                </div>
              </section>
            )}
            {custom.showLevelJourney && (
              <section>
                <SectionHead kicker="PROGRESIÓN" title="Ruta de niveles" />
                <div className="note-card p-5">
                  <LevelJourney level={user.level} xp={user.xp} xpToNext={user.xpToNext} />
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <ProfileStudio open={studioOpen} tab={studioTab} onTabChange={changeTab} onClose={closeStudio} />
    </div>
  )
}
