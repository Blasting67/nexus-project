import { useCallback, useSyncExternalStore } from 'react'
import {
  AVATAR_SHAPES,
  BANNER_STYLES,
  DEFAULT_CUSTOMIZATION,
  FRAME_STYLES,
  HOME_GREETINGS,
  HOME_LESSON_BACKGROUNDS,
  HOME_MAIN_SECTIONS,
  HOME_SIDE_SECTIONS,
  MAX_GREETING_LENGTH,
  LEARN_WORLDS,
  MAX_PINNED_ACHIEVEMENTS,
  MAX_STATUS_LENGTH,
  NAV_STYLES,
  PROFILE_LAYOUTS,
  STAT_OPTIONS,
} from '../data/profileCustomizationOptions'
import type { ProfileCustomization, StatId, UnlockRule } from '../types/profileCustomization'

const orderList = <T extends string>(raw: unknown, valid: { id: T }[]): T[] => {
  const ids = valid.map((item) => item.id)
  const given = Array.isArray(raw) ? (raw.filter((id, index, all) => ids.includes(id as T) && all.indexOf(id) === index) as T[]) : []
  return [...given, ...ids.filter((id) => !given.includes(id))]
}

const STORAGE_PREFIX = 'clever_profile_customization_'

const buildKey = (username: string) => `${STORAGE_PREFIX}${username || 'guest'}`

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const isHexColor = (value: unknown): value is string => typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

const pick = <T extends string>(value: unknown, options: { id: T }[], fallback: T): T =>
  options.some((option) => option.id === value) ? (value as T) : fallback

export const sanitizeCustomization = (raw: Partial<ProfileCustomization>): ProfileCustomization => {
  const base = DEFAULT_CUSTOMIZATION
  const validStats = STAT_OPTIONS.map((option) => option.id)
  const visibleStats = Array.isArray(raw.visibleStats)
    ? (raw.visibleStats.filter((id) => validStats.includes(id as StatId)) as StatId[])
    : base.visibleStats

  return {
    bannerStyle: pick(raw.bannerStyle, BANNER_STYLES, base.bannerStyle),
    bannerColorA: isHexColor(raw.bannerColorA) ? raw.bannerColorA : '',
    bannerColorB: isHexColor(raw.bannerColorB) ? raw.bannerColorB : '',
    bannerSpeed: clamp(Number(raw.bannerSpeed ?? base.bannerSpeed) || base.bannerSpeed, 0.4, 2.5),
    frameStyle: pick(raw.frameStyle, FRAME_STYLES, base.frameStyle),
    frameColor: isHexColor(raw.frameColor) ? raw.frameColor : '',
    avatarShape: pick(raw.avatarShape, AVATAR_SHAPES, base.avatarShape),
    showLevelRing: typeof raw.showLevelRing === 'boolean' ? raw.showLevelRing : base.showLevelRing,
    status: String(raw.status ?? '').slice(0, MAX_STATUS_LENGTH),
    statusIcon: typeof raw.statusIcon === 'string' && raw.statusIcon ? raw.statusIcon : base.statusIcon,
    pinnedAchievements: Array.isArray(raw.pinnedAchievements) ? raw.pinnedAchievements.map(String).slice(0, MAX_PINNED_ACHIEVEMENTS) : [],
    visibleStats: visibleStats.length > 0 ? visibleStats : base.visibleStats,
    showStreakCalendar: typeof raw.showStreakCalendar === 'boolean' ? raw.showStreakCalendar : base.showStreakCalendar,
    showLevelJourney: typeof raw.showLevelJourney === 'boolean' ? raw.showLevelJourney : base.showLevelJourney,
    glow: typeof raw.glow === 'boolean' ? raw.glow : base.glow,
    tilt: typeof raw.tilt === 'boolean' ? raw.tilt : base.tilt,
    density: raw.density === 'compact' ? 'compact' : 'comfortable',
    profileLayout: pick(raw.profileLayout, PROFILE_LAYOUTS, base.profileLayout),
    navStyle: pick(raw.navStyle, NAV_STYLES, base.navStyle),
    learnWorld: pick(raw.learnWorld, LEARN_WORLDS, base.learnWorld),
    owned: Array.isArray(raw.owned) ? Array.from(new Set(raw.owned.map(String))).slice(0, 80) : [],
    adminMode: raw.adminMode === true,
    homeMain: orderList(raw.homeMain, HOME_MAIN_SECTIONS),
    homeSide: orderList(raw.homeSide, HOME_SIDE_SECTIONS),
    homeHidden: Array.isArray(raw.homeHidden) ? raw.homeHidden.map(String).filter((id) => id !== 'lesson') : [],
    homeGreeting: pick(raw.homeGreeting, HOME_GREETINGS, base.homeGreeting),
    homeGreetingText: String(raw.homeGreetingText ?? '').slice(0, MAX_GREETING_LENGTH),
    homeSidebarLeft: raw.homeSidebarLeft === true,
    homeMascot: typeof raw.homeMascot === 'boolean' ? raw.homeMascot : base.homeMascot,
    homeCredentialCover: raw.homeCredentialCover === true,
    homeCompact: raw.homeCompact === true,
    homeLessonBg: pick(raw.homeLessonBg, HOME_LESSON_BACKGROUNDS, base.homeLessonBg),
  }
}

export const loadProfileCustomization = (username: string): ProfileCustomization => {
  try {
    const stored = window.localStorage.getItem(buildKey(username))
    if (!stored) return DEFAULT_CUSTOMIZATION
    return sanitizeCustomization(JSON.parse(stored) as Partial<ProfileCustomization>)
  } catch {
    return DEFAULT_CUSTOMIZATION
  }
}

export const saveProfileCustomization = (username: string, value: ProfileCustomization): boolean => {
  try {
    window.localStorage.setItem(buildKey(username), JSON.stringify(sanitizeCustomization(value)))
    return true
  } catch {
    return false
  }
}

const listeners = new Set<() => void>()
let cache: { username: string; value: ProfileCustomization } | null = null

const notify = () => listeners.forEach((listener) => listener())

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const getProfileCustomization = (username: string): ProfileCustomization => {
  if (!cache || cache.username !== username) cache = { username, value: loadProfileCustomization(username) }
  return cache.value
}

export const updateProfileCustomization = (username: string, patch: Partial<ProfileCustomization>): boolean => {
  const next = sanitizeCustomization({ ...getProfileCustomization(username), ...patch })
  const ok = saveProfileCustomization(username, next)
  cache = { username, value: next }
  notify()
  return ok
}

export const resetProfileCustomization = (username: string): boolean => {
  const owned = getProfileCustomization(username).owned
  const adminMode = getProfileCustomization(username).adminMode
  return updateProfileCustomization(username, { ...DEFAULT_CUSTOMIZATION, owned, adminMode })
}

export const useProfileCustomization = (username: string) => {
  const value = useSyncExternalStore(
    subscribe,
    () => getProfileCustomization(username),
    () => DEFAULT_CUSTOMIZATION,
  )
  const update = useCallback((patch: Partial<ProfileCustomization>) => updateProfileCustomization(username, patch), [username])
  return [value, update] as const
}

export type UnlockState = { unlocked: true } | { unlocked: false; reason: 'price'; price: number } | { unlocked: false; reason: 'level'; level: number }

export const getUnlockState = (key: string, rule: UnlockRule | undefined, owned: string[], userLevel: number, adminMode = false): UnlockState => {
  if (!rule || adminMode) return { unlocked: true }
  if (rule.level && userLevel < rule.level) return { unlocked: false, reason: 'level', level: rule.level }
  if (rule.price && !owned.includes(key)) return { unlocked: false, reason: 'price', price: rule.price }
  return { unlocked: true }
}
