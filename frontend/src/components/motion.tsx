import * as React from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps, Transition, Variants } from 'motion/react'

import { cn } from '#/lib/utils'

/* -------------------------------------------------------------------------
   Shared easing / timing. Keep these consistent so the whole app "moves"
   the same way.
   ------------------------------------------------------------------------- */

export const easeOut = [0.22, 1, 0.36, 1] as const

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 0.8,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: easeOut },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: easeOut } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
}

export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
})

/* -------------------------------------------------------------------------
   Reveal - animate in on mount (or when scrolled into view).
   ------------------------------------------------------------------------- */

type RevealProps = HTMLMotionProps<'div'> & {
  /** Animate when scrolled into view instead of on mount. */
  inView?: boolean
  delay?: number
  variants?: Variants
  as?: 'div' | 'section' | 'article' | 'li' | 'span' | 'header' | 'footer'
}

export function Reveal({
  inView = false,
  delay = 0,
  variants = fadeUp,
  as = 'div',
  className,
  children,
  ...props
}: RevealProps) {
  const Comp = motion[as] as typeof motion.div

  return (
    <Comp
      className={className}
      variants={variants}
      initial="hidden"
      {...(inView
        ? { whileInView: 'show', viewport: { once: true, margin: '-80px' } }
        : { animate: 'show' })}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Comp>
  )
}

/* -------------------------------------------------------------------------
   Stagger - parent that staggers its <StaggerItem> children.
   ------------------------------------------------------------------------- */

type StaggerProps = HTMLMotionProps<'div'> & {
  inView?: boolean
  stagger?: number
  delay?: number
  as?: 'div' | 'ul' | 'ol' | 'section'
}

export function Stagger({
  inView = false,
  stagger = 0.08,
  delay = 0,
  as = 'div',
  className,
  children,
  ...props
}: StaggerProps) {
  const Comp = motion[as] as typeof motion.div

  return (
    <Comp
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      {...(inView
        ? { whileInView: 'show', viewport: { once: true, margin: '-60px' } }
        : { animate: 'show' })}
      {...props}
    >
      {children}
    </Comp>
  )
}

type StaggerItemProps = HTMLMotionProps<'div'> & {
  variants?: Variants
  as?: 'div' | 'li' | 'article' | 'span'
}

export function StaggerItem({
  variants = fadeUp,
  as = 'div',
  className,
  children,
  ...props
}: StaggerItemProps) {
  const Comp = motion[as] as typeof motion.div
  return (
    <Comp className={className} variants={variants} {...props}>
      {children}
    </Comp>
  )
}

/* -------------------------------------------------------------------------
   PageTransition - subtle fade/slide when the route changes.
   Keyed by pathname from the root layout.
   ------------------------------------------------------------------------- */

export function PageTransition({
  pageKey,
  children,
  className,
}: {
  pageKey: string
  children: React.ReactNode
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      key={pageKey}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      {children}
    </motion.div>
  )
}

/* -------------------------------------------------------------------------
   AnimatedProgress - width animates from 0 to `value` (%).
   ------------------------------------------------------------------------- */

export function AnimatedProgress({
  value,
  className,
  barClassName,
  delay = 0,
}: {
  value: number
  className?: string
  barClassName?: string
  delay?: number
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped)}
      className={cn(
        'h-2.5 w-full overflow-hidden rounded-full bg-muted',
        className,
      )}
    >
      <motion.div
        className={cn('h-full rounded-full bg-primary', barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.9, ease: easeOut, delay }}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------
   Presence helpers
   ------------------------------------------------------------------------- */

export function FadePresence({
  show,
  children,
  className,
}: {
  show: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          className={className}
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.25, ease: easeOut }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------
   Floating - gentle infinite float for decorative elements.
   ------------------------------------------------------------------------- */

export function Floating({
  className,
  children,
  amplitude = 8,
  duration = 5,
  delay = 0,
}: {
  className?: string
  children: React.ReactNode
  amplitude?: number
  duration?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -amplitude, 0] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  )
}

export { AnimatePresence, motion }
