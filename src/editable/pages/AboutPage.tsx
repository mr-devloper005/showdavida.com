import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--editable-page-bg,#f2efe6)] px-4 py-14 text-[var(--editable-page-text,#111)] sm:px-6 lg:px-8 lg:py-20">
        <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 lg:grid-cols-[1.06fr_0.94fr]">
          <article className="rounded-[2.5rem] border border-black/10 bg-white/75 p-8 shadow-[0_24px_80px_rgba(17,17,17,0.08)] backdrop-blur lg:p-12">
            <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-55">{pagesContent.about.badge}</p>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-6xl">{pagesContent.about.title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 opacity-70">{pagesContent.about.description}</p>
            <div className="mt-8 space-y-4 text-sm leading-8 opacity-75">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="space-y-4">
            {pagesContent.about.values.map((value, index) => (
              <div key={value.title} className={`rounded-[2rem] border border-black/10 p-6 shadow-[0_18px_50px_rgba(17,17,17,0.06)] ${index % 2 === 0 ? 'bg-black text-white' : 'bg-white/80'}`}>
                <h2 className="text-xl font-black tracking-[-0.05em]">{value.title}</h2>
                <p className={`mt-3 text-sm leading-7 ${index % 2 === 0 ? 'text-white/70' : 'opacity-70'}`}>{value.description}</p>
              </div>
            ))}
            <div className="rounded-[2rem] border border-black/10 bg-[var(--slot4-accent-soft)] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
              <p className="text-[11px] font-black uppercase tracking-[0.28em] opacity-55">Site</p>
              <p className="mt-3 text-xl font-black tracking-[-0.05em]">{SITE_CONFIG.name}</p>
              <p className="mt-2 text-sm leading-7 opacity-70">A clear, image-led browsing space with strong hierarchy and a calm editorial pace.</p>
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
