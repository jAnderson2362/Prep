import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lightbulb,
  ListChecks,
} from 'lucide-react'

import { ProtectedRoute } from '#/components/protected-route'
import { Reveal, easeOut } from '#/components/motion'
import {
  PageShell,
  SelectionChips,
  StatusScreen,
} from '#/components/page-shell'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { cn } from '#/lib/utils'

type WorkedExample = {
  problem: string
  steps: string[]
  answer: string
}

type LearnContent = {
  title: string
  explanation: string
  worked_examples: WorkedExample[]
  key_points: string[]
}

export const Route = createFileRoute('/learn')({
  component: Learn,
  validateSearch: (search) => ({
    subject: (search.subject as string) || '',
    level: (search.level as string) || '',
    standard: (search.standard as string) || '',
    topic: (search.topic as string) || '',
  }),
})

function Learn() {
  return (
    <ProtectedRoute>
      <LearnPage />
    </ProtectedRoute>
  )
}

const STEPS = [
  { label: 'Explanation', icon: BookOpen },
  { label: 'Worked Examples', icon: Lightbulb },
  { label: 'Key Points', icon: ListChecks },
]

function LearnPage() {
  const { subject, level, standard, topic } = Route.useSearch()
  const [content, setContent] = useState<LearnContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [step, setStep] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchContent() {
      try {
        const token = localStorage.getItem('access_token')

        const response = await fetch(
          'http://localhost:8000/ai/generate-learn',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ subject, level, standard, topic }),
          },
        )
        const data = await response.json()
        console.log('LEARN RESPONSE:', data)
        setContent(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [subject, level, standard, topic])

  const goBack = () =>
    navigate({
      to: '/mode-selection',
      search: { subject, level, standard, topic },
    })

  if (loading) {
    return (
      <StatusScreen
        kind="loading"
        title="Generating your lesson..."
        description={`Putting together an explanation, worked examples and key points for ${topic || 'this topic'}.`}
      />
    )
  }

  if (error || !content) {
    return (
      <StatusScreen
        kind="error"
        title="Something went wrong generating your lesson."
        description="Please go back and try again in a moment."
        action={
          <Button variant="outline" size="lg" onClick={goBack}>
            <ArrowLeft />
            Go back
          </Button>
        }
      />
    )
  }

  return (
    <PageShell tone="hero">
      <Reveal as="header" className="mb-8">
        <SelectionChips
          className="mb-4"
          items={[
            { label: 'Level', value: level },
            { label: 'Subject', value: subject },
            { label: 'Standard', value: standard },
          ]}
        />
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Learn
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{content.title}</h1>
      </Reveal>

      {/* Step indicator */}
      <Reveal delay={0.1}>
        <ol className="mb-8 grid grid-cols-3 gap-2">
          {STEPS.map((s, i) => {
            const state = i < step ? 'done' : i === step ? 'current' : 'todo'
            return (
              <li key={s.label} className="min-w-0">
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-colors duration-500',
                    state === 'todo' ? 'bg-muted' : 'bg-primary',
                  )}
                />
                <div
                  className={cn(
                    'mt-2 flex items-center gap-1.5 text-xs font-medium',
                    state === 'todo'
                      ? 'text-muted-foreground'
                      : 'text-foreground',
                  )}
                >
                  <s.icon className="size-3.5 shrink-0" />
                  <span className="truncate">{s.label}</span>
                </div>
              </li>
            )
          })}
        </ol>
      </Reveal>

      <div className="space-y-6">
        <Reveal delay={0.15}>
          <Section icon={BookOpen} title="Explanation">
            <p className="leading-relaxed whitespace-pre-line text-foreground/90">
              {content.explanation}
            </p>
          </Section>
        </Reveal>

        <AnimatePresence initial={false}>
          {step >= 1 && (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <Section icon={Lightbulb} title="Worked Examples">
                <div className="space-y-4">
                  {content.worked_examples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.1,
                        duration: 0.4,
                        ease: easeOut,
                      }}
                      className="rounded-2xl border border-border bg-secondary/50 p-5"
                    >
                      <p className="font-semibold">{example.problem}</p>
                      <ol className="mt-3 space-y-2">
                        {example.steps.map((s, j) => (
                          <li
                            key={j}
                            className="flex gap-3 text-sm text-foreground/90"
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-card text-xs font-bold text-primary shadow-soft">
                              {j + 1}
                            </span>
                            <span className="pt-0.5">{s}</span>
                          </li>
                        ))}
                      </ol>
                      <p className="mt-4 rounded-xl bg-success-soft px-4 py-2.5 text-sm font-semibold text-success-foreground">
                        Answer: {example.answer}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </Section>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              key="key-points"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <Section icon={ListChecks} title="Key Points">
                <ul className="space-y-2.5">
                  {content.key_points.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.15 + i * 0.07,
                        duration: 0.35,
                        ease: easeOut,
                      }}
                      className="flex gap-3 text-sm leading-relaxed text-foreground/90"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </Section>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
        {step < 2 ? (
          <Button size="lg" onClick={() => setStep(step + 1)}>
            Continue
            <ArrowRight />
          </Button>
        ) : (
          <Button size="lg" variant="outline" onClick={goBack}>
            <ArrowLeft />
            Back to modes
          </Button>
        )}
      </div>
    </PageShell>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  children: React.ReactNode
}) {
  return (
    <Card padding="lg">
      <CardContent>
        <div className="mb-4 flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-brand-soft text-primary">
            <Icon className="size-4.5" />
          </span>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}
