'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X, Sparkles, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = {
    '--editable-nav-bg': preset.colors.background,
    '--editable-nav-text': preset.colors.foreground,
    '--editable-nav-active': preset.colors.foreground,
    '--editable-nav-active-text': preset.colors.background,
    '--editable-cta-bg': preset.colors.primary,
    '--editable-cta-text': preset.colors.foreground === '#111111' ? '#111111' : preset.colors.background,
    '--editable-search-bg': preset.colors.surface,
    '--editable-border': `${preset.colors.muted}33`,
    '--editable-container': '1500px',
  } as CSSProperties
  const navItems = useMemo(
    () => [
      { label: 'Home', href: '/' },
      ...SITE_CONFIG.tasks
        .filter((task) => task.enabled && task.key !== 'profile')
        .slice(0, 4)
        .map((task) => ({ label: task.label, href: task.route })),
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
    ],
    []
  )
  const primaryAction = globalContent.nav?.actions?.primary || { label: 'Try free', href: '/search' }

  return (
    <header style={navVars} className="sticky top-0 z-50 text-[var(--editable-nav-text)]">
      <nav className="mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-full border border-black/10 bg-white/75 px-4 py-3 shadow-[0_16px_48px_rgba(17,17,17,0.07)] backdrop-blur-xl">
          <Link href="/" className="group flex shrink-0 items-center gap-3">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black text-[12px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-16 w-16 scale-[1.12] object-contain" />
            </span>
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-base font-black tracking-[-0.05em] text-black">{SITE_CONFIG.name}</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            <form action="/search" className="w-full max-w-[420px]">
              <label className="flex items-center rounded-full border border-black/10 bg-[var(--editable-search-bg)] px-4 py-2">
                <Search className="h-4 w-4 opacity-55" />
                <input name="q" type="search" placeholder="Search work, profiles, or topics" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-current/45" />
              </label>
            </form>
          </div>

          <div className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-black transition ${
                    active
                      ? 'bg-black text-white'
                      : 'text-black/80 hover:bg-black/5 hover:text-black'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link href="/login" className="hidden items-center gap-2 rounded-full border border-black/80 bg-[var(--slot4-accent-fill)] px-5 py-3 text-sm font-black text-black shadow-[0_10px_28px_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5 sm:inline-flex">
            Sign in
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/signup" className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-sm font-black text-black shadow-[0_10px_28px_rgba(17,17,17,0.12)] transition hover:-translate-y-0.5 sm:inline-flex">
            Sign up
          </Link>
          {session ? (
            <button type="button" onClick={logout} className="hidden rounded-full border border-black/10 bg-white/80 px-4 py-3 text-sm font-black transition hover:-translate-y-0.5 sm:inline-flex">
              Log out
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/80 p-3 shadow-sm transition hover:-translate-y-0.5 lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-black/10 bg-[var(--editable-nav-bg)] px-4 pb-5 pt-2 shadow-[0_22px_70px_rgba(17,17,17,0.14)] lg:hidden">
          <form action="/search" className="mb-4 rounded-[1.4rem] border border-black/10 bg-white p-3">
            <label className="flex items-center gap-3">
              <Search className="h-4 w-4 opacity-55" />
              <input name="q" type="search" placeholder="Search work, profiles, or topics" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-current/40" />
            </label>
          </form>
          <div className="grid gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-[1.35rem] border border-black/10 bg-white/80 px-4 py-3 text-sm font-black text-black/85">
                {item.label} <Sparkles className="h-4 w-4 opacity-50" />
              </Link>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-[1.35rem] border border-black/10 bg-[var(--slot4-accent-soft)] px-4 py-3 text-sm font-black">
              Contact <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  )
}
