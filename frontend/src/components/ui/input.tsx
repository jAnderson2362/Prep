import * as React from 'react'

import { cn } from '#/lib/utils'

export const fieldClassName = [
  'w-full rounded-xl border border-input bg-card text-foreground shadow-soft',
  'placeholder:text-muted-foreground/70',
  'transition-[border-color,box-shadow,background-color] duration-200',
  'hover:border-brand/60',
  'focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/20',
  'disabled:cursor-not-allowed disabled:opacity-60',
  'aria-invalid:border-danger aria-invalid:ring-danger/20',
].join(' ')

function Input({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        fieldClassName,
        'h-12 px-4 text-base sm:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
