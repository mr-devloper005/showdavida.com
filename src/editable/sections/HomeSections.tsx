import Link from 'next/link'
import { ArrowRight, Camera, Heart, Search, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref, EditorialFeatureCard, CompactIndexCard, ArticleListCard, RailPostCard } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

type HomeStoryRailProps = Pick<HomeSectionProps, 'primaryTask' | 'primaryRoute' | 'posts'>
type HomeTimeCollectionProps = HomeSectionProps

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function firstPost(posts: SitePost[]) {
  return posts.find((post) => post?.slug || post?.id || post?.title) || posts[0]
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string
  title: string
  description?: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-black leading-[0.95] tracking-[-0.07em] sm:text-4xl">{title}</h2>
        {description ? <p className={`mt-4 max-w-2xl text-sm leading-7 ${pal.mutedText} sm:text-base`}>{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5">
          {action.label} <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function SearchBar({ placeholder = 'Search work, profiles, and topics' }: { placeholder?: string }) {
  return (
    <form action="/search" className="w-full max-w-2xl">
      <label className="flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-3 shadow-[0_14px_40px_rgba(17,17,17,0.06)]">
        <Search className="h-4 w-4 opacity-55" />
        <input name="q" type="search" placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-current/35 sm:text-base" />
        <button className="rounded-full bg-black px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-white">
          Go
        </button>
      </label>
    </form>
  )
}

function FloatingStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-black/10 bg-white/90 p-4 shadow-[0_18px_50px_rgba(17,17,17,0.08)] backdrop-blur">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] opacity-55">{label}</p>
      <p className="mt-2 text-lg font-black tracking-[-0.05em]">{value}</p>
    </div>
  )
}

function FeaturedStage({ post, primaryTask, primaryRoute }: { post?: SitePost | null; primaryTask: TaskKey; primaryRoute: string }) {
  const safePost = post || null
  const image = getEditablePostImage(safePost)
  const title = safePost?.title || 'A polished home for featured work.'
  const category = safePost ? getEditableCategory(safePost) : 'Featured'
  const summary = safePost ? getEditableExcerpt(safePost, 120) : pagesContent.home.hero.featureCardDescription
  return (
    <div className="relative overflow-hidden rounded-[2.4rem] border border-black/10 bg-[var(--slot4-page-bg)] shadow-[0_24px_80px_rgba(17,17,17,0.1)]">
      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="p-7 sm:p-10 lg:p-12">
          <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{pagesContent.home.hero.badge}</p>
          <h1 className="mt-5 max-w-lg text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl lg:text-[4.6rem]">
            {pagesContent.home.hero.title.join(' ')}
          </h1>
          <p className={`mt-6 max-w-xl text-base leading-8 ${pal.mutedText} sm:text-lg`}>{pagesContent.home.hero.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={primaryRoute} className={dc.button.accent}>
              {pagesContent.home.hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href={pagesContent.home.hero.secondaryCta.href} className={dc.button.secondary}>
              {pagesContent.home.hero.secondaryCta.label}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]">Creative work</span>
            <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em]">Image-led</span>
          </div>
        </div>

        <div className="relative min-h-[420px] bg-black/5 lg:min-h-[620px]">
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(17,17,17,0.45))]" />
          <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white backdrop-blur">
            {pagesContent.home.hero.featureCardBadge}
          </div>
          <div className="absolute bottom-5 left-5 right-5 grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[1.5rem] border border-white/15 bg-white/90 p-5 text-black shadow-[0_18px_50px_rgba(17,17,17,0.12)] backdrop-blur">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] opacity-55">{category}</p>
              <h3 className="mt-2 text-2xl font-black leading-[0.98] tracking-[-0.06em]">{title}</h3>
              <p className="mt-3 text-sm leading-7 opacity-70">{summary}</p>
              <Link href={safePost ? postHref(primaryTask, safePost, primaryRoute) : primaryRoute} className="mt-4 inline-flex items-center gap-2 text-sm font-black">
                Open feature <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-3">
              <FloatingStat label="Focus" value={pagesContent.home.hero.focusLabel} />
              <FloatingStat label="Task" value={taskLabel(primaryTask)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeaturedCardStack({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(0, 7)
  if (!featured.length) return null
  const hero = featured[0]
  const compact = featured.slice(1, 4)
  const horizontal = featured.slice(4, 6)
  return (
    <section className={`${pal.creamBg} border-y border-black/10`}>
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow={pagesContent.home.intro.badge}
          title={pagesContent.home.intro.title}
          description={pagesContent.home.intro.paragraphs[0]}
          action={{ label: 'See all posts', href: primaryRoute }}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <EditorialFeatureCard post={hero} href={postHref(primaryTask, hero, primaryRoute)} label="Hero pick" />
          <div className="grid gap-4">
            {compact.map((post, index) => (
              <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {horizontal.map((post, index) => (
            <ArticleListCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TaskRailSection({ primaryTask, primaryRoute, posts }: HomeStoryRailProps) {
  const railPosts = posts.slice(0, 12)
  if (!railPosts.length) return null
  return (
    <section className={`${pal.warmBg} border-t border-black/10`}>
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="More to explore"
          title={`Browse ${taskLabel(primaryTask).toLowerCase()} in a rolling gallery`}
          description="This rail keeps the browsing experience lively with image-first cards, compact cards, and quick editorial reads."
          action={{ label: 'Open archive', href: primaryRoute }}
        />
        <div className={`${dc.layout.rail} mt-8`}>
          {railPosts.map((post, index) => <RailPostCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
        </div>
      </div>
    </section>
  )
}

function TimeSectionBlocks({ primaryTask, primaryRoute, posts, timeSections }: HomeTimeCollectionProps) {
  const sectionPosts = timeSections.flatMap((section) => section.posts).filter(Boolean)
  const fallbackPosts = sectionPosts.length ? sectionPosts : posts.slice(6)
  const lead = fallbackPosts[0] || firstPost(posts)
  const list = fallbackPosts.slice(1, 6)
  return (
    <section className={`${pal.pageBg}`}>
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div>
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Discovery notes</p>
            <h2 className="mt-3 text-3xl font-black leading-[0.96] tracking-[-0.07em] sm:text-4xl">
              The archive stays easy to scan, even when the content types change.
            </h2>
            <p className={`mt-5 max-w-xl text-sm leading-7 ${pal.mutedText} sm:text-base`}>
              Search-first browsing, stronger imagery, and varied card layouts help the page feel curated instead of repetitive.
            </p>
            <SearchBar />
          </div>
          <div className="grid gap-4">
            {list.map((post, index) => (
              <ArticleListCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>

        {lead ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.78fr]">
            <Link href={postHref(primaryTask, lead, primaryRoute)} className="group relative min-h-[420px] overflow-hidden rounded-[2.2rem] bg-black text-white shadow-[0_24px_80px_rgba(17,17,17,0.16)]">
              <img src={getEditablePostImage(lead)} alt={lead.title || 'Lead post'} className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.06),rgba(17,17,17,0.8))]" />
              <div className="relative z-10 flex min-h-[420px] flex-col justify-end p-7 sm:p-10">
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/70">Featured stream</p>
                <h3 className="mt-4 max-w-2xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl">{lead.title || 'Featured post'}</h3>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/78">{getEditableExcerpt(lead, 180) || 'A large feature area for the strongest post in the current batch.'}</p>
              </div>
            </Link>
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.slice(8, 12).map((post, index) => (
                <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = firstPost(posts)
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-[var(--slot4-accent-soft)]/60 blur-3xl" />
        <div className="absolute right-[-12%] top-[15%] h-[24rem] w-[24rem] rounded-full bg-white/70 blur-3xl" />
        <div className="absolute bottom-[-12%] left-[18%] h-[18rem] w-[18rem] rounded-full bg-[var(--slot4-panel-bg)]/80 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <FeaturedStage post={lead} primaryTask={primaryTask} primaryRoute={primaryRoute} />
        <div className="mt-8 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2.2rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{pagesContent.home.intro.badge}</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black leading-[0.94] tracking-[-0.07em] sm:text-4xl">
              {pagesContent.home.intro.title}
            </h2>
            <div className={`mt-5 space-y-4 text-sm leading-7 ${pal.mutedText}`}>
              {pagesContent.home.intro.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[2.2rem] border border-black/10 bg-black p-6 text-white shadow-[0_24px_80px_rgba(17,17,17,0.16)]">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-white/65">Quick links</p>
              <div className="mt-4 grid gap-3">
                <Link href={primaryRoute} className="inline-flex items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm font-black text-white">
                  Browse {taskLabel(primaryTask)}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/search" className="inline-flex items-center justify-between rounded-full border border-white/10 bg-white/8 px-4 py-3 text-sm font-black text-white">
                  Search archive
                  <Search className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              <FloatingStat label="Visual style" value="High contrast" />
              <FloatingStat label="Experience" value="Mobile first" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeStoryRailProps) {
  return <TaskRailSection primaryTask={primaryTask} primaryRoute={primaryRoute} posts={posts} />
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  return <FeaturedCardStack primaryTask={primaryTask} primaryRoute={primaryRoute} posts={posts} timeSections={timeSections} />
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  return <TimeSectionBlocks primaryTask={primaryTask} primaryRoute={primaryRoute} posts={posts} timeSections={timeSections} />
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className={`${pal.darkBg} relative overflow-hidden text-white`}>
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[8%] top-[12%] h-64 w-64 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-3xl" />
        <div className="absolute right-[12%] bottom-[10%] h-56 w-56 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 rounded-[2.4rem] border border-white/10 bg-white/6 p-7 shadow-[0_30px_100px_rgba(0,0,0,0.24)] backdrop-blur-lg lg:grid-cols-[1fr_0.8fr] lg:p-10">
          <div>
            <p className={`${dc.type.eyebrow} text-white/65`}>{pagesContent.home.cta.badge}</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-black leading-[0.92] tracking-[-0.08em] sm:text-5xl">{pagesContent.home.cta.title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/76">{pagesContent.home.cta.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.accent}>
                {pagesContent.home.cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.secondary}>
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5">
              <Heart className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
              <p className="mt-4 text-xl font-black tracking-[-0.05em]">Curated discovery</p>
              <p className="mt-2 text-sm leading-7 text-white/70">Featured work, profiles, and resources all sit in the same visual conversation.</p>
            </div>
            <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5">
              <Camera className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
              <p className="mt-4 text-xl font-black tracking-[-0.05em]">Image-first rhythm</p>
              <p className="mt-2 text-sm leading-7 text-white/70">Cards vary across the site so the layout never feels repetitive.</p>
            </div>
            <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 sm:col-span-2">
              <Sparkles className="h-5 w-5 text-[var(--slot4-accent-fill)]" />
              <p className="mt-4 text-xl font-black tracking-[-0.05em]">Built for mobile and desktop</p>
              <p className="mt-2 text-sm leading-7 text-white/70">The stack compresses cleanly on smaller screens without losing the featured image feel.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
