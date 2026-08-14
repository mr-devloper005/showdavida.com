import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, BadgeCheck, Compass, ShieldCheck } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

const perks = [
  { icon: Compass, label: 'Keep browsing', note: 'Pick up where you left off.' },
  { icon: BadgeCheck, label: 'Manage listings', note: 'Edit and track what you publish.' },
  { icon: ShieldCheck, label: 'Stays local', note: 'Your session lives in this browser.' },
]

export default function LoginPage() {
  const copy = pagesContent.auth.login

  return (
    <EditableSiteShell>
      <main className="bg-[var(--sd-bg)] text-[var(--sd-text)]">
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid overflow-hidden rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
            {/* copy panel */}
            <div className="sd-hatch relative bg-[linear-gradient(150deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)] p-8 sm:p-10 lg:p-12">
              <span className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{copy.badge}</span>
              <h1 className="mt-5 text-2xl font-bold leading-[1.14] tracking-[-0.03em] text-white sm:text-3xl">{copy.title}</h1>
              <p className="mt-4 max-w-md text-[15px] leading-[1.85] text-white/60">{copy.description}</p>

              <div className="mt-9 grid gap-3">
                {perks.map((perk) => (
                  <div key={perk.label} className="flex items-start gap-3 rounded-[var(--sd-radius-sm)] border border-white/10 bg-white/[0.05] p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-[var(--sd-accent)]">
                      <perk.icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{perk.label}</span>
                      <span className="mt-0.5 block text-[13px] text-white/45">{perk.note}</span>
                    </span>
                  </div>
                ))}
              </div>

              <Link href="/" className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-white/50 transition hover:gap-3 hover:text-white">
                Back to home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* form panel */}
            <div className="bg-[var(--sd-surface)] p-8 sm:p-10 lg:p-12">
              <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{copy.formTitle}</p>
              <h2 className="mt-3 text-xl font-bold tracking-[-0.02em] sm:text-2xl">Sign in to your account</h2>
              <p className="mt-2 text-sm leading-[1.75] text-[var(--sd-muted)]">
                Enter the email and password you used when creating your account.
              </p>

              <EditableLocalLoginForm />

              <p className="mt-6 text-sm leading-[1.75] text-[var(--sd-muted)]">
                New here?{' '}
                <Link href="/signup" className="font-semibold text-[var(--sd-accent)] sd-underline">
                  {copy.createCta}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
