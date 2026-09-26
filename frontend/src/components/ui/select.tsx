import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '#/lib/utils'
import { fieldClassName } from './input'

/**
 * A styled native <select>. Native selects keep keyboard / mobile behaviour
 * intact and need no portal, so they stay reliable inside forms.
 */
function Select({
  className,
  children,
  ...props
}: React.ComponentProps<'select'>) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          fieldClassName,
          'h-12 cursor-pointer appearance-none pr-11 pl-4 text-base sm:text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  )
}

export { Select }
