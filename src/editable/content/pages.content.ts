import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Visual portfolios and creative work',
      description: 'Discover featured work and image-led stories through a polished editorial layout.',
      openGraphTitle: 'Visual portfolios and creative work',
      openGraphDescription: 'Browse featured work and visual stories in one curated space.',
      keywords: ['portfolio', 'visual discovery', 'creative browsing'],
    },
    hero: {
      badge: 'Creative discovery',
      title: ['A polished home for', 'portfolios and image-led work.'],
      description: 'Explore featured visuals and editorial highlights through a layout inspired by premium photography showcases.',
      primaryCta: { label: 'Browse featured work', href: '/image' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search portfolios and posts',
      focusLabel: 'Featured focus',
      featureCardBadge: 'editorial spotlight',
      featureCardTitle: 'Recent work rises to the top in a bold, gallery-first layout.',
      featureCardDescription: 'The homepage keeps visual work and useful discovery paths in one calm system.',
    },
    intro: {
      badge: 'About the site',
      title: 'Built to showcase creative work with clarity and presence.',
      paragraphs: [
        'This site brings together image-led posts and related discoveries so visitors can move naturally between different kinds of work.',
        'Instead of separating each section into a disconnected template, the layout keeps everything visually linked with consistent navigation and clear browsing patterns.',
        'Whether someone starts with a portfolio image, a listing, or a story, they can keep exploring without losing their place.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A homepage built around strong imagery, bold type, and spacious sections.',
        'Connected pages for articles, images, listings, and saved resources.',
        'Multiple card styles keep the browsing rhythm varied and engaging.',
        'A responsive system that stays polished on mobile and desktop alike.',
      ],
      primaryLink: { label: 'Browse images', href: '/image' },
      secondaryLink: { label: 'Browse all work', href: '/search' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Move through featured work, useful posts, and polished pages in one connected system.',
      description: 'The layout is tuned for discoverability, giving each section a clear role while keeping the full site feeling cohesive.',
      primaryCta: { label: 'Browse the archive', href: '/search' },
      secondaryCta: { label: 'Get in touch', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calm, high-contrast place to explore creative work.',
    description: `${slot4BrandConfig.siteName} presents visual portfolios, profiles, and useful posts in one connected experience.`,
    paragraphs: [
      'Instead of splitting everything into disconnected pages, the platform keeps related content easy to move through and easy to understand.',
      'Whether someone starts with an article, listing, image post, or profile page, they can continue exploring without losing context.',
    ],
    values: [
      {
        title: 'Image-led presentation',
        description: 'Large visuals, clean cards, and bold hierarchy keep the browsing experience memorable.',
      },
      {
        title: 'Connected browsing',
        description: 'Articles, visual posts, listings, profiles, and resources stay linked so discovery feels natural.',
      },
      {
        title: 'Simple and trustworthy',
        description: 'Clear navigation and consistent structure help visitors find useful content faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Start a conversation about work, collaboration, or publishing.',
    description: 'Tell us what you want to share, build, or launch and we will route it to the right place.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find stories, visuals, profiles, and listings faster.',
      description: 'Use keywords, categories, and content types to discover posts from every active section of the site.',
      placeholder: 'Search by keyword, topic, category, or title',
    },
    resultsTitle: 'Latest searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Sign in to create new content.',
      description: 'Use your account to open the publishing workspace and create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a clean post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Sign in to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Sign in successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
