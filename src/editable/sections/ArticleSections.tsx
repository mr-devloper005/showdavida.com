import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => {
    const params = new URLSearchParams()
    if (category && category !== 'all') params.set('category', category)
    if (nextPage > 1) params.set('page', String(nextPage))
    const query = params.toString()
    return query ? `${basePath}?${query}` : basePath
  }

  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-12 sm:pt-16 lg:pt-20`}>
        <div className="sd-hatch grid gap-6 overflow-hidden rounded-[var(--sd-radius-lg)] bg-[linear-gradient(150deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)] lg:grid-cols-[1.12fr_0.88fr]">
          <div className="min-w-0 p-6 sm:p-8 lg:p-10">
            <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-3xl lg:text-4xl">{voice.headline}</h1>
            <p className="mt-4 max-w-3xl text-[15px] leading-[1.85] text-white/60">{voice.description}</p>
            <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className={dc.button.primary}>Filter</button>
            </form>
          </div>
          <aside className="border-t border-white/10 bg-black/25 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
            <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Reading note</p>
            <h2 className="mt-4 text-xl font-bold leading-[1.15] tracking-[-0.02em] text-white sm:text-2xl">Curated articles, slower pacing, stronger hierarchy.</h2>
            <p className="mt-4 text-sm leading-[1.75] text-white/55">{voice.secondaryNote}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {voice.chips.map((chip) => (
                <span key={chip} className={`${dc.chip.base} border border-white/10 bg-white/[0.06] text-white/70`}>
                  {chip}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />)}
          </div>
        ) : (
          <div className="rounded-[var(--sd-radius-lg)] border border-dashed border-[var(--sd-line)] bg-[var(--sd-surface)] p-8 text-center">
            <h2 className="text-xl font-bold text-[var(--sd-text)]">No articles found</h2>
            <p className="mt-3 text-sm leading-[1.75] text-[var(--sd-muted)]">Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={dc.button.secondary}>Previous</Link> : null}
          <span className="rounded-full bg-[var(--sd-accent)] px-5 py-3 text-sm font-semibold text-white">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={dc.button.secondary}>Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14 lg:pt-16`}>
        <div className="grid gap-6 overflow-hidden rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 p-6 sm:p-8 lg:p-10">
            <Link href="/article" className={dc.button.secondary}>
              <ChevronLeft className="h-4 w-4" /> Articles
            </Link>
            <p className={`${dc.type.eyebrow} mt-8 text-[var(--sd-accent)]`}>{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-2xl font-bold leading-[1.1] tracking-[-0.03em] sm:text-3xl lg:text-4xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className="min-w-0 border-t border-[var(--sd-line)] bg-[var(--sd-bg-2)] p-6 lg:border-l lg:border-t-0">
            <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Reading note</p>
            <p className="mt-4 text-sm leading-[1.75] text-[var(--sd-muted)]">{voice.secondaryNote}</p>
            <Link href="/contact" className={`${dc.button.primary} mt-6`}>
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 sm:p-8 lg:p-10">
          <p className="text-sm leading-[1.85] text-[var(--sd-muted)]">{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
