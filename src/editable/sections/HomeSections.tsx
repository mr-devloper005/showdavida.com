import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, BadgeCheck, CalendarClock, Compass, MapPin, Sparkles } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { homeContent } from '@/editable/content/pages.content'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialFeatureCard,
  ImageFirstCard,
  MiniListRow,
  MosaicImageCard,
  OverlayTileCard,
  getEditableCategory,
  getEditablePostImage,
  getEditableTitle,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

type HomeStoryRailProps = Pick<HomeSectionProps, 'primaryTask' | 'primaryRoute' | 'posts'>

/* ---------------------------------------------------------------- helpers */

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function Shell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

/** Builds the topic chip list from whatever categories the live feed contains. */
function deriveTopics(posts: SitePost[], limit = 8) {
  const counts = new Map<string, number>()
  for (const post of posts) {
    const raw = getEditableCategory(post, '')
    const label = raw ? raw.replace(/[-_]+/g, ' ').trim() : ''
    if (!label) continue
    const key = label.toLowerCase()
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function SectionHeading({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel,
  align = 'left',
}: {
  eyebrow: string
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  align?: 'left' | 'center'
}) {
  const centered = align === 'center'
  return (
    <div className={`flex flex-wrap gap-4 ${centered ? 'flex-col items-center text-center' : 'items-end justify-between'}`}>
      <div className="max-w-2xl">
        <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{eyebrow}</p>
        <h2 className={`mt-2.5 ${dc.type.sectionTitle} text-[var(--sd-text)]`}>{title}</h2>
        {description ? <p className="mt-3 text-[15px] leading-[1.75] text-[var(--sd-muted)]">{description}</p> : null}
      </div>
      {actionHref && !centered ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--sd-accent)] transition hover:gap-2.5"
        >
          {actionLabel || 'See all'}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

/* ------------------------------------------------------------------ HERO */

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const hero = homeContent.hero
  const collage = posts.slice(0, 6)
  const [lead, ...rest] = collage

  return (
    <section>
      {/* split stage: hatched maroon copy panel + edge-to-edge collage */}
      <div className="grid lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="sd-hatch relative flex items-center bg-[linear-gradient(150deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)] px-4 py-14 sm:px-8 lg:py-24 lg:pl-[max(2rem,calc((100vw-var(--editable-container))/2+2rem))] lg:pr-14">
          <div className="sd-rise w-full max-w-xl">
            <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{hero.badge}</p>

            <h1 className="mt-5 text-[2.4rem] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.5rem]">
              {hero.title.map((line, index) => (
                <span key={line} className="block">
                  {index === hero.title.length - 1 ? <span className="text-[var(--sd-accent)]">{line}</span> : line}
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-[1.85] text-white/65 sm:text-base">{hero.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryRoute} className={dc.button.primary}>
                {hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
                {hero.secondaryCta.label}
              </Link>
            </div>

            <p className="mt-7 text-[13px] text-white/40">{hero.meta.join(' · ')}</p>
          </div>
        </div>

        {/* collage — one wide lead tile with a supporting grid underneath */}
        <div className="relative min-h-[280px] bg-[var(--sd-surface-2)]">
          {lead ? (
            <div className="grid h-full grid-cols-2 grid-rows-2 gap-px">
              <Link
                href={postHref(primaryTask, lead, primaryRoute)}
                className="group relative col-span-2 overflow-hidden sm:col-span-1 sm:row-span-2"
              >
                <img
                  src={getEditablePostImage(lead)}
                  alt={getEditableTitle(lead, 'Featured')}
                  className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(10,7,6,0.85)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--sd-accent)]">
                    {getEditableCategory(lead, taskLabel(primaryTask))}
                  </p>
                  <h2 className="mt-1.5 line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg">
                    {getEditableTitle(lead)}
                  </h2>
                </div>
              </Link>

              {rest.slice(0, 2).map((post) => (
                <Link key={post.id || post.slug} href={postHref(primaryTask, post, primaryRoute)} className="group relative overflow-hidden">
                  <img
                    src={getEditablePostImage(post)}
                    alt={getEditableTitle(post, 'Featured')}
                    className="absolute inset-0 h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,7,6,0.85)_100%)]" />
                  <p className="absolute inset-x-0 bottom-0 line-clamp-2 p-3.5 text-[12px] font-semibold leading-snug text-white">
                    {getEditableTitle(post)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-full min-h-[280px] items-center justify-center p-10 text-center">
              <div>
                <Compass className="mx-auto h-8 w-8 text-white/25" />
                <p className="mt-4 text-sm font-semibold text-white/70">{hero.featureCardTitle}</p>
                <p className="mt-2 max-w-sm text-sm leading-[1.7] text-white/40">{hero.featureCardDescription}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* trust strip under the stage */}
      <div className="border-y border-[var(--sd-line)] bg-[var(--sd-tabs)]">
        <Shell className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4 text-[13px] font-medium text-[var(--sd-muted)]">
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-[var(--sd-accent)]" /> {hero.strip[0]}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--sd-accent)]" /> {hero.strip[1]}
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-[var(--sd-accent)]" /> {hero.strip[2]}
          </span>
          <Link href={primaryRoute} className="inline-flex items-center gap-1.5 font-semibold text-[var(--sd-text)] transition hover:gap-2.5 hover:text-[var(--sd-accent)]">
            Browse {taskLabel(primaryTask).toLowerCase()} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Shell>
      </div>
    </section>
  )
}

/* --------------------------------------------------- JUST ADDED tile grid */

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeStoryRailProps) {
  const tiles = posts.slice(0, 8)
  if (!tiles.length) return null
  const copy = homeContent.justAdded

  return (
    <section className="bg-[var(--sd-bg)]">
      <Shell className="py-14 sm:py-16 lg:py-20">
        <div className="text-center">
          <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{copy.eyebrow}</p>
          <h2 className="mt-3 text-[1.8rem] font-bold leading-[1.15] tracking-[-0.025em] text-[var(--sd-text)] sm:text-[2.4rem]">
            {copy.title}
          </h2>
        </div>

        <div className="mt-10 grid gap-6 sd-stagger sm:grid-cols-2 xl:grid-cols-4">
          {tiles.map((post, index) => (
            <OverlayTileCard
              key={post.id || post.slug || index}
              post={post}
              href={postHref(primaryTask, post, primaryRoute)}
              flag={index < 4 ? copy.flag : undefined}
            />
          ))}
        </div>
      </Shell>
    </section>
  )
}

/* ------------------------------------------------- LAST 7 DAYS card grid */

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const cards = posts.slice(0, 8)
  if (!cards.length) return null
  const copy = homeContent.recent
  const topics = deriveTopics(posts, 7)

  return (
    <section className="border-t border-[var(--sd-line)] bg-[var(--sd-bg-2)]">
      <Shell className="py-14 sm:py-16 lg:py-20">
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} actionHref={primaryRoute} actionLabel={copy.actionLabel} />

        {topics.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={primaryRoute} className={`${dc.chip.base} ${dc.chip.active}`}>
              All
            </Link>
            {topics.map((topic) => (
              <Link
                key={topic.label}
                href={`${primaryRoute}?category=${encodeURIComponent(topic.label.replace(/\s+/g, '-'))}`}
                className={`${dc.chip.base} ${dc.chip.quiet} capitalize`}
              >
                {topic.label}
                <span className="text-[10px] opacity-60">{topic.count}</span>
              </Link>
            ))}
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 sd-stagger sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((post, index) => (
            <ImageFirstCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} />
          ))}
        </div>
      </Shell>
    </section>
  )
}

/* ------------------------------------------------- MIXED COLLECTION BLOCKS */

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const timePosts = timeSections.flatMap((section) => section.posts).filter(Boolean)
  const pool = timePosts.length ? timePosts : posts
  if (!pool.length) return null

  const feature = pool[0]
  const horizontal = pool.slice(1, 3)
  const compact = pool.slice(3, 5)
  const mosaic = pool.slice(5, 11)
  const sidebar = pool.slice(1, 5)
  const spotlight = timeSections[0]

  return (
    <>
      {/* editorial split: one hero card + supporting rows */}
      <section className="border-t border-[var(--sd-line)] bg-[var(--sd-bg)]">
        <Shell className="py-14 sm:py-16 lg:py-20">
          <SectionHeading
            eyebrow={spotlight?.eyebrow || homeContent.spotlight.eyebrow}
            title={spotlight?.title || homeContent.spotlight.title}
            description={spotlight?.description || homeContent.spotlight.description}
            actionHref={spotlight?.href || primaryRoute}
            actionLabel="Open section"
          />

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
            <EditorialFeatureCard
              post={feature}
              href={postHref(primaryTask, feature, primaryRoute)}
              label={homeContent.spotlight.featureLabel}
            />

            <div className="grid min-w-0 content-start gap-4">
              {horizontal.map((post, index) => (
                <ArticleListCard
                  key={post.id || post.slug || index}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={index}
                />
              ))}
              {compact.map((post, index) => (
                <CompactIndexCard
                  key={post.id || post.slug || index}
                  post={post}
                  href={postHref(primaryTask, post, primaryRoute)}
                  index={index + horizontal.length}
                />
              ))}
            </div>
          </div>
        </Shell>
      </section>

      {/* discovery mosaic + a quiet sticky aside */}
      {mosaic.length ? (
        <section className="border-t border-[var(--sd-line)] bg-[var(--sd-bg-2)]">
          <Shell className="py-14 sm:py-16 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="min-w-0">
                <SectionHeading
                  eyebrow={homeContent.mosaic.eyebrow}
                  title={homeContent.mosaic.title}
                  description={homeContent.mosaic.description}
                />
                <div className="mt-8 columns-1 gap-5 sm:columns-2 xl:columns-3 [&>*]:mb-5">
                  {mosaic.map((post, index) => (
                    <MosaicImageCard
                      key={post.id || post.slug || index}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      index={index}
                    />
                  ))}
                </div>
              </div>

              <aside className="min-w-0 lg:sticky lg:top-40 lg:self-start">
                <div className="rounded-[var(--sd-radius-lg)] bg-[var(--sd-promo)] p-6">
                  <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{homeContent.aside.eyebrow}</p>
                  <h3 className="mt-3 text-lg font-bold leading-snug tracking-[-0.015em] text-white">{homeContent.aside.title}</h3>
                  <p className="mt-3 text-sm leading-[1.75] text-white/55">{homeContent.aside.description}</p>
                  <Link
                    href={primaryRoute}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
                  >
                    <Compass className="h-4 w-4" />
                    Browse {taskLabel(primaryTask).toLowerCase()}
                  </Link>
                </div>

                {sidebar.length ? (
                  <div className="mt-5 rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-4">
                    <p className={`${dc.type.eyebrow} px-2 text-[var(--sd-faint)]`}>{homeContent.aside.listTitle}</p>
                    <div className="mt-3 grid gap-1">
                      {sidebar.map((post, index) => (
                        <MiniListRow key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                      ))}
                    </div>
                  </div>
                ) : null}
              </aside>
            </div>
          </Shell>
        </section>
      ) : null}
    </>
  )
}

/* -------------------------------------------------------------------- CTA */

export function EditableHomeCta() {
  const cta = homeContent.cta
  return (
    <section id="get-app" className="border-t border-[var(--sd-line)] bg-[var(--sd-bg)]">
      <Shell className="py-14 sm:py-16 lg:py-20">
        <div className="sd-hatch grid gap-8 rounded-[var(--sd-radius-lg)] bg-[linear-gradient(135deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)] p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-12">
          <div className="max-w-2xl">
            <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{cta.badge}</p>
            <h2 className="mt-3 text-[1.7rem] font-bold leading-[1.15] tracking-[-0.025em] text-white sm:text-[2.2rem]">{cta.title}</h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-white/60">{cta.description}</p>
            <p className="mt-5 inline-flex items-center gap-2 text-[13px] text-white/40">
              <Sparkles className="h-3.5 w-3.5 text-[var(--sd-accent)]" />
              {homeContent.hero.meta.join(' · ')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={cta.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--sd-accent)] px-7 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--sd-accent-strong)]"
            >
              {cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={cta.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-white/[0.08]"
            >
              {cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </Shell>
    </section>
  )
}
