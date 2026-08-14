import { slot4BrandConfig } from '@/editable/theme/brand.config'

const siteName = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'A visual directory of local businesses and the people behind them',
      description:
        'Browse verified business galleries and updates in one image-led directory built for owners and the people looking for them.',
      openGraphTitle: 'A visual directory of local businesses and the people behind them',
      openGraphDescription: 'Discover business galleries and fresh listings in one clean, image-led directory.',
      keywords: ['business directory', 'local businesses', 'visual directory', 'galleries', 'listings'],
    },
    hero: {
      badge: 'Featured this week',
      title: ['Find & Connect With', 'Local Businesses'],
      description:
        'Browse verified business listings, stunning images, and curated galleries. Your go-to directory for discovering exactly what you need.',
      primaryCta: { label: 'Browse Galleries', href: '/image' },
      secondaryCta: { label: 'List Your Business', href: '/signup' },
      searchPlaceholder: 'Search businesses, images...',
      focusLabel: 'Featured focus',
      featureCardBadge: 'Editorial spotlight',
      featureCardTitle: 'Fresh listings land here as soon as they publish.',
      featureCardDescription: 'Once content is live, this space fills with the newest galleries from across the directory.',
      meta: ['Free to list', 'Verified listings', 'Updated daily'],
      strip: ['Verified listings', 'Local discovery', 'Updated daily'],
    },
    justAdded: {
      eyebrow: 'Just added!',
      title: 'New listings & images, right now.',
      flag: 'New!',
    },
    recent: {
      eyebrow: 'Fresh this week',
      title: 'New in the last 7 days',
      actionLabel: 'See all',
    },
    spotlight: {
      eyebrow: 'Worth a closer look',
      title: 'The listings people keep coming back to',
      description: 'One larger feature with supporting entries underneath, so every scroll has a clear point of focus.',
      featureLabel: 'Spotlight',
    },
    mosaic: {
      eyebrow: 'Keep exploring',
      title: 'A wider view of the directory',
      description: 'A looser, image-led grid for the moments when you would rather browse than search.',
    },
    aside: {
      eyebrow: 'Quick access',
      title: 'Find the right business in a few clicks.',
      description: 'Jump straight into the full index, or pick up where the newest entries leave off.',
      listTitle: 'Recently added',
    },
    intro: {
      badge: 'Why it works',
      title: 'Built so a business is easy to understand at a glance.',
      paragraphs: [
        'The directory leads with imagery, because one strong visual usually explains more than a paragraph of description.',
        'Each section changes rhythm — wide features, compact rows, loose mosaics — so browsing feels considered rather than repetitive.',
        'Everything stays fast and readable on a phone, which is where most people will find you.',
      ],
      sideBadge: 'What you get',
      sidePoints: [
        'An image-first home page with search and section tabs up front.',
        'Several card styles so the feed never reads as one long template.',
        'Detail pages with room for a full set of visuals and supporting notes.',
        'Dark, grounded chrome that keeps attention on the work itself.',
      ],
      primaryLink: { label: 'Browse galleries', href: '/image' },
      secondaryLink: { label: 'View all', href: '/search' },
    },
    cta: {
      badge: 'Get listed',
      title: 'Put your business in front of people already looking.',
      description:
        'Adding a listing takes a couple of minutes. Bring your images, a short description, and the details customers actually ask for.',
      primaryCta: { label: 'Get started', href: '/signup' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'New entries appear here automatically as they are published.',
    },
  },
  about: {
    badge: 'About',
    title: 'A visual directory built for people who run things.',
    description: `${siteName} keeps business galleries and updates in one clear browsing experience, with the imagery doing most of the talking.`,
    paragraphs: [
      'The site is built for owners, operators, and small teams who want their work found without visitors wading through a cluttered interface.',
      'Every page uses the same visual language, so moving from a grid to a detail view never feels like landing on a different website.',
      'The layout stays deliberately quiet: dark chrome, generous spacing, and a single warm accent used only where it helps you act.',
    ],
    values: [
      {
        title: 'Image-led presentation',
        description: 'Large visuals, clean cards, and clear hierarchy make browsing memorable rather than exhausting.',
      },
      {
        title: 'Connected browsing',
        description: 'Galleries and listings stay linked, so discovery keeps moving instead of dead-ending.',
      },
      {
        title: 'Simple and trustworthy',
        description: 'Consistent structure and plain navigation help visitors find what they need faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${siteName}`,
    title: 'Send a short note and we will point it the right way.',
    description: 'Use this page for listings, corrections, or general questions. The form stays short on purpose.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search businesses, galleries, and content across the site.',
    },
    hero: {
      badge: 'Search the directory',
      title: 'Find businesses and images faster.',
      description: 'Use keywords, categories, and content types to discover listings from every active section of the directory.',
      placeholder: 'Search by keyword, category, business name, or topic',
    },
    resultsTitle: 'Latest directory content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Member access',
      title: 'Sign in to add a new listing.',
      description: 'Use your account to open the publishing workspace and prepare a listing for the directory.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Add your business to the directory.',
      description: 'Add the details, bring your images, and prepare a polished listing with links and supporting text.',
    },
    formTitle: 'Listing details',
    submitLabel: 'Submit listing',
    successTitle: 'Listing saved successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Sign in to keep browsing, manage your listings, and add new content from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create an account first, then sign in.',
      success: 'Sign in successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Get started',
      title: 'Create your account and list your business.',
      description: 'An account unlocks the publishing workspace and keeps your details saved between visits.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reading',
      fallbackTitle: 'Post details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'More like this',
      fallbackTitle: 'Gallery details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const

/** Convenience alias used by the home sections. */
export const homeContent = pagesContent.home
