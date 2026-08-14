'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'h-12 rounded-full border border-[var(--sd-line)] bg-white/[0.04] px-5 text-sm font-medium text-[var(--sd-text)] outline-none transition placeholder:text-[var(--sd-faint)] focus:border-[var(--sd-accent-ring)] focus:bg-white/[0.07]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const task = (enabledTasks[0]?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className={dc.shell.page}>
          <section className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid overflow-hidden rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)]">
              <div className="flex min-h-72 items-center justify-center bg-[var(--sd-surface)]">
                <Lock className="h-20 w-20 text-[var(--sd-muted)]" />
              </div>
              <div className="sd-hatch bg-[linear-gradient(150deg,var(--sd-hero)_0%,var(--sd-hero-2)_100%)] p-8 sm:p-10 lg:p-12">
                <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>{pagesContent.create.locked.badge}</p>
                <h1 className="mt-5 text-2xl font-bold leading-[1.14] tracking-[-0.03em] text-white sm:text-3xl">{pagesContent.create.locked.title}</h1>
                <p className="mt-4 max-w-md text-[15px] leading-[1.85] text-white/60">{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className={dc.button.primary}>
                    Sign in <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>Sign up</Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className={dc.shell.page}>
        <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="rounded-[var(--sd-radius-lg)] border border-[var(--sd-line)] bg-[var(--sd-surface)] p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className={`${dc.type.eyebrow} text-[var(--sd-accent)]`}>Create {activeTask?.label || 'post'}</p>
                <h1 className="mt-2 text-xl font-bold tracking-[-0.02em] sm:text-2xl">{pagesContent.create.formTitle}</h1>
              </div>
              <span className="rounded-full bg-[var(--sd-accent-soft)] px-4 py-2 text-xs font-semibold text-[var(--sd-accent)]">{session.name}</span>
            </div>

            <form onSubmit={submit} className="mt-8 grid gap-4">
              <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
              </div>
              <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
              <textarea
                className="min-h-24 rounded-[var(--sd-radius-sm)] border border-[var(--sd-line)] bg-white/[0.04] px-4 py-3 text-sm font-medium text-[var(--sd-text)] outline-none transition placeholder:text-[var(--sd-faint)] focus:border-[var(--sd-accent-ring)] focus:bg-white/[0.07]"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Short summary"
                required
              />
              <textarea
                className="min-h-48 rounded-[var(--sd-radius-sm)] border border-[var(--sd-line)] bg-white/[0.04] px-4 py-3 text-sm font-medium text-[var(--sd-text)] outline-none transition placeholder:text-[var(--sd-faint)] focus:border-[var(--sd-accent-ring)] focus:bg-white/[0.07]"
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Main content, details, notes, or description"
                required
              />

              {created ? (
                <div className="rounded-[var(--sd-radius-sm)] bg-emerald-500/15 p-4 text-emerald-300">
                  <p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                  <p className="mt-1 text-sm opacity-80">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--sd-accent)] px-6 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--sd-accent-strong)]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
