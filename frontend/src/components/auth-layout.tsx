import { CheckCircle2 } from 'lucide-react'

import { Logo } from './logo'
import { Reveal, Stagger, StaggerItem } from './motion'
import { Card, CardContent } from './ui/card'

const perks = [
  'Lessons generated for your exact NCEA standard',
  'Practice quizzes with instant explanations',
  'Timed exams with model answers to self-mark',
]

/**
 * Shared two-column layout for Sign In / Register.
 */
export function AuthLayout({
  title,
  description,
  children,
  footer,
}: {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <main className="relative isolate -mt-16 min-h-screen pt-16">
      <div
        aria-hidden
        className="bg-prep-radial pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px]"
      />

      <div className="container-prep grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Brand panel */}
        <Reveal className="hidden lg:block">
          <div className="bg-prep-gradient relative overflow-hidden rounded-3xl p-10 shadow-lift">
            <div className="relative">
              <Logo />
              <h2 className="mt-10 max-w-md text-4xl leading-tight font-extrabold text-foreground">
                Revision that knows exactly what you're sitting.
              </h2>
              <Stagger as="ul" className="mt-8 space-y-3" delay={0.3}>
                {perks.map((perk) => (
                  <StaggerItem
                    as="li"
                    key={perk}
                    className="flex items-center gap-3 text-sm font-medium text-foreground/90"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-success">
                      <CheckCircle2 className="size-4" />
                    </span>
                    {perk}
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1} className="mx-auto w-full max-w-md">
          <Card variant="elevated" padding="lg">
            <CardContent>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {description}
              </p>
              <div className="mt-8">{children}</div>
            </CardContent>
          </Card>
          {footer && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {footer}
            </p>
          )}
        </Reveal>
      </div>
    </main>
  )
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <img
      src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
      alt=""
      className={className}
    />
  )
}

export function OrDivider() {
  return (
    <div className="my-6 flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase">
      <span className="h-px flex-1 bg-border" />
      or
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}
