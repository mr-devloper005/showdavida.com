import type { CSSProperties } from 'react'

/*
  Showdavida visual system
  ------------------------
  A dark, warm-charcoal magazine surface with a single coral accent.
  Every colour in src/editable comes from these tokens, so the whole
  site can be re-skinned by editing this one block.
*/

export const editableRootStyle = {
  // --- core showdavida tokens ---------------------------------------------
  '--sd-bg': '#17100e',
  '--sd-bg-2': '#1d1512',
  '--sd-surface': '#241a16',
  '--sd-surface-2': '#2c211c',
  '--sd-ticker': '#0e0908',
  '--sd-nav': '#1a1210',
  '--sd-promo': '#42201a',
  '--sd-tabs': '#150e0c',
  '--sd-hero': '#4a2319',
  '--sd-hero-2': '#3a1b13',

  '--sd-text': '#f6efec',
  '--sd-muted': 'rgba(246,239,236,0.58)',
  '--sd-faint': 'rgba(246,239,236,0.38)',
  '--sd-line': 'rgba(255,255,255,0.09)',
  '--sd-line-strong': 'rgba(255,255,255,0.16)',

  '--sd-accent': '#f4744f',
  '--sd-accent-strong': '#e35d36',
  '--sd-accent-soft': 'rgba(244,116,79,0.14)',
  '--sd-accent-ring': 'rgba(244,116,79,0.38)',
  '--sd-star': '#f4874f',

  '--sd-radius-sm': '0.6rem',
  '--sd-radius': '0.9rem',
  '--sd-radius-lg': '1.25rem',
  '--sd-shadow': '0 10px 30px rgba(0,0,0,0.35)',
  '--sd-shadow-lg': '0 22px 60px rgba(0,0,0,0.5)',

  '--editable-container': '1340px',
  '--editable-page-bg': '#17100e',
  '--editable-page-text': '#f6efec',
  '--editable-border': 'rgba(255,255,255,0.09)',

  // --- legacy slot4 aliases (kept so older class strings still resolve) ----
  '--slot4-page-bg': '#17100e',
  '--slot4-page-text': '#f6efec',
  '--slot4-panel-bg': '#1d1512',
  '--slot4-surface-bg': '#241a16',
  '--slot4-muted-text': 'rgba(246,239,236,0.58)',
  '--slot4-soft-muted-text': 'rgba(246,239,236,0.48)',
  '--slot4-accent': '#f4744f',
  '--slot4-accent-fill': '#f4744f',
  '--slot4-accent-soft': 'rgba(244,116,79,0.16)',
  '--slot4-dark-bg': '#0e0908',
  '--slot4-dark-text': '#f6efec',
  '--slot4-media-bg': '#2c211c',
  '--slot4-cream': '#1d1512',
  '--slot4-warm': '#1a1210',
  '--slot4-lavender': 'rgba(244,116,79,0.16)',
  '--slot4-gray': '#241a16',
  '--slot4-body-gradient': 'linear-gradient(180deg, #1a1210 0%, #17100e 420px, #17100e 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--sd-bg)]',
  pageText: 'text-[var(--sd-text)]',
  panelBg: 'bg-[var(--sd-bg-2)]',
  panelText: 'text-[var(--sd-text)]',
  surfaceBg: 'bg-[var(--sd-surface)]',
  surfaceText: 'text-[var(--sd-text)]',
  mutedText: 'text-[var(--sd-muted)]',
  softMutedText: 'text-[var(--sd-muted)]',
  accentText: 'text-[var(--sd-accent)]',
  accentBg: 'bg-[var(--sd-accent)]',
  accentSoftBg: 'bg-[var(--sd-accent-soft)]',
  accentSoftText: 'text-[var(--sd-accent)]',
  darkBg: 'bg-[var(--sd-ticker)]',
  darkText: 'text-[var(--sd-text)]',
  mediaBg: 'bg-[var(--sd-surface-2)]',
  creamBg: 'bg-[var(--sd-bg-2)]',
  warmBg: 'bg-[var(--sd-nav)]',
  lavenderBg: 'bg-[var(--sd-accent-soft)]',
  grayBg: 'bg-[var(--sd-surface)]',
  border: 'border-[var(--sd-line)]',
  darkBorder: 'border-[var(--sd-line)]',
  shadow: 'shadow-[var(--sd-shadow)]',
  shadowStrong: 'shadow-[var(--sd-shadow-lg)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(10,7,6,0)_35%,rgba(10,7,6,0.88)_100%)]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-14 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-4',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch',
    rail: 'flex snap-x gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[250px] shrink-0 snap-start sm:w-[280px]',
    masonry: 'columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em]',
    heroTitle: 'text-[2.4rem] font-bold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[3.6rem]',
    sectionTitle: 'text-[1.7rem] font-bold leading-[1.15] tracking-[-0.025em] sm:text-[2.2rem]',
    body: 'text-[15px] leading-[1.75]',
  },
  surface: {
    card: `rounded-[var(--sd-radius-lg)] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[var(--sd-radius-lg)] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[var(--sd-radius-lg)] border ${editablePalette.border} bg-[var(--sd-ticker)] ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--sd-accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--sd-accent-strong)] hover:-translate-y-0.5 hover:shadow-[0_12px_28px_var(--sd-accent-ring)]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--sd-line-strong)] bg-white/[0.04] px-6 py-3 text-sm font-semibold text-[var(--sd-text)] transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.1]',
    ghost:
      'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-[var(--sd-muted)] transition duration-200 hover:text-[var(--sd-text)]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--sd-accent)] px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--sd-accent-strong)]',
  },
  chip: {
    base: 'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition duration-200',
    quiet: 'border border-[var(--sd-line)] bg-white/[0.04] text-[var(--sd-muted)] hover:border-[var(--sd-accent-ring)] hover:text-[var(--sd-text)]',
    active: 'bg-[var(--sd-accent)] text-white',
    solid: 'bg-black/55 text-white backdrop-blur',
  },
  badge: {
    accent: 'inline-flex items-center rounded-full bg-[var(--sd-accent)] px-2.5 py-1 text-[10px] font-bold text-white',
    dark: 'inline-flex items-center rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white/85 backdrop-blur',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[var(--sd-radius)] bg-[var(--sd-surface-2)]',
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[var(--sd-shadow-lg)]',
    fade: 'transition duration-300 hover:opacity-85',
    zoom: 'transition duration-[800ms] ease-out group-hover:scale-[1.06]',
  },
} as const

export const aiLayoutRules = [
  'All colour lives in editableRootStyle; change the --sd-* tokens to re-skin the entire site.',
  'Home structure lives in src/editable/sections/HomeSections.tsx.',
  'Cards live in src/editable/cards/PostCards.tsx and intentionally use several different shapes.',
  'Keep dynamic post fetching intact; never replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
  'Render every post field defensively: image, summary and category can all be missing.',
] as const
