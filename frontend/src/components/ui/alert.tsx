import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'

import { cn } from '#/lib/utils'

const alertVariants = cva(
  'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed',
  {
    variants: {
      variant: {
        info: 'border-brand/40 bg-brand-soft text-accent-foreground',
        success: 'border-success/40 bg-success-soft text-success-foreground',
        warning: 'border-warning/40 bg-warning-soft text-warning-foreground',
        danger: 'border-danger/40 bg-danger-soft text-danger-foreground',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
)

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
}

type AlertProps = React.ComponentProps<'div'> &
  VariantProps<typeof alertVariants> & {
    hideIcon?: boolean
  }

function Alert({
  className,
  variant = 'info',
  hideIcon = false,
  children,
  ...props
}: AlertProps) {
  const Icon = icons[variant ?? 'info']
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {!hideIcon && <Icon aria-hidden className="mt-0.5 size-4 shrink-0" />}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

export { Alert, alertVariants }
