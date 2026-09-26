import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '#/lib/utils'

const cardVariants = cva(
  'flex flex-col gap-6 rounded-2xl border text-card-foreground transition-[box-shadow,border-color,transform] duration-300',
  {
    variants: {
      variant: {
        default: 'border-border bg-card shadow-soft',
        elevated: 'border-border/60 bg-card shadow-lift',
        glass: 'glass border-border/60 shadow-soft',
        soft: 'border-transparent bg-secondary',
        outline: 'border-border bg-transparent',
      },
      interactive: {
        true: 'hover:-translate-y-0.5 hover:border-brand/60 hover:shadow-lift',
        false: '',
      },
      padding: {
        none: 'py-0',
        sm: 'py-4',
        md: 'py-6',
        lg: 'py-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      interactive: false,
      padding: 'md',
    },
  },
)

type CardProps = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>

function Card({
  className,
  variant,
  interactive,
  padding,
  ...props
}: CardProps) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ variant, interactive, padding }), className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
        className,
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'h3'>) {
  return (
    <h3
      data-slot="card-title"
      className={cn('text-lg leading-tight font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
        className,
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
}
