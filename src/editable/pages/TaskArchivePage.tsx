import Link from 'next/link'
import type { CSSProperties } from 'react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ImageFirstCard, ArticleListCard } from '@/editable/cards/PostCards'
import { ArrowRight, Bookmark, Building2, Camera, Download, FileText, Filter, MapPin, Megaphone, Search, UserRound } from 'lucide-react'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
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

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
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
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

function ArchiveHero({ task, basePath, category, pagination }: { task: TaskKey; basePath: string; category: string; pagination: SiteFeedPagination }) {
  const voice = taskPageVoices[task]
  const deck = taskDeck[task]
  const Icon = deck.icon
  const taskConfig = getTaskConfig(task)
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  return (
    <div className="grid gap-8 rounded-[2.4rem] border border-black/10 bg-white/75 p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] backdrop-blur lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[var(--slot4-accent-soft)] px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]">
          <Icon className="h-4 w-4" /> {taskConfig?.label || task}
        </div>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.28em] text-black/55">{voice?.eyebrow || 'Archive'}</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.08em] text-black sm:text-6xl">{voice?.headline || `Browse ${taskConfig?.label || task}`}</h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-black/70">{voice?.description || SITE_CONFIG.description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {(voice?.chips || []).map((chip) => (
            <span key={chip} className="rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-black">
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={basePath} className={dc.button.primary}>
            Browse all
          </Link>
          <Link href="/search" className={dc.button.secondary}>
            Search posts
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="rounded-[2.2rem] border border-black/10 bg-black p-6 text-white shadow-[0_24px_80px_rgba(17,17,17,0.16)]">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/60">Browse note</p>
          <h2 className="mt-3 text-3xl font-black leading-[0.94] tracking-[-0.07em] text-white">{deck.promise}</h2>
          <p className="mt-4 text-sm leading-7 text-white/75">Showing: {categoryLabel}</p>
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-[var(--slot4-accent-fill)] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-black">Archive</span>
            <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white/80">Page {pagination.page || 1} of {pagination.totalPages || 1}</span>
          </div>
        </div>

        <form action={basePath} className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-black/70">
            <Filter className="h-4 w-4" /> Filter
          </div>
          <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-full border border-black/10 bg-white px-4 text-sm font-black text-black outline-none">
            <option value="all">All categories</option>
            {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <button className="mt-3 h-12 w-full rounded-full bg-black text-sm font-black text-white">Apply</button>
        </form>
      </div>
    </div>
  )
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const deck = taskDeck[task]
  const archiveVars = {
    '--archive-bg': preset.colors.background,
    '--archive-text': preset.colors.foreground,
    '--archive-surface': preset.colors.surface,
    '--archive-accent': preset.colors.accent,
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <ArchiveHero task={task} basePath={basePath} category={category} pagination={pagination} />
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] opacity-55">{voice?.secondaryNote || 'Browse the archive'}</p>
                  <h2 className="mt-2 text-3xl font-black tracking-[-0.06em]">{voice?.headline || taskConfig?.label || task}</h2>
                </div>
                <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">
                  Search archive <Search className="h-4 w-4" />
                </Link>
              </div>

              <div className={`${deck.archiveClass}`}>
                {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-black/15 bg-white/70 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return <ArticleListCard post={post} href={href} index={index} />
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 overflow-hidden rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_18px_50px_rgba(17,17,17,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.12)] sm:grid-cols-[128px_minmax(0,1fr)]">
      <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--archive-bg)] ring-1 ring-black/10">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.06em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold opacity-70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_18px_50px_rgba(17,17,17,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.12)]">
      <div className="grid min-h-64 sm:grid-cols-[0.76fr_1fr]">
        <div className="relative bg-black p-5 text-white">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[0.96] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.06em] text-black">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-black/65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return <ImageFirstCard post={post} href={href} />
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.08)] transition hover:-translate-y-1 hover:bg-black hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.06em] text-black">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-black/70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(17,17,17,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-black p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.06em] text-black">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-black/65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-black/10 bg-white p-6 text-center shadow-[0_18px_50px_rgba(17,17,17,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(17,17,17,0.12)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-black/10">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.05em] text-black">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/65">{getSummary(post)}</p>
    </Link>
  )
}
