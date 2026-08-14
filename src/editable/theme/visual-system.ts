import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

/*
  Showdavida runs one house palette: warm charcoal surfaces with a single
  coral accent. Each preset below is tuned to that house style so the site
  never drifts into a different colour world when a preset changes.
*/

const house = {
  bg: '#17100e',
  panel: '#1d1512',
  surface: '#241a16',
  ink: '#0e0908',
  text: '#f6efec',
  muted: '#9b8c86',
  accent: '#f4744f',
  accentDeep: '#e35d36',
} as const

export const visualPresets = {
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'calm magazine authority',
    fontDirection: 'quiet sans headlines with a generous reading measure',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'soft editorial cards with fine hairline borders',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, restrained, polished',
    fontDirection: 'tight display headings with spacious label tracking',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accentDeep,
      surface: house.panel,
    },
    shape: 'large charcoal panels, coral hairlines, generous negative space',
  },
  'brutalist-index': {
    label: 'Brutalist Index',
    mood: 'bold, raw, memorable',
    fontDirection: 'condensed headings, mono labels, hard rhythm',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'flat blocks, thick rules, offset modules',
  },
  'organic-journal': {
    label: 'Organic Journal',
    mood: 'warm, natural, trustworthy',
    fontDirection: 'humanist sans with soft captions',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'rounded cards, natural spacing, calm texture',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, fast, useful',
    fontDirection: 'modern sans with crisp data accents',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'clean grids, pill filters, sharp information hierarchy',
  },
  'retro-bulletin': {
    label: 'Retro Bulletin',
    mood: 'playful, local, energetic',
    fontDirection: 'chunky headings with friendly body type',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accentDeep,
      surface: house.panel,
    },
    shape: 'stickers, tabs, framed modules, playful dividers',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: {
      background: house.bg,
      foreground: house.text,
      muted: house.muted,
      primary: house.ink,
      accent: house.accent,
      surface: house.surface,
    },
    shape: 'charcoal chrome, large media tiles, coral highlights',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'visual-gallery',
  ink: house.ink,
  accent: house.accent,
  radius: {
    sm: '0.6rem',
    md: '0.9rem',
    lg: '1.25rem',
    xl: '1.8rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    // CSS-only equivalents defined in editable-global.css and used by the sections.
    pageLoadCss: 'sd-rise',
    staggerCss: 'sd-stagger',
    cardHover: 'transition duration-300 hover:-translate-y-1 hover:shadow-[var(--sd-shadow-lg)]',
    softHover: 'transition duration-300 hover:opacity-85',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em]',
    heroTitle: 'text-5xl font-bold leading-[1.05] tracking-[-0.03em] sm:text-6xl lg:text-[3.6rem]',
    sectionTitle: 'text-[1.7rem] font-bold tracking-[-0.025em] sm:text-[2.2rem]',
    body: 'text-[15px] leading-[1.75]',
    caption: 'text-[11px] font-semibold uppercase tracking-[0.18em]',
  },
  surfaces: {
    glass: 'border border-white/12 bg-white/[0.06] backdrop-blur-xl',
    paper: 'border border-[var(--sd-line)] bg-[var(--sd-surface)] shadow-[var(--sd-shadow)]',
    quiet: 'border border-[var(--sd-line)] bg-white/[0.03]',
    dark: 'border border-[var(--sd-line)] bg-[var(--sd-ticker)] shadow-[var(--sd-shadow-lg)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-14 lg:py-20',
    cardGrid: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-4',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name] || visualPresets['visual-gallery']
}
