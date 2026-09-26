import * as React from 'react'

import { cn } from '#/lib/utils'
import { fieldClassName } from './input'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        fieldClassName,
        'min-h-32 resize-y px-4 py-3 text-base leading-relaxed sm:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
