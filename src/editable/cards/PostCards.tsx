import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ArrowUpRight, Images, Star, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/* -------------------------------------------------------------------------
   Safe post readers - every field can be missing, nothing here may throw.
   ------------------------------------------------------------------------- */

const asRecord = (post?: SitePost | null) =>
  post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export const FALLBACK_POST_IMAGE = '/placeholder.svg?height=900&width=1400'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = asRecord(post)
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const single = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return mediaUrl || contentImage || single || logo || FALLBACK_POST_IMAGE
}

export function getEditablePostImages(post?: SitePost | null, limit = 12) {
  const content = asRecord(post)
  const media = Array.isArray(post?.media)
    ? post!.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && Boolean(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && Boolean(url))
    : []
  const singles = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter(Boolean)
  return Array.from(new Set([...media, ...images, ...singles])).slice(0, limit)
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = asRecord(post)
  const raw = asText(content.description) || asText(content.summary) || asText(content.excerpt) || post?.summary || ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (!clean) return ''
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null, fallback = 'Featured') {
  const content = asRecord(post)
  return asText(content.category) || post?.tags?.[0] || fallback
}

export function getEditableTitle(post?: SitePost | null, fallback = 'Untitled post') {
  return post?.title?.trim() || fallback
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  const slug = post?.slug || ''
  return slug ? `${route}/${slug}` : route
}

/** Deterministic score derived from the title so server and client always agree. */
export function getEditableRating(post?: SitePost | null) {
  const source = `${post?.title || ''}${post?.slug || ''}`
  let hash = 0
  for (let index = 0; index < source.length; index += 1) {
    hash = ((hash << 5) - hash + source.charCodeAt(index)) | 0
  }
  const rating = 3.6 + (Math.abs(hash) % 15) / 10
  const reviews = 22 + (Math.abs(hash >> 3) % 430)
  return { rating: Math.round(rating * 10) / 10, reviews }
}

/* -------------------------------------------------------------------------
   Shared micro components
   ------------------------------------------------------------------------- */

export function StarRating({ rating, reviews }: { rating: number; reviews?: number }) {
  const rounded = Math.round(rating)
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star
            key={index}
            className={`h-3.5 w-3.5 ${index < rounded ? 'fill-[var(--sd-star)] text-[var(--sd-star)]' : 'text-white/18'}`}
          />
        ))}
      </span>
      <span className="text-[13px] font-semibold text-[var(--sd-text)]">{rating.toFixed(1)}</span>
      {typeof reviews === 'number' ? <span className="text-[13px] text-[var(--sd-faint)]">({reviews})</span> : null}
    </div>
  )
}

export function CategoryPill({ children, tone = 'dark' }: { children: ReactNode; tone?: 'dark' | 'accent' | 'light' }) {
  const tones = {
    dark: 'bg-black/62 text-white/90 backdrop-blur',
    accent: 'bg-[var(--sd-accent)] text-white',
    light: 'bg-white/92 text-[#17100e] backdrop-blur',
  } as const
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-semibold ${tones[tone]}`}>{children}</span>
}

function PostImage({ post, className = '' }: { post: SitePost; className?: string }) {
  return (
    <img
      src={getEditablePostImage(post)}
      alt={getEditableTitle(post, 'Post image')}
      loading="lazy"
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

/* -------------------------------------------------------------------------
   STYLE 1 - Featured overlay card (large, cinematic)
   ------------------------------------------------------------------------- */

export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  const excerpt = getEditableExcerpt(post, 170)
  return (
    <Link
      href={href}
      className={`group relative block min-w-0 overflow-hidden rounded-[var(--sd-radius-lg)] ${pal.mediaBg} ${pal.shadowStrong}`}
    >
      <div className="relative min-h-[360px] sm:min-h-[430px] lg:min-h-[500px]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,6,0.12)_25%,rgba(10,7,6,0.9)_100%)]" />
        <div className="relative flex h-full min-h-[360px] flex-col justify-end p-6 sm:min-h-[430px] sm:p-8 lg:min-h-[500px]">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill tone="accent">{label}</CategoryPill>
            <CategoryPill>{getEditableCategory(post)}</CategoryPill>
          </div>
          <h3 className="mt-4 max-w-2xl text-2xl font-bold leading-[1.16] tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.3rem]">
            {getEditableTitle(post)}
          </h3>
          {excerpt ? <p className="mt-3 max-w-xl text-sm leading-[1.75] text-white/65">{excerpt}</p> : null}
          <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition duration-300 group-hover:gap-3">
            Open feature <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 2 - Rail card (image top, caption under)
   ------------------------------------------------------------------------- */

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 84)
  return (
    <Link
      href={href}
      className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)]`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sd-surface-2)]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
        <span className="absolute left-3 top-3">
          <CategoryPill>{getEditableCategory(post)}</CategoryPill>
        </span>
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-white backdrop-blur">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--sd-text)]">{getEditableTitle(post)}</h3>
        {excerpt ? <p className="mt-2 line-clamp-2 text-[13px] leading-[1.6] text-[var(--sd-muted)]">{excerpt}</p> : null}
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 3 - Compact numbered index row
   ------------------------------------------------------------------------- */

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 96)
  return (
    <Link
      href={href}
      className="group flex min-w-0 items-start gap-4 rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--sd-accent-ring)]"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-[13px] font-bold text-[var(--sd-accent)] transition duration-300 group-hover:bg-[var(--sd-accent)] group-hover:text-white">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sd-accent)]">
          {getEditableCategory(post)}
        </span>
        <span className="mt-1.5 block line-clamp-2 text-[15px] font-semibold leading-snug text-[var(--sd-text)]">
          {getEditableTitle(post)}
        </span>
        {excerpt ? <span className="mt-1.5 block line-clamp-2 text-[13px] leading-[1.6] text-[var(--sd-muted)]">{excerpt}</span> : null}
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 4 - Horizontal editorial card
   ------------------------------------------------------------------------- */

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const excerpt = getEditableExcerpt(post, 190)
  return (
    <Link
      href={href}
      className="group grid min-w-0 overflow-hidden rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)] sm:grid-cols-[minmax(0,250px)_minmax(0,1fr)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sd-surface-2)] sm:aspect-auto sm:min-h-[200px]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--sd-accent)]">{getEditableCategory(post)}</span>
          <span className="text-[11px] font-medium text-[var(--sd-faint)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="mt-2.5 line-clamp-2 text-xl font-bold leading-snug tracking-[-0.015em] text-[var(--sd-text)] sm:text-[1.35rem]">
          {getEditableTitle(post)}
        </h2>
        {excerpt ? <p className="mt-3 line-clamp-3 text-sm leading-[1.75] text-[var(--sd-muted)]">{excerpt}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sd-accent)] transition group-hover:gap-2.5">
          Read more <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 5 - Image-first card with rating (grid workhorse)
   ------------------------------------------------------------------------- */

export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  const { rating, reviews } = getEditableRating(post)
  const excerpt = getEditableExcerpt(post, 110)
  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sd-surface-2)]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
        <span className="absolute left-3 top-3">
          <CategoryPill tone="accent">{getEditableCategory(post, 'Featured')}</CategoryPill>
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em] text-[var(--sd-text)]">
          {getEditableTitle(post)}
        </h3>
        <div className="mt-3">
          <StarRating rating={rating} reviews={reviews} />
        </div>
        {excerpt ? <p className="mt-3 line-clamp-2 text-sm leading-[1.7] text-[var(--sd-muted)]">{excerpt}</p> : null}
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 6 - Overlay tile with a "New!" flag (the just-added grid)
   ------------------------------------------------------------------------- */

export function OverlayTileCard({
  post,
  href,
  flag,
  action = 'View',
}: {
  post: SitePost
  href: string
  flag?: string
  action?: string
}) {
  return (
    <div className="group flex min-w-0 flex-col">
      <Link
        href={href}
        className="relative block overflow-hidden rounded-[var(--sd-radius)] bg-[var(--sd-surface-2)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--sd-shadow-lg)]"
      >
        <div className="relative aspect-[4/3]">
          <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,6,0.28)_0%,rgba(10,7,6,0)_42%,rgba(10,7,6,0.9)_100%)]" />
          {flag ? <span className="absolute left-3 top-3 rounded-full bg-[var(--sd-accent)] px-2.5 py-1 text-[10px] font-bold text-white">{flag}</span> : null}
          <span className="absolute right-3 top-3">
            <CategoryPill>{getEditableCategory(post, 'Directory')}</CategoryPill>
          </span>
          <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 p-4 text-[14px] font-semibold leading-snug text-white">
            {getEditableTitle(post)}
          </h3>
        </div>
      </Link>
      <Link
        href={href}
        className="mt-2.5 inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold text-[var(--sd-accent)] transition hover:gap-2.5"
      >
        {action} <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

/* -------------------------------------------------------------------------
   STYLE 7 - Mosaic tile with varying heights (masonry grids)
   ------------------------------------------------------------------------- */

export function MosaicImageCard({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const shapes = ['aspect-[4/5]', 'aspect-[4/3]', 'aspect-[1/1]', 'aspect-[3/4]', 'aspect-[16/11]', 'aspect-[5/6]']
  const shape = shapes[index % shapes.length]
  const count = getEditablePostImages(post).length
  return (
    <Link
      href={href}
      className="group block break-inside-avoid overflow-hidden rounded-[var(--sd-radius)] bg-[var(--sd-surface-2)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--sd-shadow-lg)]"
    >
      <div className={`relative w-full ${shape}`}>
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,6,0.3)_0%,rgba(10,7,6,0)_40%,rgba(10,7,6,0.9)_100%)]" />
        <span className="absolute left-3 top-3">
          <CategoryPill>{getEditableCategory(post, 'Gallery')}</CategoryPill>
        </span>
        {count > 1 ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
            <Images className="h-3 w-3" /> {count}
          </span>
        ) : null}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-3 text-[14px] font-semibold leading-snug text-white">{getEditableTitle(post)}</h3>
          <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--sd-accent)] transition group-hover:gap-2.5">
            View <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 8 - Profile card (avatar-led, for the profile task)
   ------------------------------------------------------------------------- */

export function ProfileAvatarCard({ post, href, role }: { post: SitePost; href: string; role?: string }) {
  const image = getEditablePostImages(post)[0]
  const excerpt = getEditableExcerpt(post, 92)
  const { rating, reviews } = getEditableRating(post)
  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col items-center rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)]"
    >
      <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--sd-surface-2)] ring-2 ring-white/10 transition duration-300 group-hover:ring-[var(--sd-accent-ring)]">
        {image ? (
          <img src={image} alt={getEditableTitle(post)} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-8 w-8 text-white/25" />
        )}
      </span>
      <h3 className="mt-4 line-clamp-2 text-[15px] font-bold leading-snug text-[var(--sd-text)]">{getEditableTitle(post)}</h3>
      {role ? <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-accent)]">{role}</p> : null}
      <div className="mt-3">
        <StarRating rating={rating} reviews={reviews} />
      </div>
      {excerpt ? <p className="mt-3 line-clamp-3 text-[13px] leading-[1.65] text-[var(--sd-muted)]">{excerpt}</p> : null}
    </Link>
  )
}

/* -------------------------------------------------------------------------
   STYLE 9 - Mini sidebar row (thumbnail + two lines)
   ------------------------------------------------------------------------- */

export function MiniListRow({ post, href }: { post: SitePost; href: string }) {
  const excerpt = getEditableExcerpt(post, 72)
  return (
    <Link href={href} className="group flex min-w-0 gap-3 rounded-[var(--sd-radius-sm)] p-2 transition duration-300 hover:bg-white/[0.05]">
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.5rem] bg-[var(--sd-surface-2)]">
        <PostImage post={post} className={`absolute inset-0 ${dc.motion.zoom}`} />
      </span>
      <span className="min-w-0">
        <span className="block line-clamp-2 text-[13px] font-semibold leading-snug text-[var(--sd-text)] transition group-hover:text-[var(--sd-accent)]">
          {getEditableTitle(post)}
        </span>
        {excerpt ? <span className="mt-1 block line-clamp-2 text-[12px] leading-[1.5] text-[var(--sd-muted)]">{excerpt}</span> : null}
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   Small stat tile used by the hero and detail sidebars
   ------------------------------------------------------------------------- */

export function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-[var(--sd-radius-sm)] border border-[var(--sd-line)] bg-white/[0.04] px-4 py-3 transition duration-300 hover:-translate-y-0.5 hover:border-[var(--sd-accent-ring)]">
      <p className="text-lg font-bold tracking-[-0.02em] text-[var(--sd-text)]">{value}</p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--sd-faint)]">{label}</p>
    </div>
  )
}

export const editableCardStyles = {
  feature: EditorialFeatureCard,
  rail: RailPostCard,
  compact: CompactIndexCard,
  horizontal: ArticleListCard,
  imageFirst: ImageFirstCard,
  overlay: OverlayTileCard,
  mosaic: MosaicImageCard,
  profile: ProfileAvatarCard,
  mini: MiniListRow,
} as const
