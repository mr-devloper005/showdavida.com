import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A visual business directory',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A visual directory for business owners',
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Images', href: '/image' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
    ],
    actions: {
      primary: { label: 'Get Started', href: '/signup' },
      secondary: { label: 'Sign In', href: '/login' },
    },
  },
  footer: {
    tagline: 'Business galleries and fresh listings',
    description:
      'An image-led directory for business owners and independent operators. Browse verified listings, open the detail you need, and move on quickly.',
    columns: [
      {
        title: 'Browse',
        links: [
          { label: 'Images', href: '/image' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Sign in', href: '/login' },
          { label: 'Get started', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Updated daily',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'More like this',
    published: 'Published',
  },
} as const
