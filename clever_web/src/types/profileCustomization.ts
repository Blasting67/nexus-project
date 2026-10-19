export type BannerStyle = 'cover' | 'aurora' | 'candles' | 'grid' | 'waves' | 'stars'

export type FrameStyle = 'none' | 'solid' | 'rainbow' | 'pulse' | 'orbit'

export type AvatarShape = 'circle' | 'rounded' | 'hexagon'

export type StatId = 'level' | 'coins' | 'streak' | 'achievements' | 'topics'

export type ProfileDensity = 'comfortable' | 'compact'

export interface ProfileCustomization {
  bannerStyle: BannerStyle
  bannerColorA: string
  bannerColorB: string
  bannerSpeed: number
  frameStyle: FrameStyle
  frameColor: string
  avatarShape: AvatarShape
  showLevelRing: boolean
  status: string
  statusIcon: string
  pinnedAchievements: string[]
  visibleStats: StatId[]
  showStreakCalendar: boolean
  showLevelJourney: boolean
  glow: boolean
  tilt: boolean
  density: ProfileDensity
}
