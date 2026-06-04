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
  accents:
    productKind === 'visual'
      ? { primary: '#c7df23', surface: '#111111' }
      : productKind === 'editorial'
        ? { primary: '#111111', surface: '#f4f0e6' }
        : productKind === 'directory'
          ? { primary: '#111111', surface: '#f7f5ef' }
          : { primary: '#111111', surface: '#f4efe4' },
} as const
