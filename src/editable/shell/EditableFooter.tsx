'use client'

import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': 'var(--editable-page-bg, #f2efe6)',
    '--editable-footer-text': 'var(--editable-page-text, #111111)',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="border-t border-black/10 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-8 rounded-[2.2rem] border border-black/10 bg-white/70 p-6 shadow-[0_24px_70px_rgba(17,17,17,0.08)] backdrop-blur-lg lg:grid-cols-[1.25fr_0.9fr_0.9fr_1.1fr] lg:p-8">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-full border border-black/10 bg-black text-white shadow-sm">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-14 w-14 scale-[1.12] object-contain" />
              </span>
              <span>
                <span className="block text-lg font-black tracking-[-0.05em]">{SITE_CONFIG.name}</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-7 opacity-70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.28em] opacity-55">Explore</h3>
            <div className="mt-4 grid gap-3">
              {taskLinks.map((task) => (
                task.key === 'profile' ? null : (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-black transition hover:translate-x-0.5">
                  {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                )
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.28em] opacity-55">Site</h3>
            <div className="mt-4 grid gap-3">
              {[
                ['About', '/about'],
                ['Search', '/search'],
                ['Contact', '/contact'],
                ...(session ? [['Create', '/create']] : [['Sign in', '/login'], ['Sign up', '/signup']]),
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm font-black transition hover:translate-x-0.5">
                  {label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="text-left text-sm font-black transition hover:translate-x-0.5">
                  Log out
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.28em] opacity-55">Newsletter</h3>
            <p className="mt-4 text-sm leading-7 opacity-70">Stay close to featured posts, fresh profiles, and new gallery drops.</p>
            <form className="mt-4 flex overflow-hidden rounded-full border border-black/10 bg-white shadow-sm" onSubmit={(event) => event.preventDefault()}>
              <label className="flex min-w-0 flex-1 items-center gap-2 px-4 py-3">
                <Mail className="h-4 w-4 opacity-55" />
                <input type="email" placeholder="Email address" className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-current/35" />
              </label>
              <button type="submit" className="bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                Sign up
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-black/10 pt-5 text-xs font-black uppercase tracking-[0.22em] opacity-60 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} {SITE_CONFIG.name}</span>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/contact">Terms</Link>
            <Link href="/contact">Privacy</Link>
            <span>{globalContent.footer?.bottomNote || 'Built for clean discovery and connected browsing.'}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
