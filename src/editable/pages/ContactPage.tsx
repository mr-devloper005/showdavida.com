'use client'

import Link from 'next/link'
import { Clock3, Images, Mail, MessageSquare, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

const lanes = [
  {
    icon: Images,
    title: 'Listings and submissions',
    body: 'Share a business listing, a gallery, or a set of images you would like considered for the directory.',
  },
  {
    icon: MessageSquare,
    title: 'Corrections and edits',
    body: 'Spotted something out of date on a listing? Send the details and we will get it updated.',
  },
  {
    icon: Sparkles,
    title: 'Everything else',
    body: 'Partnerships, feedback on the site, or a question that does not fit anywhere above.',
  },
]

export default function ContactPage() {
  const copy = pagesContent.contact

  return (
    <EditableSiteShell>
      <main className="bg-[var(--sd-bg)] text-[var(--sd-text)]">
        <section className="sd-hatch border-b border-[var(--sd-line)] bg-[linear-gradient(150deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="sd-rise max-w-2xl">
              <p className={`${dc.type.eyebrow} inline-flex items-center gap-2 text-[var(--sd-accent)]`}>
                <Mail className="h-3.5 w-3.5" />
                {copy.eyebrow}
              </p>
              <h1 className="mt-4 text-[1.9rem] font-bold leading-[1.12] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.8rem]">
                {copy.title}
              </h1>
              <p className="mt-4 text-[15px] leading-[1.85] text-white/60">{copy.description}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
            <div className="grid content-start gap-4 sd-stagger">
              {lanes.map((lane) => (
                <div
                  key={lane.title}
                  className="rounded-[var(--sd-radius)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 transition duration-300 hover:-translate-y-1 hover:border-[var(--sd-accent-ring)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sd-accent-soft)] text-[var(--sd-accent)]">
                    <lane.icon className="h-4 w-4" />
                  </span>
                  <h2 className="mt-4 text-lg font-bold tracking-[-0.015em]">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-[1.75] text-[var(--sd-muted)]">{lane.body}</p>
                </div>
              ))}

              <div className="rounded-[var(--sd-radius)] bg-[var(--sd-promo)] p-6">
                <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Before you write</p>
                <p className="mt-3 flex items-start gap-2.5 text-sm leading-[1.75] text-white/60">
                  <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--sd-accent)]" />
                  Messages are read in the order they arrive. Adding a link or the name of the listing you mean makes it much
                  faster to sort.
                </p>
                <Link href="/search" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition hover:gap-3 hover:text-white">
                  Search the site first
                </Link>
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-4">
                <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{copy.formTitle}</p>
                <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] sm:text-2xl">Tell us what you need</h2>
              </div>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
