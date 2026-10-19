import type {
  AvatarShape,
  BannerStyle,
  FrameStyle,
  ProfileCustomization,
  StatId,
} from '../types/profileCustomization'

export const DEFAULT_CUSTOMIZATION: ProfileCustomization = {
  bannerStyle: 'aurora',
  bannerColorA: '',
  bannerColorB: '',
  bannerSpeed: 1,
  frameStyle: 'solid',
  frameColor: '',
  avatarShape: 'rounded',
  showLevelRing: true,
  status: '',
  statusIcon: 'fa-solid fa-book-open',
  pinnedAchievements: [],
  visibleStats: ['level', 'coins', 'streak', 'achievements'],
  showStreakCalendar: true,
  showLevelJourney: true,
  glow: true,
  tilt: true,
  density: 'comfortable',
}

export const MAX_PINNED_ACHIEVEMENTS = 3

export const MAX_STATUS_LENGTH = 60

export const BANNER_STYLES: { id: BannerStyle; label: string; icon: string }[] = [
  { id: 'aurora', label: 'Aurora', icon: 'fa-solid fa-gem' },
  { id: 'candles', label: 'Mercado', icon: 'fa-solid fa-chart-simple' },
  { id: 'grid', label: 'Cuadrícula', icon: 'fa-solid fa-table-cells' },
  { id: 'waves', label: 'Olas', icon: 'fa-solid fa-water' },
  { id: 'stars', label: 'Galaxia', icon: 'fa-solid fa-meteor' },
  { id: 'cover', label: 'Mi imagen', icon: 'fa-solid fa-image' },
]

export const FRAME_STYLES: { id: FrameStyle; label: string; icon: string }[] = [
  { id: 'none', label: 'Sin marco', icon: 'fa-regular fa-circle' },
  { id: 'solid', label: 'Sólido', icon: 'fa-solid fa-circle' },
  { id: 'rainbow', label: 'Arcoíris', icon: 'fa-solid fa-palette' },
  { id: 'pulse', label: 'Pulso', icon: 'fa-solid fa-heart-pulse' },
  { id: 'orbit', label: 'Órbita', icon: 'fa-solid fa-satellite' },
]

export const AVATAR_SHAPES: { id: AvatarShape; label: string }[] = [
  { id: 'circle', label: 'Círculo' },
  { id: 'rounded', label: 'Redondeado' },
  { id: 'hexagon', label: 'Hexágono' },
]

export const STAT_OPTIONS: { id: StatId; label: string; icon: string }[] = [
  { id: 'level', label: 'Nivel', icon: 'fa-solid fa-star' },
  { id: 'coins', label: 'Monedas', icon: 'fa-solid fa-coins' },
  { id: 'streak', label: 'Racha', icon: 'fa-solid fa-fire' },
  { id: 'achievements', label: 'Logros', icon: 'fa-solid fa-trophy' },
  { id: 'topics', label: 'Temas', icon: 'fa-solid fa-layer-group' },
]

export const STATUS_ICONS: { icon: string; label: string }[] = [
  { icon: 'fa-solid fa-book-open', label: 'Estudiando' },
  { icon: 'fa-solid fa-chart-line', label: 'Operando' },
  { icon: 'fa-solid fa-fire', label: 'En racha' },
  { icon: 'fa-solid fa-mug-hot', label: 'Descansando' },
  { icon: 'fa-solid fa-moon', label: 'Nocturno' },
  { icon: 'fa-solid fa-rocket', label: 'Con todo' },
  { icon: 'fa-solid fa-brain', label: 'Concentrado' },
  { icon: 'fa-solid fa-gamepad', label: 'Jugando' },
]

export const STATUS_SUGGESTIONS: string[] = [
  'Estudiando análisis técnico',
  'Practicando en el exchange spot',
  'Cuidando mi racha diaria',
  'Modo concentración activado',
]

export const BANNER_PRESETS: { id: string; label: string; a: string; b: string }[] = [
  { id: 'accent', label: 'Acento', a: '', b: '' },
  { id: 'ocean', label: 'Océano', a: '#0ea5e9', b: '#6366f1' },
  { id: 'sunset', label: 'Atardecer', a: '#f97316', b: '#ec4899' },
  { id: 'forest', label: 'Bosque', a: '#10b981', b: '#0ea5e9' },
  { id: 'violet', label: 'Violeta', a: '#8b5cf6', b: '#ec4899' },
  { id: 'ember', label: 'Brasas', a: '#ef4444', b: '#f59e0b' },
  { id: 'mono', label: 'Grafito', a: '#334155', b: '#94a3b8' },
]

export const FRAME_COLORS: string[] = [
  '',
  '#0ea5e9',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
]

export const DEFAULT_BANNER_A = 'var(--grad-a, var(--primary))'

export const DEFAULT_BANNER_B = 'var(--grad-b, color-mix(in srgb, var(--primary) 40%, #8b5cf6))'