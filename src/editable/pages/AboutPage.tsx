import Link from 'next/link'
import { ArrowRight, Compass, Images, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const valueIcons = [Images, Compass, Sparkles]

export default function AboutPage() {
  const about = pagesContent.about
  const imageRoute = SITE_CONFIG.taskViews.image || '/image'

  return (
    <EditableSiteShell>
      <main className="bg-[var(--sd-bg)] text-[var(--sd-text)]">
        {/* hero */}
        <section className="sd-hatch border-b border-[var(--sd-line)] bg-[linear-gradient(150deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="sd-rise max-w-2xl">
              <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{about.badge}</p>
              <h1 className="mt-4 text-[2rem] font-bold leading-[1.1] tracking-[-0.03em] text-white sm:text-4xl lg:text-[3rem]">
                {about.title}
              </h1>
              <p className="mt-5 text-[15px] leading-[1.85] text-white/60 sm:text-base">{about.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={imageRoute} className={dc.button.primary}>
                  Browse the directory <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/contact" className={dc.button.secondary}>
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* body */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <article className="rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-7 sm:p-9">
              <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{pagesContent.home.intro.badge}</p>
              <h2 className="mt-3 text-xl font-bold leading-snug tracking-[-0.02em] sm:text-[1.7rem]">
                {pagesContent.home.intro.title}
              </h2>
              <div className="mt-6 grid gap-4 text-[15px] leading-[1.85] text-[var(--sd-muted)]">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 border-t border-[var(--sd-line)] pt-6">
                <p className={`${dc.type.eyebrow} text-[var(--sd-faint)]`}>{pagesContent.home.intro.sideBadge}</p>
                <ul className="mt-4 grid gap-3">
                  {pagesContent.home.intro.sidePoints.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-[1.75] text-[var(--sd-muted)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--sd-accent)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </article>

            <div className="grid content-start gap-4 sd-stagger">
              {about.values.map((value, index) => {
                const Icon = valueIcons[index % valueIcons.length]
                return (
                  <div
                    key={value.title}
                    className="rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-[var(--sd-accent)]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <h3 className="mt-4 text-lg font-bold tracking-[-0.015em]">{value.title}</h3>
                    <p className="mt-2 text-sm leading-[1.75] text-[var(--sd-muted)]">{value.description}</p>
                  </div>
                )
              })}

              <div className="rounded-[var(--sd-radius)] bg-[var(--sd-promo)] p-6">
                <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Start here</p>
                <p className="mt-3 text-[15px] leading-[1.8] text-white/60">
                  The quickest way to understand the site is to open a listing and look around.
                </p>
                <Link
                  href={imageRoute}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]"
                >
                  Browse now <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
