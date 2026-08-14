import Link from 'next/link'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Building2,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Images,
  Layers,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
  Tag,
  ThumbsUp,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { pagesContent } from '@/editable/content/pages.content'
import { StarRating, getEditableRating } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------------------------------------ safe readers */

const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return Array.from(new Set([...media, ...images, ...singleImages])).slice(0, 12)
}

/** The badge/logo mark, when the post carries one separate from the gallery. */
const getMark = (post: SitePost) => {
  const content = getContent(post)
  const logo = asText(content.logo) || asText(content.avatar)
  return logo && isUrl(logo) ? logo : ''
}

const titleOf = (post?: SitePost | null, fallback = 'Untitled entry') => post?.title?.trim() || fallback

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || ''
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  (post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

/* ---------------------------------------------------------------- wrapper */

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--sd-bg)] text-[var(--sd-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------------------------------------ shared parts */

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sd-muted)] transition hover:gap-3 hover:text-[var(--sd-accent)]"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

/**
 * Full-bleed banner: the cover image runs edge to edge, with the brand mark
 * floating over the centre and the title anchored to the container gutter.
 */
function DetailBanner({ post, task }: { post: SitePost; task: TaskKey }) {
  const images = getImages(post)
  const cover = images[0]
  const mark = getMark(post)
  return (
    <section className="relative w-full overflow-hidden bg-[var(--sd-surface-2)]">
      <div className="relative min-h-[260px] w-full sm:min-h-[340px] lg:min-h-[400px]">
        {cover ? (
          <img src={cover} alt={titleOf(post)} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Layers className="h-10 w-10 text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,6,0.42)_0%,rgba(10,7,6,0.18)_38%,rgba(10,7,6,0.9)_100%)]" />

        {mark ? (
          <span className="absolute left-1/2 top-1/2 hidden h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full bg-white/95 p-6 shadow-[var(--sd-shadow-lg)] md:flex lg:h-48 lg:w-48">
            <img src={mark} alt="" aria-hidden="true" className="h-full w-full object-contain" />
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0">
          <Shell className="pb-6 sm:pb-9">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur">
              <Tag className="h-3 w-3" />
              {categoryOf(post, getTaskConfig(task)?.label || 'Entry')}
            </span>
            <h1 className="mt-3 max-w-3xl text-2xl font-bold leading-[1.14] tracking-[-0.025em] text-white sm:text-3xl lg:text-[2.6rem]">
              {titleOf(post)}
            </h1>
          </Shell>
        </div>
      </div>
    </section>
  )
}

function SidebarCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className={`${dc.type.eyebrow} text-[var(--sd-faint)]`}>{title}</p>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function ShareRow() {
  return (
    <div className="flex items-center gap-5 text-[13px] font-medium text-[var(--sd-muted)]">
      <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--sd-accent)]">
        <ThumbsUp className="h-4 w-4" /> Helpful
      </span>
      <span className="inline-flex items-center gap-1.5 transition hover:text-[var(--sd-accent)]">
        <Share2 className="h-4 w-4" /> Share
      </span>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  const html = formatPlainText(getBody(post))
  if (!html) {
    return (
      <p className="text-[15px] leading-[1.85] text-[var(--sd-muted)]">
        {summaryText(post) || 'Full details for this entry will appear here once they are published.'}
      </p>
    )
  }
  return (
    <div
      className={`article-content max-w-none ${compact ? 'text-[14px] leading-[1.8]' : 'text-[15px] leading-[1.9]'}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[var(--sd-radius-sm)] border border-[var(--sd-line)] bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--sd-faint)]">
            <Icon className="h-3.5 w-3.5" /> {label}
          </div>
          <p className="mt-1.5 break-words text-sm font-medium leading-6 text-[var(--sd-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, columns = 4 }: { images: string[]; label: string; columns?: number }) {
  if (!images.length) return null
  const gridClass = columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
  return (
    <section className="mt-9">
      <p className={`${dc.type.eyebrow} text-[var(--sd-faint)]`}>{label}</p>
      <div className={`mt-4 grid gap-3 ${gridClass}`}>
        {images.slice(0, columns === 2 ? 4 : 8).map((image, index) => (
          <span
            key={`${image}-${index}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--sd-radius-sm)] bg-[var(--sd-surface-2)]"
          >
            <img
              src={image}
              alt={`${label} ${index + 1}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition duration-[700ms] ease-out group-hover:scale-105"
            />
          </span>
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)]">
      <div className="flex items-center gap-2 px-5 py-4 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-[var(--sd-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-5">
      <p className={`${dc.type.eyebrow} text-[var(--sd-faint)]`}>Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-2.5">
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
          >
            {pagesContent.detailPages.profile.visitButton} <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
        {phone ? (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--sd-line-strong)] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/[0.06]"
          >
            <Phone className="h-4 w-4" /> Call
          </a>
        ) : null}
        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--sd-line-strong)] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/[0.06]"
          >
            <Mail className="h-4 w-4" /> Email
          </a>
        ) : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[var(--sd-radius-sm)] border border-white/10 bg-white/[0.06] px-4 py-3 text-sm">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/45">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

function AboutPanel({ post, task }: { post: SitePost; task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <SidebarCard title="About this post">
      <div className="grid gap-3 text-sm">
        <span className="flex items-center gap-2.5 text-[var(--sd-muted)]">
          <Tag className="h-4 w-4 shrink-0 text-[var(--sd-accent)]" />
          <span className="truncate capitalize text-[var(--sd-text)]">{categoryOf(post, taskConfig?.label || 'Entry')}</span>
        </span>
        <span className="flex items-center gap-2.5 text-[var(--sd-muted)]">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--sd-accent)]" />
          <span className="truncate text-[var(--sd-text)]">{taskConfig?.label || 'Entry'}</span>
        </span>
        <span className="flex items-center gap-2.5 text-[var(--sd-muted)]">
          <Globe2 className="h-4 w-4 shrink-0 text-[var(--sd-accent)]" />
          <span className="truncate text-[var(--sd-text)]">{SITE_CONFIG.name}</span>
        </span>
      </div>
    </SidebarCard>
  )
}

function RelatedPanel({ task, related, title }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean; title?: string }) {
  const taskConfig = getTaskConfig(task)
  if (!related.length) return null
  return (
    <SidebarCard
      title={title || pagesContent.detailPages.image.relatedTitle}
      action={
        <Link
          href={taskConfig?.route || '/'}
          className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--sd-accent)] transition hover:text-[var(--sd-text)]"
        >
          View all
        </Link>
      }
    >
      <div id="related" className="grid gap-1">
        {related.map((item) => (
          <RelatedCard key={item.id || item.slug} task={task} post={item} />
        ))}
      </div>
    </SidebarCard>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  const summary = summaryText(post)
  return (
    <Link
      href={buildPostUrl(task, post.slug || '')}
      className="group flex gap-3 rounded-[var(--sd-radius-sm)] p-2 transition duration-300 hover:bg-white/[0.05]"
    >
      {image && task !== 'sbm' ? (
        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[0.5rem] bg-[var(--sd-surface-2)]">
          <img
            src={image}
            alt={titleOf(post)}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition duration-[700ms] group-hover:scale-105"
          />
        </span>
      ) : (
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.5rem] bg-white/[0.05]">
          <FileText className="h-5 w-5 text-white/25" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block line-clamp-2 text-[13px] font-semibold leading-snug transition group-hover:text-[var(--sd-accent)]">
          {titleOf(post)}
        </span>
        {summary ? <span className="mt-1 block line-clamp-2 text-[12px] leading-[1.5] text-[var(--sd-muted)]">{summary}</span> : null}
      </span>
    </Link>
  )
}

/* -------------------------------------------------------------------------
   IMAGE detail - the flagship layout for this site
   ------------------------------------------------------------------------- */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const taskConfig = getTaskConfig('image')
  const gallery = images.slice(1)

  return (
    <>
      <DetailBanner post={post} task="image" />

      <Shell className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <div className="min-w-0">
          <BackLink task="image" />
          <div className="mt-7 max-w-2xl">
            <BodyContent post={post} />
          </div>
          <div className="mt-8 max-w-2xl border-t border-[var(--sd-line)] pt-5">
            <ShareRow />
          </div>

          {gallery.length ? (
            <div className="mt-10">
              <ImageStrip images={gallery} label="More from this shoot" />
            </div>
          ) : null}
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-5 text-center">
            <p className={`${dc.type.eyebrow} text-[var(--sd-faint)]`}>Images in this set</p>
            <p className="mt-2 inline-flex items-center gap-2 text-3xl font-bold tracking-[-0.03em] text-[var(--sd-text)]">
              <Images className="h-6 w-6 text-[var(--sd-accent)]" />
              {images.length || 1}
            </p>
          </div>

          <AboutPanel post={post} task="image" />
          <RelatedPanel task="image" post={post} related={related} />

          <Link
            href={taskConfig?.route || '/'}
            className="flex items-center justify-center gap-2 rounded-[var(--sd-radius)] bg-[var(--sd-accent)] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
          >
            Browse the full gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </Shell>
    </>
  )
}

/* -------------------------------------------------------------------------
   PROFILE detail - identity first
   ------------------------------------------------------------------------- */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const { rating, reviews } = getEditableRating(post)

  return (
    <>
      {/* slim cover band with the avatar breaking the edge */}
      <section className="relative h-40 w-full overflow-hidden bg-[var(--sd-surface-2)] sm:h-52">
        {images[0] ? (
          <img src={images[0]} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,7,6,0.4)_0%,var(--sd-bg)_100%)]" />
      </section>

      <Shell className="-mt-16 pb-12 sm:-mt-20 lg:pb-16">
        <div className="rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <span className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--sd-surface-2)] ring-4 ring-[var(--sd-bg)] sm:h-32 sm:w-32">
              {images[0] ? (
                <img src={images[0]} alt={titleOf(post)} className="h-full w-full object-cover" />
              ) : (
                <UserRound className="h-12 w-12 text-white/25" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold leading-snug tracking-[-0.025em] sm:text-3xl">{titleOf(post)}</h1>
              {role ? <p className="mt-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--sd-accent)]">{role}</p> : null}
              <div className="mt-3">
                <StarRating rating={rating} reviews={reviews} />
              </div>
            </div>
            <div className="shrink-0">
              <ShareRow />
            </div>
          </div>

          {summaryText(post) ? (
            <p className="mt-6 max-w-3xl border-t border-[var(--sd-line)] pt-6 text-[15px] leading-[1.85] text-[var(--sd-muted)]">
              {summaryText(post)}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <BackLink task="profile" />
            <div className="mt-7 max-w-2xl">
              <BodyContent post={post} />
            </div>
            <ImageStrip images={images.slice(1)} label="Profile gallery" />
          </div>

          <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
            <ContactAction website={website} phone={phone} email={email} />
            <AboutPanel post={post} task="profile" />
            <RelatedPanel task="profile" post={post} related={related} title={pagesContent.detailPages.profile.relatedTitle} />
          </aside>
        </div>
      </Shell>
    </>
  )
}

/* -------------------------------------------------------------------------
   Other task layouts
   ------------------------------------------------------------------------- */

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <DetailBanner post={post} task="article" />
      <Shell className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <article className="min-w-0">
          <BackLink task="article" />
          {summaryText(post) ? (
            <p className="mt-7 max-w-2xl border-l-2 border-[var(--sd-accent)] pl-4 text-[17px] font-medium leading-[1.8] text-[var(--sd-text)]">
              {summaryText(post)}
            </p>
          ) : null}
          <div className="mt-6 max-w-2xl">
            <BodyContent post={post} />
          </div>
          {images.length > 1 ? <ImageStrip images={images.slice(1)} label="Gallery" columns={2} /> : null}
          <div className="mt-8 max-w-2xl border-t border-[var(--sd-line)] pt-5">
            <ShareRow />
          </div>
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
          <AboutPanel post={post} task="article" />
          <RelatedPanel task="article" post={post} related={related} title={pagesContent.detailPages.article.relatedTitle} />
        </aside>
      </Shell>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = getMark(post) || images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <DetailBanner post={post} task="listing" />
      <Shell className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:py-14">
        <article className="min-w-0">
          <BackLink task="listing" />
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[var(--sd-radius-sm)] bg-[var(--sd-surface-2)] ring-1 ring-white/10">
              {logo ? (
                <img src={logo} alt={titleOf(post)} className="h-full w-full object-cover" />
              ) : (
                <Building2 className="h-8 w-8 text-white/25" />
              )}
            </span>
            <div className="min-w-0">
              <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Business listing</p>
              <h2 className="mt-1.5 text-xl font-bold tracking-[-0.02em]">{titleOf(post)}</h2>
            </div>
          </div>
          {summaryText(post) ? (
            <p className="mt-5 max-w-2xl text-[15px] leading-[1.85] text-[var(--sd-muted)]">{summaryText(post)}</p>
          ) : null}
          <InfoGrid
            items={[
              ['Location', address, MapPin],
              ['Phone', phone, Phone],
              ['Email', email, Mail],
              ['Website', website, Globe2],
            ]}
          />
          <div className="mt-8 max-w-2xl">
            <BodyContent post={post} />
          </div>
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
          <ContactAction website={website} phone={phone} email={email} />
          {mapSrc ? <MapBox src={mapSrc} label={address || titleOf(post)} /> : null}
          <RelatedPanel task="listing" post={post} related={related} title={pagesContent.detailPages.listing.relatedTitle} />
        </aside>
      </Shell>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <Shell className="grid gap-8 py-10 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:py-14">
      <aside className="min-w-0 lg:sticky lg:top-40 lg:self-start">
        <BackLink task="classified" />
        <div className="mt-6 rounded-[var(--sd-radius-lg)] bg-[var(--sd-promo)] p-6">
          <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Classified notice</p>
          <h1 className="mt-3 text-2xl font-bold leading-snug tracking-[-0.02em] text-white">{titleOf(post)}</h1>
          <div className="mt-6 grid gap-2.5">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {phone ? (
              <a href={`tel:${phone}`} className="rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white">
                Call now
              </a>
            ) : null}
            {email ? (
              <a href={`mailto:${email}`} className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white">
                Email
              </a>
            ) : null}
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white"
              >
                View site
              </a>
            ) : null}
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        {images.length ? <ImageStrip images={images} label="Offer images" columns={2} /> : null}
        <div className="mt-8 max-w-2xl">
          <BodyContent post={post} />
        </div>
        <div className="mt-8">
          <RelatedPanel task="classified" post={post} related={related} />
        </div>
      </div>
    </Shell>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Shell className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
      <article className="min-w-0">
        <BackLink task="sbm" />
        <span className="mt-7 flex h-14 w-14 items-center justify-center rounded-[var(--sd-radius-sm)] bg-[var(--sd-accent-soft)] text-[var(--sd-accent)]">
          <Bookmark className="h-6 w-6" />
        </span>
        <h1 className="mt-5 max-w-2xl text-2xl font-bold leading-snug tracking-[-0.025em] sm:text-3xl">{titleOf(post)}</h1>
        {summaryText(post) ? (
          <p className="mt-4 max-w-2xl text-[15px] leading-[1.85] text-[var(--sd-muted)]">{summaryText(post)}</p>
        ) : null}
        {website ? (
          <a
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
          >
            <ExternalLink className="h-4 w-4" /> Open saved resource
          </a>
        ) : null}
        <div className="mt-8 max-w-2xl">
          <BodyContent post={post} />
        </div>
      </article>
      <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
        <AboutPanel post={post} task="sbm" />
        <RelatedPanel task="sbm" post={post} related={related} />
      </aside>
    </Shell>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <Shell className="grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
      <article className="min-w-0">
        <BackLink task="pdf" />
        <div className="mt-7 flex flex-wrap items-center gap-5">
          <span className="flex h-16 w-16 items-center justify-center rounded-[var(--sd-radius-sm)] bg-[var(--sd-accent)] text-white">
            <FileText className="h-7 w-7" />
          </span>
          <div className="min-w-0">
            <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Document</p>
            <h1 className="mt-1.5 text-2xl font-bold leading-snug tracking-[-0.02em]">{titleOf(post)}</h1>
          </div>
        </div>
        <div className="mt-7 max-w-2xl">
          <BodyContent post={post} />
        </div>
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)]">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--sd-line)] p-4">
              <span className="text-sm font-semibold">Document preview</span>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--sd-accent)] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
              >
                Download <Download className="h-3.5 w-3.5" />
              </a>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={titleOf(post)} className="h-[70vh] w-full" />
          </div>
        ) : null}
      </article>
      <aside className="min-w-0 space-y-5 lg:sticky lg:top-40 lg:self-start">
        <AboutPanel post={post} task="pdf" />
        <RelatedPanel task="pdf" post={post} related={related} />
      </aside>
    </Shell>
  )
}

/* ---------------------------------------------------------------- comments */

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 max-w-2xl rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-5 sm:p-6">
      <div className="flex items-center gap-2 text-base font-bold tracking-[-0.015em]">
        <MessageCircle className="h-5 w-5 text-[var(--sd-accent)]" />
        Comments
        <span className="rounded-full bg-white/[0.07] px-2.5 py-0.5 text-xs font-semibold text-[var(--sd-muted)]">{comments.length}</span>
      </div>

      <div className="mt-5 rounded-[var(--sd-radius-sm)] border border-[var(--sd-line)] bg-white/[0.03] p-5">
        <p className="text-base font-bold tracking-[-0.015em]">Join the conversation</p>
        <p className="mt-1.5 text-sm leading-[1.75] text-[var(--sd-muted)]">
          Sign in to leave feedback on this entry, or create an account in a few seconds.
        </p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            href="/login"
            className="rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-[var(--sd-line-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--sd-text)] transition hover:bg-white/[0.06]"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-[var(--sd-radius-sm)] border border-[var(--sd-line)] bg-white/[0.03] p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-xs font-bold uppercase text-[var(--sd-accent)]">
                {(comment.name || '?').slice(0, 1)}
              </span>
              <p className="text-sm font-semibold">{comment.name}</p>
            </div>
            <p className="mt-2.5 text-sm leading-[1.7] text-[var(--sd-muted)]">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? (
          <p className="text-sm text-[var(--sd-muted)]">No comments yet on {slug || 'this entry'}. Be the first to add one.</p>
        ) : null}
      </div>
    </section>
  )
}
