import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)

export const slot4BrandConfig = {
  siteName: siteIdentity.name,
  tagline: siteIdentity.tagline,
  domain: siteIdentity.domain,
  baseUrl: siteIdentity.url,
  productKind,
  ogImage: siteIdentity.ogImage,
  // One house palette for every product kind: warm charcoal + coral accent.
  accents: { primary: '#f4744f', surface: '#17100e' },
} as const

export const showdavidaBrand = {
  bg: '#17100e',
  panel: '#1d1512',
  surface: '#241a16',
  ink: '#0e0908',
  hero: '#4a2319',
  accent: '#f4744f',
  accentStrong: '#e35d36',
  text: '#f6efec',
  muted: '#9b8c86',
  navTagline: 'A visual directory for business owners',
} as const
