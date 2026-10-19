export interface ThemePreview {
  background: string
  surface: string
  text: string
  gradient: string
}

export interface ThemeOption {
  id: string
  name: string
  desc: string
  accent: string | null
  group: 'classic' | 'vibrant'
  preview: ThemePreview
}

export const DEFAULT_ACCENT = '#0284c7'

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'aurora',
    name: 'Aurora',
    desc: 'Noche profunda con luces verde agua y violeta',
    accent: '#2dd4bf',
    group: 'vibrant',
    preview: {
      background:
        'radial-gradient(circle at 12% 0%, rgba(45,212,191,0.6), transparent 55%), radial-gradient(circle at 92% 8%, rgba(139,92,246,0.65), transparent 55%), #070b1a',
      surface: 'rgba(18,26,52,0.85)',
      text: '#eef2ff',
      gradient: 'linear-gradient(135deg, #2dd4bf, #8b5cf6)',
    },
  },
  {
    id: 'neon',
    name: 'Neón Tokio',
    desc: 'Ciruela eléctrico con rosa y cian',
    accent: '#ff4ecd',
    group: 'vibrant',
    preview: {
      background:
        'radial-gradient(circle at 90% 0%, rgba(244,63,94,0.6), transparent 55%), radial-gradient(circle at 0% 100%, rgba(34,211,238,0.5), transparent 55%), #0d0618',
      surface: 'rgba(32,14,56,0.85)',
      text: '#fdf2ff',
      gradient: 'linear-gradient(135deg, #ff4ecd, #7c3aed 55%, #22d3ee)',
    },
  },
  {
    id: 'sunset',
    name: 'Atardecer',
    desc: 'Borgoña cálido con naranja y fucsia',
    accent: '#fb923c',
    group: 'vibrant',
    preview: {
      background:
        'radial-gradient(circle at 100% 0%, rgba(251,146,60,0.65), transparent 55%), radial-gradient(circle at 0% 0%, rgba(236,72,153,0.5), transparent 55%), #1a0b12',
      surface: 'rgba(50,20,32,0.85)',
      text: '#fff1e6',
      gradient: 'linear-gradient(135deg, #fb923c, #ec4899)',
    },
  },
  {
    id: 'ocean',
    name: 'Océano',
    desc: 'Azul petróleo con destellos turquesa',
    accent: '#22d3ee',
    group: 'vibrant',
    preview: {
      background:
        'radial-gradient(circle at 0% 0%, rgba(34,211,238,0.6), transparent 55%), radial-gradient(circle at 100% 100%, rgba(37,99,235,0.6), transparent 55%), #031a24',
      surface: 'rgba(6,42,58,0.85)',
      text: '#e6fbff',
      gradient: 'linear-gradient(135deg, #22d3ee, #2563eb)',
    },
  },
  {
    id: 'sakura',
    name: 'Sakura',
    desc: 'Claro con degradados rosa, lila y dorado',
    accent: '#db2777',
    group: 'vibrant',
    preview: {
      background:
        'radial-gradient(circle at 0% 0%, rgba(244,114,182,0.6), transparent 55%), radial-gradient(circle at 100% 10%, rgba(167,139,250,0.6), transparent 55%), radial-gradient(circle at 50% 120%, rgba(251,191,36,0.35), transparent 55%), #fff5fa',
      surface: 'rgba(255,255,255,0.9)',
      text: '#3b0a2a',
      gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
    },
  },
  {
    id: 'light',
    name: 'Light Clean',
    desc: 'Fondo claro y espacioso',
    accent: null,
    group: 'classic',
    preview: {
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      gradient: 'linear-gradient(135deg, #0284c7, #0369a1)',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal Mono',
    desc: 'Monocromo neutral y limpio',
    accent: null,
    group: 'classic',
    preview: {
      background: '#fafafa',
      surface: '#ffffff',
      text: '#18181b',
      gradient: 'linear-gradient(135deg, #18181b, #52525b)',
    },
  },
  {
    id: 'dark',
    name: 'Dark Slate',
    desc: 'Fondo oscuro pizarra',
    accent: null,
    group: 'classic',
    preview: {
      background: '#0b1120',
      surface: '#1e293b',
      text: '#f8fafc',
      gradient: 'linear-gradient(135deg, #38bdf8, #818cf8)',
    },
  },
]

export const ACCENT_COLORS: string[] = [
  '#0284c7',
  '#06b6d4',
  '#14b8a6',
  '#22c55e',
  '#eab308',
  '#f97316',
  '#ef4444',
  '#ec4899',
  '#a855f7',
  '#6366f1',
]
