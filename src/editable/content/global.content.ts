import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Independent reading platform',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Curated portfolios and profiles',
    primaryLinks: [
      { label: 'Home', href: '/' },
      { label: 'Articles', href: '/article' },
      { label: 'Images', href: '/image' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Try free', href: '/search' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Stories, images, and professional profiles',
    description: 'A polished space for discovering visual portfolios, useful resources, business listings, and featured posts.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Articles', href: '/article' },
          { label: 'Images', href: '/image' },
          { label: 'Listings', href: '/listing' },
          { label: 'Profiles', href: '/profile' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Search', href: '/search' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Built for clean discovery and connected browsing.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
