'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto bg-[var(--sd-ticker)] text-[var(--sd-text)]">
      {/* call-to-action band sits above the link grid */}
      <div className="border-b border-[var(--sd-line)] bg-[var(--sd-promo)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center gap-4 px-4 py-9 text-center sm:px-6 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--sd-accent)]">Get listed</p>
            <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] sm:text-2xl">Put your business in front of people looking for it.</h2>
          </div>
          <Link
            href="/signup"
            className="shrink-0 rounded-full bg-[var(--sd-accent)] px-7 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--sd-accent-strong)]"
          >
            Get started — free
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img src="/favicon.png" alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
              <span className="text-lg font-bold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
            </Link>

            <p className="mt-5 text-[15px] leading-[1.8] text-[var(--sd-muted)]">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>

            <form
              className="mt-7 flex items-center gap-2 rounded-full bg-[var(--sd-surface)] p-1.5 pl-4 ring-1 ring-white/[0.07] transition focus-within:ring-[var(--sd-accent-ring)]"
              onSubmit={(event) => event.preventDefault()}
            >
              <Mail className="h-4 w-4 shrink-0 text-[var(--sd-faint)]" />
              <input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm font-medium text-[var(--sd-text)] outline-none"
              />
              <button className="shrink-0 rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]">
                Join
              </button>
            </form>
            <p className="mt-2.5 pl-1 text-xs text-[var(--sd-faint)]">A short note when new listings go live. No noise.</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Browse"
              links={[...taskLinks.map((task) => ({ label: task.label, href: task.route })), { label: 'Search', href: '/search' }]}
            />
            <FooterColumn
              title="Site"
              links={[
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ]}
            />
            <FooterColumn
              title="Account"
              links={session ? [{ label: 'Create post', href: '/create' }] : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }]}
              action={
                session ? (
                  <button type="button" onClick={logout} className="w-fit text-left text-sm font-medium text-[var(--sd-muted)] transition hover:text-white">
                    Log out
                  </button>
                ) : undefined
              }
            />
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[var(--sd-line)] pt-7 text-sm text-[var(--sd-faint)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--sd-accent)]" />
              {globalContent.footer?.bottomNote || 'Updated daily'}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em]">
              <MapPin className="h-3.5 w-3.5 text-[var(--sd-accent)]" />
              {globalContent.site.domain}
            </span>
            <Link href="/contact" className="inline-flex items-center gap-1.5 font-medium transition hover:text-white">
              Contact
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
  action,
}: {
  title: string
  links: Array<{ label: string; href: string }>
  action?: React.ReactNode
}) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--sd-accent)]">{title}</h3>
      <div className="mt-4 grid gap-2.5">
        {links.map((link) => (
          <Link
            key={`${title}-${link.href}`}
            href={link.href}
            className="w-fit text-sm font-medium text-[var(--sd-muted)] transition hover:translate-x-0.5 hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        {action}
      </div>
    </div>
  )
}
