import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f2efe6',
  '--slot4-page-text': '#111111',
  '--slot4-panel-bg': '#ede8db',
  '--slot4-surface-bg': '#fffdf8',
  '--slot4-muted-text': '#5b5548',
  '--slot4-soft-muted-text': '#726c5f',
  '--slot4-accent': '#cddc2e',
  '--slot4-accent-fill': '#c7df23',
  '--slot4-accent-soft': '#eef39f',
  '--slot4-dark-bg': '#111111',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#ddd8cb',
  '--slot4-cream': '#f6f1e5',
  '--slot4-warm': '#fbf8ef',
  '--slot4-lavender': '#e5e7d6',
  '--slot4-gray': '#f5f3ec',
  '--slot4-body-gradient': 'linear-gradient(180deg, #f4f0e6 0%, #f0ebe0 44%, #f7f4ed 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-black/[0.08]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_18px_48px_rgba(17,17,17,0.08)]',
  shadowStrong: 'shadow-[0_28px_90px_rgba(17,17,17,0.16)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(17,17,17,0.68))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[160px] shrink-0 snap-start sm:w-[180px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.26em]',
    heroTitle: 'text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-[4.5rem]',
    sectionTitle: 'text-3xl font-black tracking-[-0.06em] sm:text-4xl',
    body: 'text-base leading-relaxed',
  },
  surface: {
    card: `rounded-[1.8rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[1.8rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: `inline-flex items-center justify-center gap-2 rounded-full border border-black/80 bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-black/90`,
    secondary: `inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/80 px-6 py-3 text-sm font-black ${editablePalette.surfaceText} transition hover:-translate-y-0.5 hover:bg-white`,
    accent: `inline-flex items-center justify-center gap-2 rounded-full border border-black/80 bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:brightness-95`,
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.6rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[2/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_68px_rgba(17,17,17,0.14)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all shared sections consume those CSS variables.',
  'Keep page structure in src/editable/sections/HomeSections.tsx so the visual system stays consistent across the home experience.',
  'Use wide readable grids and avoid skinny columns for paragraphs or cards.',
  'Mix hero cards, compact cards, horizontal cards, and image-led cards so the layout feels intentional.',
  'Keep dynamic post fetching intact; do not replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
