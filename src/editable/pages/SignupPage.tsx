import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[radial-gradient(circle_at_top_right,rgba(17,17,17,0.08),transparent_28%),linear-gradient(180deg,var(--editable-page-bg,#f2efe6)_0%,#efe9dd_100%)] text-[var(--editable-page-text,#111)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[var(--editable-container)] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-16">
          <div className="relative overflow-hidden rounded-[2.2rem] border border-black/10 bg-black p-6 text-white shadow-[0_30px_110px_rgba(17,17,17,0.18)] sm:p-8 lg:p-10">
            <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-3xl" />
            <div className="relative">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/55">{pagesContent.auth.signup.badge}</p>
              <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.9] tracking-[-0.09em] text-white sm:text-6xl lg:text-[4.7rem]">
                {pagesContent.auth.signup.title}
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-8 text-white/70">{pagesContent.auth.signup.description}</p>
            </div>

            <div className="relative mt-10 grid gap-4 sm:grid-cols-2">
              {[
                'Set up your profile in a few steps.',
                'Save your details for future publishing.',
                'Join the workspace without breaking your flow.',
                'Switch between sign in and sign up easily.',
              ].map((item) => (
                <div key={item} className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] p-4 text-sm font-bold leading-6 text-white/90">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[var(--slot4-accent-fill)]/25 blur-2xl" />
            <div className="rounded-[2.2rem] border border-black/10 bg-white/[0.92] p-6 shadow-[0_28px_90px_rgba(17,17,17,0.12)] sm:p-8 lg:p-10">
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-black/45">Get started</p>
              <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-black">{pagesContent.auth.signup.formTitle}</h2>
              <EditableLocalSignupForm />
              <p className="mt-5 text-sm text-black/65">
                Already have an account?{' '}
                <Link href="/login" className="font-black text-black underline-offset-4 hover:underline">
                  {pagesContent.auth.signup.loginCta}
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
