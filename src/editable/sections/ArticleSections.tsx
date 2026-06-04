import Link from 'next/link'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
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
        <div className="grid gap-6 rounded-[2.5rem] border border-black/10 bg-white/80 p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] backdrop-blur lg:grid-cols-[1.12fr_0.88fr] lg:p-10">
          <div className="min-w-0">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl">{voice.headline}</h1>
            <p className="mt-6 max-w-3xl text-base leading-8 opacity-70 sm:text-lg">{voice.description}</p>
            <form action={basePath} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
              <select name="category" defaultValue={category || 'all'} className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="rounded-full bg-black px-6 py-3 text-sm font-black text-white">Filter</button>
            </form>
          </div>
          <aside className="rounded-[2rem] bg-black p-6 text-white shadow-[0_24px_80px_rgba(17,17,17,0.16)]">
            <p className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>Reading note</p>
            <h2 className="mt-4 text-3xl font-black leading-[0.94] tracking-[-0.07em]">Curated articles, slower pacing, stronger hierarchy.</h2>
            <p className="mt-4 text-sm leading-7 text-white/72">{voice.secondaryNote}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {voice.chips.map((chip) => (
                <span key={chip} className="rounded-full border border-white/10 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em]">
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
          <div className="rounded-[2rem] border border-dashed border-black/10 bg-white/80 p-8 text-center shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
            <h2 className="text-3xl font-black tracking-[-0.05em]">No articles found</h2>
            <p className="mt-3 text-sm leading-7 text-black/60">Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
          <span className="rounded-full bg-black px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
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
        <div className="grid gap-6 rounded-[2.5rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] lg:grid-cols-[minmax(0,1fr)_320px] lg:p-10">
          <div className="min-w-0">
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-black">
              <ChevronLeft className="h-4 w-4" /> Articles
            </Link>
            <p className={`${dc.type.eyebrow} mt-8 ${pal.accentText}`}>{voice.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.08em] sm:text-5xl lg:text-6xl">{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className="min-w-0 rounded-[2rem] bg-black p-6 text-white">
            <p className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/72">{voice.secondaryNote}</p>
            <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-black">
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className="rounded-[2.25rem] border border-black/10 bg-white p-6 shadow-[0_24px_80px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
          <p className="text-sm leading-8 text-black/65">{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
