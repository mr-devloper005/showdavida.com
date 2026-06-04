import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[radial-gradient(circle_at_top_left,rgba(205,220,46,0.18),transparent_30%),linear-gradient(180deg,var(--editable-page-bg,#f2efe6)_0%,#f5f1e7_100%)] text-[var(--editable-page-text,#111)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:px-8 lg:py-16">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-black/10 bg-[linear-gradient(180deg,#ffffff_0%,#f7f3ea_100%)] p-6 shadow-[0_30px_110px_rgba(17,17,17,0.08)] sm:p-8 lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[var(--slot4-accent-soft)] blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/55">{pagesContent.auth.login.badge}</p>
              <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.09em] text-black sm:text-6xl lg:text-[4.9rem]">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-8 text-black/70">{pagesContent.auth.login.description}</p>
            </div>

            <div className="relative mt-10 grid gap-4 sm:grid-cols-3">
              {[
                'Resume where you left off.',
                'Keep submissions and browsing in one place.',
                'A fast path back into your workspace.',
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-black/10 bg-white/85 p-4 text-sm font-bold leading-6 text-black shadow-[0_12px_30px_rgba(17,17,17,0.05)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-[var(--slot4-accent-fill)]/25 blur-2xl" />
            <div className="rounded-[2.2rem] border border-black/10 bg-white p-6 shadow-[0_28px_90px_rgba(17,17,17,0.12)] sm:p-8 lg:p-10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/45">Account access</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-black">{pagesContent.auth.login.formTitle}</h2>
                </div>
                <div className="hidden rounded-full border border-black/10 bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-black sm:block">
                  Secure sign in
                </div>
              </div>
              <EditableLocalLoginForm />
              <p className="mt-5 text-sm text-black/65">
                New here?{' '}
                <Link href="/signup" className="font-black text-black underline-offset-4 hover:underline">
                  {pagesContent.auth.login.createCta}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
