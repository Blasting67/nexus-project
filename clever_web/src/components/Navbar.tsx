import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { usePlatform } from '../context/PlatformContext'
import { NOTE_STYLES, WaveField } from './note/NoteKit'

interface NavItem {
  to: string
  label: string
  shortLabel: string
  icon: string
}

interface MoreItem {
  to: string
  label: string
  description: string
  icon: string
}

const MAIN_ITEMS: NavItem[] = [
  { to: '/', label: 'Inicio', shortLabel: 'Inicio', icon: 'fa-solid fa-house' },
  { to: '/aprender', label: 'Aprender', shortLabel: 'Aprender', icon: 'fa-solid fa-road' },
  { to: '/exchange', label: 'Exchange Spot', shortLabel: 'Exchange', icon: 'fa-solid fa-chart-simple' },
]

const MORE_ITEMS: MoreItem[] = [
  { to: '/analisis', label: 'Análisis Técnico', description: 'Indicadores y gráficas', icon: 'fa-solid fa-magnifying-glass-chart' },
  { to: '/mentor', label: 'Mentor IA', description: 'Pregúntale a Kor', icon: 'fa-solid fa-robot' },
]

const PROFILE_ITEMS: MoreItem[] = [
  { to: '/perfil', label: 'Perfil', description: '', icon: 'fa-solid fa-user' },
  { to: '/progreso', label: 'Mi Progreso', description: '', icon: 'fa-solid fa-chart-pie' },
  { to: '/personalizacion', label: 'Personalización', description: '', icon: 'fa-solid fa-palette' },
  { to: '/configuracion', label: 'Configuración', description: '', icon: 'fa-solid fa-gear' },
]

const NAV_MICROTEXT = 'CLEVER · TRADING Y FINANZAS · APRENDE PRACTICANDO · SERIE KOR · '.repeat(10)

const NAV_STYLES = `
.nav-shell{--coin:#d99a1e}
.nav-shell .nav-font{font-family:"Archivo","Schibsted Grotesk",system-ui,sans-serif;font-stretch:108%}
.nav-marquee{animation:nav-marquee 60s linear infinite}
@keyframes nav-marquee{to{transform:translateX(-50%)}}
.nav-ink{transition:left .45s cubic-bezier(.23,1,.32,1),width .45s cubic-bezier(.23,1,.32,1),opacity .2s}
.nav-link{transition:color .2s}
.nav-flame{display:inline-block;transform-origin:50% 90%;animation:nav-flame 1.8s ease-in-out infinite}
@keyframes nav-flame{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.1,1.16) rotate(4deg)}}
.nav-bump{animation:nav-bump .55s cubic-bezier(.23,1,.32,1)}
@keyframes nav-bump{0%{transform:scale(1)}35%{transform:scale(1.2)}100%{transform:scale(1)}}
.nav-delta{animation:nav-delta 1.2s cubic-bezier(.23,1,.32,1) forwards}
@keyframes nav-delta{0%{opacity:0;transform:translate(-50%,4px)}20%{opacity:1}100%{opacity:0;transform:translate(-50%,-18px)}}
.nav-pop{transition:opacity .18s,transform .24s cubic-bezier(.23,1,.32,1),visibility .24s}
.nav-pop[data-open="false"]{opacity:0;transform:translateY(-6px) scale(.97);visibility:hidden;pointer-events:none}
.nav-sheet{transition:transform .34s cubic-bezier(.23,1,.32,1),visibility .34s}
.nav-sheet[data-open="false"]{transform:translateY(105%);visibility:hidden}
.nav-scrim{transition:opacity .25s,visibility .25s}
.nav-scrim[data-open="false"]{opacity:0;visibility:hidden;pointer-events:none}
.nav-tab-ind{transition:left .42s cubic-bezier(.23,1,.32,1),opacity .2s}
.nav-tab:active .nav-tab-icon{transform:scale(.88)}
.nav-tab-icon{transition:transform .2s cubic-bezier(.23,1,.32,1),color .2s}
.nav-logo-ring{transition:transform 1.4s cubic-bezier(.23,1,.32,1);transform-origin:center}
.nav-logo:hover .nav-logo-ring{transform:rotate(120deg)}
.nav-chevron{transition:transform .25s cubic-bezier(.23,1,.32,1)}
.nav-item-row{transition:background-color .15s}
.nav-item-icon{transition:background-color .2s,color .2s}
.nav-item-row:hover .nav-item-icon{background:var(--ink);color:var(--bg)}
.nav-xp{transition:width .8s cubic-bezier(.23,1,.32,1)}
@media (prefers-reduced-motion:reduce){
.nav-marquee,.nav-flame,.nav-bump,.nav-delta{animation:none!important}
.nav-ink,.nav-pop,.nav-sheet,.nav-scrim,.nav-tab-ind,.nav-logo-ring,.nav-chevron,.nav-item-row,.nav-item-icon,.nav-xp,.nav-tab-icon{transition:none!important}
.nav-delta{display:none}
}
`

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(media.matches)
    const onChange = () => setReduced(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])
  return reduced
}

const useCountUp = (value: number, reduced: boolean) => {
  const [display, setDisplay] = useState(value)
  const [pulse, setPulse] = useState({ key: 0, delta: 0 })
  const previous = useRef(value)

  useEffect(() => {
    const start = previous.current
    if (start === value) return
    previous.current = value
    setPulse((current) => ({ key: current.key + 1, delta: value - start }))
    if (reduced) {
      setDisplay(value)
      return
    }
    const startedAt = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / 750)
      const eased = 1 - Math.pow(1 - progress, 4)
      setDisplay(Math.round(start + (value - start) * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, reduced])

  return { display, pulse }
}

const useDismiss = (isOpen: boolean, close: () => void, ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    if (!isOpen) return
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close()
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [isOpen, close, ref])
}

const matchesPath = (pathname: string, to: string) => (to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(`${to}/`))

const StatChip: React.FC<{
  icon: string
  value: number
  prefix?: string
  suffix?: string
  color: string
  label: string
  reduced: boolean
  iconClassName?: string
  progress?: number
}> = ({ icon, value, prefix = '', suffix = '', color, label, reduced, iconClassName = '', progress }) => {
  const { display, pulse } = useCountUp(value, reduced)
  return (
    <span
      className="relative inline-flex h-8 items-center gap-1.5 overflow-visible rounded-full border px-2.5"
      style={{ borderColor: `color-mix(in srgb, ${color} 32%, var(--border))`, background: `color-mix(in srgb, ${color} 9%, var(--surface))` }}
      aria-label={`${label}: ${prefix}${value}${suffix}`}
      title={label}
    >
      <span key={pulse.key} className={`inline-flex items-center gap-1.5 ${pulse.key ? 'nav-bump' : ''}`} aria-hidden="true">
        <i className={`${icon} text-[12px] ${iconClassName}`} style={{ color }}></i>
        <span className="nav-font note-num text-[13px] font-bold leading-none text-[var(--text)]">
          {prefix}
          {display}
          {suffix}
        </span>
      </span>
      {progress !== undefined && (
        <span className="hidden h-1 w-9 overflow-hidden rounded-full lg:block" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)` }} aria-hidden="true">
          <span className="nav-xp block h-full rounded-full" style={{ width: `${Math.round(progress * 100)}%`, background: color }}></span>
        </span>
      )}
      {pulse.key > 0 && pulse.delta > 0 && (
        <span key={`delta-${pulse.key}`} className="nav-delta nav-font pointer-events-none absolute left-1/2 top-0 text-[11px] font-extrabold" style={{ color }} aria-hidden="true">
          +{pulse.delta}
        </span>
      )}
    </span>
  )
}

const Avatar: React.FC<{ avatar: string | null; initials: string; progress: number; size?: number }> = ({ avatar, initials, progress, size = 36 }) => (
  <span
    className="relative inline-flex shrink-0 items-center justify-center rounded-full p-[2.5px]"
    style={{ width: size, height: size, background: `conic-gradient(var(--ink) ${progress * 360}deg, color-mix(in srgb, var(--ink) 16%, transparent) 0deg)` }}
  >
    <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-[var(--bg-alt)] bg-[var(--surface)] text-[11px] font-bold text-[var(--text)]">
      {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : initials}
    </span>
  </span>
)

const LogoMark: React.FC = () => (
  <Link to="/" className="nav-logo flex shrink-0 items-center gap-2.5" aria-label="Clever, ir a Inicio">
    <span className="relative flex h-9 w-9 items-center justify-center">
      <svg viewBox="0 0 40 40" className="nav-logo-ring absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="var(--ink)" strokeWidth="1" strokeDasharray="2 2.6" opacity="0.6" />
      </svg>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--ink)] text-[12px] text-[var(--bg)]">
        <i className="fa-solid fa-graduation-cap"></i>
      </span>
    </span>
    <span className="flex flex-col leading-none">
      <span className="note-display text-[17px] font-black text-[var(--text)]">CLEVER</span>
      <span className="note-wide mt-0.5 text-[8px] font-bold text-[var(--ink)] opacity-80">PLATAFORMA</span>
    </span>
  </Link>
)

export const Navbar: React.FC = () => {
  const { user, isGuest, logout } = usePlatform()
  const location = useLocation()
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()

  const [isMoreOpen, setIsMoreOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [hoverKey, setHoverKey] = useState<string | null>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })
  const [isScrolled, setIsScrolled] = useState(false)

  const itemRefs = useRef(new Map<string, HTMLElement>())
  const linksRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const closeMore = useCallback(() => setIsMoreOpen(false), [])
  const closeProfile = useCallback(() => setIsProfileOpen(false), [])
  useDismiss(isMoreOpen, closeMore, moreRef)
  useDismiss(isProfileOpen, closeProfile, profileRef)

  const pathname = location.pathname
  const isMoreActive = MORE_ITEMS.some((item) => matchesPath(pathname, item.to))
  const activeKey = MAIN_ITEMS.find((item) => matchesPath(pathname, item.to))?.to ?? (isMoreActive ? 'more' : null)
  const targetKey = hoverKey ?? activeKey
  const activeTabIndex = MAIN_ITEMS.findIndex((item) => matchesPath(pathname, item.to))
  const tabIndex = isSheetOpen || (activeTabIndex < 0 && isMoreActive) ? MAIN_ITEMS.length : activeTabIndex

  const xpProgress = user.xpToNext > 0 ? Math.min(1, Math.max(0, user.xp / user.xpToNext)) : 0
  const initials = (user.name || user.username || 'U').slice(0, 2).toUpperCase()

  const measure = useCallback(() => {
    const element = targetKey ? itemRefs.current.get(targetKey) : null
    const container = linksRef.current
    if (!element || !container) {
      setIndicator((current) => ({ ...current, visible: false }))
      return
    }
    const box = element.getBoundingClientRect()
    const origin = container.getBoundingClientRect()
    setIndicator({ left: box.left - origin.left + 12, width: box.width - 24, visible: true })
  }, [targetKey])

  useLayoutEffect(() => {
    measure()
  }, [measure, pathname])

  useEffect(() => {
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setIsMoreOpen(false)
    setIsProfileOpen(false)
    setIsSheetOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!isSheetOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsSheetOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isSheetOpen])

  const registerItem = (key: string) => (element: HTMLElement | null) => {
    if (element) itemRefs.current.set(key, element)
    else itemRefs.current.delete(key)
  }

  const handleLogout = () => {
    setIsProfileOpen(false)
    logout()
    navigate('/')
  }

  const stats = (
    <>
      <StatChip icon="fa-solid fa-fire" iconClassName="nav-flame" value={user.streak} suffix="d" color="var(--ink-3)" label="Racha de días" reduced={reduced} />
      <StatChip icon="fa-solid fa-star" value={user.level} prefix="Nv. " color="var(--ink-2)" label="Nivel" reduced={reduced} progress={xpProgress} />
      <StatChip icon="fa-solid fa-coins" value={user.coins} color="var(--coin)" label="Monedas Kor" reduced={reduced} />
    </>
  )

  return (
    <>
      <style>{NOTE_STYLES}</style>
      <style>{NAV_STYLES}</style>
      <header
        className={`note-home nav-shell sticky top-0 z-40 border-b border-[var(--rule)] bg-[var(--bg-alt)] transition-shadow duration-300 ${isScrolled ? 'shadow-[0_10px_30px_-18px_rgba(10,20,40,.45)]' : ''}`}
      >
        <div className="relative h-4 overflow-hidden border-b border-[var(--rule)] bg-[var(--paper-2)]" aria-hidden="true">
          <div className="nav-marquee note-wide flex w-max whitespace-nowrap pt-[4px] text-[7.5px] font-bold leading-none text-[var(--ink)] opacity-70">
            <span>{NAV_MICROTEXT}</span>
            <span>{NAV_MICROTEXT}</span>
          </div>
        </div>

        <div className="relative">
          <WaveField className="pointer-events-none absolute inset-y-0 right-0 h-full w-[46%] opacity-40 [mask-image:linear-gradient(to_right,transparent,#000_40%)]" />
          <div className="relative mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-6 lg:gap-8">
              <LogoMark />

              <nav aria-label="Navegación principal" className="hidden md:block">
                <div ref={linksRef} className="relative flex items-center" onMouseLeave={() => setHoverKey(null)}>
                  {MAIN_ITEMS.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === '/'}
                      ref={registerItem(item.to)}
                      onMouseEnter={() => setHoverKey(item.to)}
                      onFocus={() => setHoverKey(item.to)}
                      onBlur={() => setHoverKey(null)}
                      className={({ isActive }) =>
                        `nav-link nav-font flex h-14 items-center gap-2 px-3 text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)] lg:px-3.5 ${
                          isActive ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`
                      }
                    >
                      <i className={`${item.icon} text-[12px] opacity-80`}></i>
                      <span className="lg:hidden">{item.shortLabel}</span>
                      <span className="hidden lg:inline">{item.label}</span>
                    </NavLink>
                  ))}

                  <div ref={moreRef} className="relative" onMouseEnter={() => setHoverKey('more')}>
                    <button
                      type="button"
                      ref={registerItem('more')}
                      onClick={() => setIsMoreOpen((open) => !open)}
                      aria-haspopup="true"
                      aria-expanded={isMoreOpen}
                      className={`nav-link nav-font flex h-14 cursor-pointer items-center gap-1.5 px-3 text-[14px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ink)] lg:px-3.5 ${
                        isMoreActive || isMoreOpen ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                    >
                      Más
                      <i className={`nav-chevron fa-solid fa-chevron-down text-[9px] ${isMoreOpen ? 'rotate-180' : ''}`}></i>
                    </button>

                    <div
                      data-open={isMoreOpen}
                      className="nav-pop absolute left-1/2 top-[calc(100%+6px)] w-[440px] origin-top -translate-x-1/2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_24px_60px_-24px_rgba(10,20,40,.5)]"
                    >
                      <div className="grid grid-cols-2 gap-1">
                        {MORE_ITEMS.map((item) => {
                          const isActive = matchesPath(pathname, item.to)
                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={closeMore}
                              className={`nav-item-row flex items-start gap-3 rounded-xl p-2.5 ${isActive ? 'bg-[var(--paper-2)]' : 'hover:bg-[var(--paper)]'}`}
                            >
                              <span className="nav-item-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--paper-2)] text-[13px] text-[var(--ink)]">
                                <i className={item.icon}></i>
                              </span>
                              <span className="min-w-0">
                                <span className="nav-font block text-[14px] font-bold text-[var(--text)]">{item.label}</span>
                                <span className="block text-[12.5px] leading-snug text-[var(--text-muted)]">{item.description}</span>
                              </span>
                            </Link>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <span
                    className="nav-ink pointer-events-none absolute bottom-0 h-[3px] rounded-t-full bg-[var(--ink)]"
                    style={{ left: indicator.left, width: indicator.width, opacity: indicator.visible ? 1 : 0 }}
                    aria-hidden="true"
                  ></span>
                </div>
              </nav>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {!isGuest && <div className="flex items-center gap-1.5 md:hidden lg:flex">{stats}</div>}

              {isGuest ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link to="/login" className="nav-font hidden px-2 py-1.5 text-[14px] font-semibold text-[var(--text)] transition-colors hover:text-[var(--ink)] sm:inline">
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="nav-font inline-flex h-9 items-center gap-2 rounded-full bg-[var(--ink)] px-4 text-[13.5px] font-bold text-[var(--bg)] transition-transform active:scale-[.97]"
                  >
                    Registrarse
                  </Link>
                </div>
              ) : (
                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen((open) => !open)}
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label="Abrir menú de perfil"
                    className="flex cursor-pointer items-center gap-2 rounded-full p-0.5 pr-0.5 transition-colors hover:bg-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)] xl:pr-3"
                  >
                    <Avatar avatar={user.avatar} initials={initials} progress={xpProgress} />
                    <span className="nav-font hidden text-[14px] font-semibold text-[var(--text)] xl:inline">{user.username}</span>
                    <i className={`nav-chevron fa-solid fa-chevron-down hidden text-[9px] text-[var(--text-muted)] xl:inline ${isProfileOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  <div
                    data-open={isProfileOpen}
                    className="nav-pop absolute right-0 top-[calc(100%+10px)] w-72 origin-top-right overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_60px_-24px_rgba(10,20,40,.5)]"
                  >
                    <div className="note-paper flex items-center gap-3 border-x-0 border-t-0 p-4">
                      <Avatar avatar={user.avatar} initials={initials} progress={xpProgress} size={48} />
                      <div className="min-w-0 flex-1">
                        <div className="nav-font truncate text-[15px] font-bold text-[var(--text)]">{user.name}</div>
                        <div className="truncate text-[13px] text-[var(--text-muted)]">@{user.username}</div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]">
                            <span className="nav-xp block h-full rounded-full bg-[var(--ink)]" style={{ width: `${Math.round(xpProgress * 100)}%` }}></span>
                          </span>
                          <span className="note-num shrink-0 text-[11.5px] font-semibold text-[var(--text-muted)]">
                            {user.xp}/{user.xpToNext} XP
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-3 md:flex lg:hidden">{stats}</div>
                    <div className="p-1.5">
                      {PROFILE_ITEMS.map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={closeProfile}
                          className="nav-item-row flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14px] font-medium text-[var(--text)] hover:bg-[var(--paper)]"
                        >
                          <i className={`${item.icon} w-4 text-center text-[13px] text-[var(--ink)]`}></i>
                          {item.label}
                        </Link>
                      ))}
                      <div className="mx-2 my-1 border-t border-[var(--border)]"></div>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="nav-item-row flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[14px] font-medium text-[var(--ink-3)] hover:bg-[color-mix(in_srgb,var(--ink-3)_10%,transparent)]"
                      >
                        <i className="fa-solid fa-right-from-bracket w-4 text-center text-[13px]"></i>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="note-home nav-shell md:hidden">
        <div
          data-open={isSheetOpen}
          className="nav-scrim fixed inset-0 z-[55] bg-[rgba(5,10,20,0.45)]"
          onClick={() => setIsSheetOpen(false)}
          aria-hidden="true"
        ></div>
        <section
          data-open={isSheetOpen}
          role="dialog"
          aria-modal="true"
          aria-label="Más secciones"
          className="nav-sheet fixed inset-x-0 bottom-0 z-[56] rounded-t-3xl border-t border-[var(--border)] bg-[var(--bg-alt)] px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3"
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--border)]"></div>
          <div className="note-wide mb-3 px-1 text-[10px] font-bold text-[var(--ink)]">MÁS SECCIONES</div>
          <div className="grid grid-cols-2 gap-2">
            {MORE_ITEMS.map((item) => {
              const isActive = matchesPath(pathname, item.to)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsSheetOpen(false)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center ${isActive ? 'border-[var(--ink)] bg-[var(--paper-2)]' : 'border-[var(--border)] bg-[var(--surface)]'}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--paper-2)] text-[15px] text-[var(--ink)]">
                    <i className={item.icon}></i>
                  </span>
                  <span className="nav-font text-[12.5px] font-bold leading-tight text-[var(--text)]">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </section>

        <nav
          aria-label="Navegación principal"
          className="fixed inset-x-0 bottom-0 z-[57] border-t border-[var(--rule)] bg-[color-mix(in_srgb,var(--bg-alt)_94%,transparent)] pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
        >
          <div className="relative grid h-16 grid-cols-4">
            <span
              className="nav-tab-ind pointer-events-none absolute top-2 h-8 w-14 -translate-x-1/2 rounded-full bg-[color-mix(in_srgb,var(--ink)_14%,transparent)]"
              style={{ left: `${tabIndex * 25 + 12.5}%`, opacity: tabIndex >= 0 ? 1 : 0 }}
              aria-hidden="true"
            ></span>
            {MAIN_ITEMS.map((item, index) => {
              const isActive = index === tabIndex
              return (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className="nav-tab relative flex flex-col items-center justify-center gap-1">
                  <i className={`nav-tab-icon ${item.icon} flex h-8 items-center text-[17px] ${isActive ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}></i>
                  <span className={`nav-font text-[10.5px] font-bold leading-none ${isActive ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}>{item.shortLabel}</span>
                </NavLink>
              )
            })}
            <button
              type="button"
              onClick={() => setIsSheetOpen((open) => !open)}
              aria-expanded={isSheetOpen}
              className="nav-tab relative flex cursor-pointer flex-col items-center justify-center gap-1"
            >
              <i className={`nav-tab-icon fa-solid ${isSheetOpen ? 'fa-xmark' : 'fa-grip'} flex h-8 items-center text-[17px] ${tabIndex === MAIN_ITEMS.length ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}></i>
              <span className={`nav-font text-[10.5px] font-bold leading-none ${tabIndex === MAIN_ITEMS.length ? 'text-[var(--ink)]' : 'text-[var(--text-muted)]'}`}>Más</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  )
}
