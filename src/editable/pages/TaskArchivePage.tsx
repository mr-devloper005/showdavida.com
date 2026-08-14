import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  Megaphone,
  SearchX,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { MosaicImageCard, ProfileAvatarCard, getEditableRating } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

/* ------------------------------------------------------------ safe readers */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getTitle = (post: SitePost, fallback = 'Untitled entry') => post.title?.trim() || fallback
const getSummary = (post: SitePost) =>
  (post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 sm:grid-cols-2 xl:grid-cols-3', badge: 'Document' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const totalPages = pagination.totalPages || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task] || taskDeck.article
  const categoryLabel =
    category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  // Chips built from the categories that actually appear in this page of results.
  const chips = Array.from(
    new Set(posts.map((post) => getCategory(post, '')).filter(Boolean).map((value) => value.toLowerCase()))
  ).slice(0, 8)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--sd-bg)] text-[var(--sd-text)]">
        {/* ---------------------------------------------------------- hero */}
        <section className="border-b border-[var(--sd-line)] bg-[var(--sd-bg-2)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="sd-rise max-w-2xl">
              <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>
                {deck.badge} · {label}
              </p>
              <h1 className="mt-4 text-[1.9rem] font-bold leading-[1.12] tracking-[-0.03em] sm:text-4xl lg:text-[2.8rem]">
                {voice?.headline || `Browse ${label}`}
              </h1>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.85] text-[var(--sd-muted)]">
                {voice?.description || SITE_CONFIG.description}
              </p>

              {voice?.chips?.length ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {voice.chips.map((chip) => (
                    <span key={chip} className={`${dc.chip.base} ${dc.chip.quiet}`}>
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* count + filter bar */}
            <div className="mt-10 flex flex-col gap-4 border-t border-[var(--sd-line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-[var(--sd-muted)]">
                <span className="font-semibold text-[var(--sd-text)]">{pagination.total ?? posts.length}</span> posts · {categoryLabel}
              </p>
              <form action={basePath} className="flex flex-wrap items-center gap-2">
                <select
                  name="category"
                  defaultValue={category}
                  aria-label="Filter by category"
                  className="h-11 min-w-[200px] rounded-full border border-[var(--sd-line)] bg-[var(--sd-surface)] px-5 text-sm font-medium text-[var(--sd-text)] outline-none transition focus:border-[var(--sd-accent-ring)]"
                >
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <button className="h-11 rounded-full bg-[var(--sd-accent)] px-7 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]">
                  Apply
                </button>
                {category !== 'all' ? (
                  <Link
                    href={basePath}
                    className="h-11 rounded-full border border-[var(--sd-line)] px-6 text-sm font-semibold leading-[2.75rem] text-[var(--sd-muted)] transition hover:text-[var(--sd-text)]"
                  >
                    Reset
                  </Link>
                ) : null}
              </form>
            </div>

            {chips.length ? (
              <div className={`${dc.layout.rail} mt-5`}>
                <Link
                  href={basePath}
                  className={`${dc.chip.base} shrink-0 ${category === 'all' ? dc.chip.active : dc.chip.quiet}`}
                >
                  All
                </Link>
                {chips.map((chip) => {
                  const slug = chip.replace(/\s+/g, '-')
                  return (
                    <Link
                      key={chip}
                      href={pageHref(basePath, slug, 1)}
                      className={`${dc.chip.base} shrink-0 capitalize ${category === slug ? dc.chip.active : dc.chip.quiet}`}
                    >
                      {chip}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
        </section>

        {/* ------------------------------------------------------- results */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {posts.length ? (
            <div className={`${deck.archiveClass} sd-stagger`}>
              {posts.map((post, index) => (
                <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-[var(--sd-radius-lg)] border border-dashed border-[var(--sd-line)] bg-[var(--sd-surface)] p-12 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-[var(--sd-accent)]">
                <SearchX className="h-6 w-6" />
              </span>
              <h2 className="mt-5 text-xl font-bold tracking-[-0.02em]">Nothing here yet</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-[1.75] text-[var(--sd-muted)]">
                Try another category, or come back shortly — new entries appear here automatically once published.
              </p>
              <Link href={basePath} className={`${dc.button.primary} mt-6`}>
                Reset filters
              </Link>
            </div>
          )}

          {totalPages > 1 ? (
            <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sd-line)] bg-[var(--sd-surface)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--sd-accent-ring)] hover:text-[var(--sd-accent)]"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Link>
              ) : null}

              <span className="hidden items-center gap-1.5 sm:flex">
                {Array.from({ length: Math.min(5, totalPages) }, (_, offset) => {
                  const start = Math.max(1, Math.min(page - 2, Math.max(1, totalPages - 4)))
                  return start + offset
                })
                  .filter((value) => value <= totalPages)
                  .map((value) => (
                    <Link
                      key={value}
                      href={pageHref(basePath, category, value)}
                      aria-current={value === page ? 'page' : undefined}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition ${
                        value === page
                          ? 'bg-[var(--sd-accent)] text-white'
                          : 'border border-[var(--sd-line)] bg-[var(--sd-surface)] text-[var(--sd-muted)] hover:text-[var(--sd-text)]'
                      }`}
                    >
                      {value}
                    </Link>
                  ))}
              </span>

              <span className="rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white sm:hidden">
                {page} / {totalPages}
              </span>

              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--sd-line)] bg-[var(--sd-surface)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--sd-accent-ring)] hover:text-[var(--sd-accent)]"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

/* -------------------------------------------------------------------------
   Per-task card variants - each task gets its own shape.
   ------------------------------------------------------------------------- */

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug || '')
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <MosaicImageCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileAvatarCard post={post} href={href} role={getField(post, ['role', 'designation', 'company', 'location'])} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const summary = getSummary(post)
  const category = getCategory(post, 'Article')

  // Every third card leads with a taller cover so the grid never marches.
  if (index % 3 === 0) {
    return (
      <Link
        href={href}
        className="group overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[var(--sd-surface-2)]">
          <img src={getImage(post)} alt={getTitle(post)} loading="lazy" className={`h-full w-full object-cover ${dc.motion.zoom}`} />
          <span className="absolute left-3 top-3 rounded-full bg-black/62 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur">
            {category}
          </span>
        </div>
        <div className="p-5">
          <h2 className="line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
          {summary ? <p className="mt-2.5 line-clamp-3 text-sm leading-[1.7] text-[var(--sd-muted)]">{summary}</p> : null}
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sd-accent)] transition group-hover:gap-2.5">
            Read more <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)] sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--sd-surface-2)] sm:aspect-auto sm:min-h-[180px]">
        <img src={getImage(post)} alt={getTitle(post)} loading="lazy" className={`absolute inset-0 h-full w-full object-cover ${dc.motion.zoom}`} />
      </div>
      <div className="min-w-0 p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--sd-accent)]">{category}</p>
        <h2 className="mt-2 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
        {summary ? <p className="mt-2.5 line-clamp-3 text-sm leading-[1.7] text-[var(--sd-muted)]">{summary}</p> : null}
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const { rating, reviews } = getEditableRating(post)
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group grid gap-5 rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)] sm:grid-cols-[110px_minmax(0,1fr)]"
    >
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[var(--sd-radius-sm)] bg-[var(--sd-surface-2)] ring-1 ring-white/10">
        {logo ? (
          <img src={logo} alt={getTitle(post)} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <Building2 className="h-9 w-9 text-white/25" />
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[var(--sd-accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--sd-accent)]">
            Directory
          </span>
          {location ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--sd-muted)]">
              <MapPin className="h-3 w-3" /> {location}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
        <p className="mt-2 text-[13px] font-medium text-[var(--sd-muted)]">
          <span className="text-[var(--sd-star)]">★</span> {rating} · {reviews} reviews
        </p>
        {summary ? <p className="mt-2 line-clamp-2 text-sm leading-[1.7] text-[var(--sd-muted)]">{summary}</p> : null}
        {phone || website ? (
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-[var(--sd-faint)]">
            {phone ? <span>Phone: {phone}</span> : null}
            {website ? <span>Website available</span> : null}
          </p>
        ) : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group grid overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)] sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]"
    >
      <div className="relative min-h-[180px] bg-[var(--sd-promo)] p-6">
        {image ? (
          <img src={image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        ) : null}
        <div className="relative">
          <span className="rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Classified
          </span>
          <p className="mt-8 text-2xl font-bold tracking-[-0.02em] text-white">{price || 'Open offer'}</p>
          <p className="mt-2 text-sm text-white/55">{location || condition || 'Details inside'}</p>
        </div>
      </div>
      <div className="min-w-0 p-5 sm:p-6">
        <h2 className="line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
        {summary ? <p className="mt-3 line-clamp-4 text-sm leading-[1.7] text-[var(--sd-muted)]">{summary}</p> : null}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sd-accent)] transition group-hover:gap-2.5">
          View offer <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group block rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--sd-faint)]">
          Save {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-[var(--sd-accent)]">
          <Bookmark className="h-4 w-4" />
        </span>
      </div>
      <h2 className="mt-6 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
      {summary ? <p className="mt-3 line-clamp-4 text-sm leading-[1.7] text-[var(--sd-muted)]">{summary}</p> : null}
      {website ? (
        <p className="mt-5 flex items-center gap-1.5 truncate text-xs font-semibold text-[var(--sd-accent)]">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          {website.replace(/^https?:\/\//, '')}
        </p>
      ) : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Document')
  const summary = getSummary(post)
  return (
    <Link
      href={href}
      className="group rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)] hover:shadow-[var(--sd-shadow-lg)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-[var(--sd-radius-sm)] bg-[var(--sd-accent)] text-white">
          <FileText className="h-6 w-6" />
        </span>
        <span className="rounded-full border border-[var(--sd-line)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--sd-muted)]">
          {category}
        </span>
      </div>
      <h2 className="mt-6 line-clamp-2 text-[16px] font-bold leading-snug tracking-[-0.015em]">{getTitle(post)}</h2>
      {summary ? <p className="mt-3 line-clamp-3 text-sm leading-[1.7] text-[var(--sd-muted)]">{summary}</p> : null}
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sd-accent)] transition group-hover:gap-2.5">
        Open document <Download className="h-4 w-4" />
      </span>
    </Link>
  )
}
