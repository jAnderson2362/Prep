import { Link } from '@tanstack/react-router'

import { cn } from '#/lib/utils'

/**
 * Plain wordmark for now. The real Prep logo will be added later.
 */
export function Logo({
  className,
  onClick,
}: {
  className?: string
  onClick?: () => void
}) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Prep home"
      className={cn(
        'inline-flex items-center rounded-lg text-lg font-bold tracking-tight text-foreground',
        className,
      )}
    >
      PREP
    </Link>
  )
}
