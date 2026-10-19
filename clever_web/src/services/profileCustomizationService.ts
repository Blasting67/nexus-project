import {
  AVATAR_SHAPES,
  BANNER_STYLES,
  DEFAULT_CUSTOMIZATION,
  FRAME_STYLES,
  MAX_PINNED_ACHIEVEMENTS,
  MAX_STATUS_LENGTH,
  STAT_OPTIONS,
} from '../data/profileCustomizationOptions'
import type { ProfileCustomization, StatId } from '../types/profileCustomization'

const STORAGE_PREFIX = 'clever_profile_customization_'

const buildKey = (username: string) => `${STORAGE_PREFIX}${username || 'guest'}`

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const isHexColor = (value: unknown): value is string =>
  typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value)

export const sanitizeCustomization = (raw: Partial<ProfileCustomization>): ProfileCustomization => {
  const base = DEFAULT_CUSTOMIZATION
  const validStats = STAT_OPTIONS.map((option) => option.id)

  const visibleStats = Array.isArray(raw.visibleStats)
    ? (raw.visibleStats.filter((id) => validStats.includes(id as StatId)) as StatId[])
    : base.visibleStats

  return {
    bannerStyle: BANNER_STYLES.some((o) => o.id === raw.bannerStyle) ? raw.bannerStyle! : base.bannerStyle,
    bannerColorA: isHexColor(raw.bannerColorA) ? raw.bannerColorA : '',
    bannerColorB: isHexColor(raw.bannerColorB) ? raw.bannerColorB : '',
    bannerSpeed: clamp(Number(raw.bannerSpeed ?? base.bannerSpeed) || base.bannerSpeed, 0.4, 2.5),
    frameStyle: FRAME_STYLES.some((o) => o.id === raw.frameStyle) ? raw.frameStyle! : base.frameStyle,
    frameColor: isHexColor(raw.frameColor) ? raw.frameColor : '',
    avatarShape: AVATAR_SHAPES.some((o) => o.id === raw.avatarShape) ? raw.avatarShape! : base.avatarShape,
    showLevelRing: typeof raw.showLevelRing === 'boolean' ? raw.showLevelRing : base.showLevelRing,
    status: String(raw.status ?? '').slice(0, MAX_STATUS_LENGTH),
    statusIcon: typeof raw.statusIcon === 'string' && raw.statusIcon ? raw.statusIcon : base.statusIcon,
    pinnedAchievements: Array.isArray(raw.pinnedAchievements)
      ? raw.pinnedAchievements.map(String).slice(0, MAX_PINNED_ACHIEVEMENTS)
      : [],
    visibleStats: visibleStats.length > 0 ? visibleStats : base.visibleStats,
    showStreakCalendar:
      typeof raw.showStreakCalendar === 'boolean' ? raw.showStreakCalendar : base.showStreakCalendar,
    showLevelJourney:
      typeof raw.showLevelJourney === 'boolean' ? raw.showLevelJourney : base.showLevelJourney,
    glow: typeof raw.glow === 'boolean' ? raw.glow : base.glow,
    tilt: typeof raw.tilt === 'boolean' ? raw.tilt : base.tilt,
    density: raw.density === 'compact' ? 'compact' : 'comfortable',
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

export const resetProfileCustomization = (username: string): boolean => {
  try {
    window.localStorage.removeItem(buildKey(username))
    return true
  } catch {
    return false
  }
}