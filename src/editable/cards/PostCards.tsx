import Link from 'next/link'
import { ArrowRight, Clock3, Image as ImageIcon } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  const image = mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
  return image
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const category = typeof content.category === 'string' ? content.category.trim() : ''
  return category || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured read' }: { post: SitePost; href: string; label?: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-6 sm:p-8 lg:min-h-[640px]">
        <img src={image} alt={post.title || 'Featured post'} className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(17,17,17,0.82))]" />
        <div className="relative z-10 flex h-full min-h-[460px] flex-col justify-end lg:min-h-[560px]">
          <span className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>{label}</span>
          <h3 className="mt-5 max-w-3xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{post.title || 'Untitled post'}</h3>
          <p className="mt-5 max-w-2xl text-sm leading-8 text-white/76 sm:text-base">{getEditableExcerpt(post, 190) || 'A featured story with room for strong visuals and a clear summary.'}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-black text-black">
            Open feature <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block ${dc.layout.minRailCard} overflow-hidden rounded-[1.7rem] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0.7))]" />
        <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">No. {String(index + 1).padStart(2, '0')}</span>
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/70">{getEditableCategory(post)}</p>
          <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-0.05em] text-white">{post.title || 'Untitled post'}</h3>
        </div>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.5rem] border ${pal.border} bg-white p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-xs font-black text-white`}>{index + 1}</span>
        <div className="min-w-0">
          <p className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] ${pal.accentText}`}>
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-black">{post.title || 'Untitled post'}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 105) || 'A compact card with just enough context to scan quickly.'}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[1.8rem] border ${pal.border} bg-white p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[220px]`}>
        <img src={image} alt={post.title || 'Post image'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-black">
          Read {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.06em] text-black sm:text-[2.1rem]">{post.title || 'Untitled post'}</h2>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.softMutedText}`}>{getEditableExcerpt(post, 180) || 'This editorial card gives the title and summary more room to breathe.'}</p>
        <span className={`mt-5 inline-flex items-center gap-2 text-sm font-black ${pal.panelText}`}>
          Open article <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  return (
    <Link href={href} className={`group block overflow-hidden rounded-[2rem] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title || 'Visual post'} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="space-y-3 p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-black">
          <ImageIcon className="h-3 w-3" /> {getEditableCategory(post)}
        </div>
        <h3 className="line-clamp-2 text-xl font-black leading-tight tracking-[-0.05em] text-black">{post.title || 'Untitled post'}</h3>
        <p className={`line-clamp-3 text-sm leading-6 ${pal.softMutedText}`}>{getEditableExcerpt(post, 120) || 'A visual card that lets the image lead the experience.'}</p>
      </div>
    </Link>
  )
}
