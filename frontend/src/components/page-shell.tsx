import * as React from 'react'
import { motion } from 'motion/react'
import { AlertTriangle, Loader2 } from 'lucide-react'

import { cn } from '#/lib/utils'
import { Reveal } from './motion'

/* -------------------------------------------------------------------------
   PageShell - consistent page background, vertical rhythm and width.
   ------------------------------------------------------------------------- */

type PageShellProps = React.ComponentProps<'main'> & {
  /** 'hero' adds the Prep gradient glow behind the top of the page. */
  tone?: 'plain' | 'hero'
  width?: 'narrow' | 'default' | 'wide'
  /** Vertically centre the content (auth pages, status screens). */
  center?: boolean
}

export function PageShell({
  tone = 'plain',
  width = 'default',
  center = false,
  className,
  children,
  ...props
}: PageShellProps) {
  return (
    <main
      className={cn(
        'relative isolate -mt-16 min-h-screen pt-[6.5rem] pb-10 sm:pt-[7.5rem] sm:pb-14',
        center && 'flex items-center',
        className,
      )}
      {...props}
    >
      {tone === 'hero' && (
        <div
          aria-hidden
          className="bg-prep-radial pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px]"
        />
      )}
      <div
        className={cn(
          width === 'narrow' && 'container-narrow',
          width === 'default' && 'mx-auto w-full max-w-5xl px-5 sm:px-8',
          width === 'wide' && 'container-prep',
        )}
      >
        {children}
      </div>
    </main>
  )
}

/* -------------------------------------------------------------------------
   PageHeader - eyebrow + title + description + optional actions.
   ------------------------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = 'left',
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  actions?: React.ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <Reveal
      as="header"
      className={cn(
        'mb-8 flex flex-col gap-4 sm:mb-10',
        align === 'center'
          ? 'items-center text-center'
          : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>
      )}
    </Reveal>
  )
}

/* -------------------------------------------------------------------------
   StatusScreen - loading / error states with a consistent look.
   ------------------------------------------------------------------------- */

export function StatusScreen({
  kind,
  title,
  description,
  action,
}: {
  kind: 'loading' | 'error'
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <PageShell center width="narrow">
      <Reveal className="flex flex-col items-center text-center">
        {kind === 'loading' ? (
          <div className="relative mb-6 flex size-20 items-center justify-center">
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full bg-brand/30"
              animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <span className="relative flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
              <Loader2 className="size-6 animate-spin" />
            </span>
          </div>
        ) : (
          <span className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-danger-soft text-danger-foreground">
            <AlertTriangle className="size-6" />
          </span>
        )}
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-md text-muted-foreground">{description}</p>
        )}
        {action && <div className="mt-8 flex gap-3">{action}</div>}
      </Reveal>
    </PageShell>
  )
}

/* -------------------------------------------------------------------------
   SelectionChips - shows the current subject/level/standard/topic.
   ------------------------------------------------------------------------- */

export function SelectionChips({
  items,
  className,
}: {
  items: { label: string; value: string }[]
  className?: string
}) {
  const visible = items.filter((item) => item.value)
  if (visible.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {visible.map((item) => (
        <li
          key={item.label}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium shadow-soft"
        >
          <span className="text-muted-foreground">{item.label}</span>
          <span className="text-foreground">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}
