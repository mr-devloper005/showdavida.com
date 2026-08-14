'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight, LogIn, Menu, PlusCircle, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const TICKER_NOTES = [
  'New listings added daily — discover fresh businesses today',
  'Browse verified galleries from owners across every category',
  'Free to list — add your business in a couple of minutes',
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(0)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const taskTabs = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const menuItems = useMemo(
    () => [{ label: 'Home', href: '/' }, ...taskTabs, { label: 'Search', href: '/search' }, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }],
    [taskTabs]
  )

  const browseAllHref = taskTabs[0]?.href || '/search'

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))
  const cycleNote = (step: number) => setNote((value) => (value + step + TICKER_NOTES.length) % TICKER_NOTES.length)

  return (
    <header className="sticky top-0 z-50 text-[var(--sd-text)]">
      {/* tier 1 — rotating announcement */}
      <div className="hidden bg-[var(--sd-ticker)] md:block">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-center justify-center gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => cycleNote(-1)}
            aria-label="Previous announcement"
            className="text-[var(--sd-faint)] transition hover:text-[var(--sd-accent)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="truncate text-[13px] font-semibold text-[var(--sd-text)]">{TICKER_NOTES[note]}</p>
          <button
            type="button"
            onClick={() => cycleNote(1)}
            aria-label="Next announcement"
            className="text-[var(--sd-faint)] transition hover:text-[var(--sd-accent)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* tier 2 — brand, search, account */}
      <div className="bg-[var(--sd-nav)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <img src="/favicon.png" alt="" aria-hidden="true" className="h-9 w-9 object-contain" />
            <span className="text-[19px] font-bold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
          </Link>

          <form action="/search" className="mx-auto hidden w-full max-w-2xl items-center gap-2 rounded-full bg-[var(--sd-surface)] p-1 pl-5 ring-1 ring-white/[0.07] transition focus-within:ring-[var(--sd-accent-ring)] md:flex">
            <Search className="h-4 w-4 shrink-0 text-[var(--sd-faint)]" />
            <input
              name="q"
              type="search"
              placeholder="Search businesses, images..."
              aria-label="Search the directory"
              className="min-w-0 flex-1 bg-transparent py-2.5 text-sm font-medium text-[var(--sd-text)] outline-none"
            />
            <button className="shrink-0 rounded-full bg-[var(--sd-accent)] px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)]">
              Search
            </button>
          </form>

          <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
            <Link
              href="/search"
              aria-label="Search"
              className="inline-flex items-center justify-center rounded-full bg-white/[0.05] p-2.5 text-[var(--sd-muted)] transition hover:bg-white/[0.12] hover:text-white md:hidden"
            >
              <Search className="h-4 w-4" />
            </Link>

            {session ? (
              <>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden items-center gap-2 px-2 text-sm font-semibold text-[var(--sd-muted)] transition hover:text-white sm:inline-flex"
                >
                  Log out
                </button>
                <Link
                  href="/create"
                  className="hidden items-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)] sm:inline-flex"
                >
                  <PlusCircle className="h-4 w-4" />
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden items-center gap-2 px-2 text-sm font-semibold text-[var(--sd-muted)] transition hover:text-white sm:inline-flex"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="hidden items-center gap-2 rounded-full bg-[var(--sd-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--sd-accent-strong)] hover:shadow-[0_10px_24px_var(--sd-accent-ring)] sm:inline-flex"
                >
                  <PlusCircle className="h-4 w-4" />
                  Get Started
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex items-center justify-center rounded-full bg-white/[0.05] p-2.5 text-white transition hover:bg-white/[0.12] lg:hidden"
              aria-label="Toggle navigation"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* tier 3 — promo strip */}
      <div className="hidden bg-[var(--sd-promo)] sm:block">
        <p className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-2.5 text-center text-[13px] font-medium text-white/80 sm:px-6 lg:px-8">
          Free to list your business today —{' '}
          <Link href="/signup" className="font-semibold text-[var(--sd-accent)] transition hover:text-white">
            Get started →
          </Link>
        </p>
      </div>

      {/* tier 4 — section tabs */}
      <div className="border-b border-[var(--sd-line)] bg-[var(--sd-tabs)]">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-1 px-4 sm:px-6 lg:px-8">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[{ label: 'All', href: '/' }, ...taskTabs].map((tab) => {
              const active = isActive(tab.href)
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`shrink-0 border-b-2 px-4 py-3 text-[13px] font-semibold transition ${
                    active
                      ? 'border-[var(--sd-accent)] text-[var(--sd-accent)]'
                      : 'border-transparent text-[var(--sd-muted)] hover:text-[var(--sd-text)]'
                  }`}
                >
                  {tab.label}
                </Link>
              )
            })}
          </nav>
          <Link
            href={browseAllHref}
            className="my-2 shrink-0 rounded-full bg-[var(--sd-accent)] px-5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[var(--sd-accent-strong)]"
          >
            Browse all
          </Link>
        </div>
      </div>

      {/* mobile sheet */}
      {open ? (
        <div className="border-b border-[var(--sd-line)] bg-[var(--sd-nav)] px-4 pb-5 pt-4 lg:hidden">
          <form action="/search" className="flex items-center gap-2 rounded-full bg-[var(--sd-surface)] px-4 py-2.5 ring-1 ring-white/[0.07]">
            <Search className="h-4 w-4 shrink-0 text-[var(--sd-faint)]" />
            <input
              name="q"
              type="search"
              placeholder="Search the directory"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[var(--sd-text)] outline-none"
            />
          </form>

          <div className="mt-4 grid gap-1.5">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[var(--sd-radius)] px-4 py-3 text-sm font-semibold transition ${
                  isActive(item.href) ? 'bg-[var(--sd-accent)] text-white' : 'bg-white/[0.04] text-[var(--sd-muted)] hover:bg-white/[0.1]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-full bg-[var(--sd-accent)] px-4 py-3 text-center text-sm font-semibold text-white">
                  Get Started
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-full border border-[var(--sd-line-strong)] px-4 py-3 text-sm font-semibold text-[var(--sd-muted)]"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-[var(--sd-line-strong)] px-4 py-3 text-center text-sm font-semibold text-[var(--sd-muted)]">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-full bg-[var(--sd-accent)] px-4 py-3 text-center text-sm font-semibold text-white">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-center text-xs text-[var(--sd-faint)]">{globalContent.nav.tagline}</p>
        </div>
      ) : null}
    </header>
  )
}
