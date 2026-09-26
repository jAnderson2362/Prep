import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { ProtectedRoute } from '#/components/protected-route'
import { Reveal, Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell, SelectionChips } from '#/components/page-shell'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/mode-selection')({
  component: ModeSelection,
  validateSearch: (search) => ({
    subject: (search.subject as string) || '',
    level: (search.level as string) || '',
    standard: (search.standard as string) || '',
    topic: (search.topic as string) || '',
  }),
})

const modes = [
  {
    to: '/learn',
    title: 'Learn',
    description:
      'A clear explanation, worked examples and the key points you need to remember for this topic.',
  },
  {
    to: '/practice',
    title: 'Practice',
    description:
      'Multiple-choice questions with instant feedback. Pick the difficulty and how many you want.',
  },
  {
    to: '/exam',
    title: 'Exam',
    description:
      'A timed, exam-style paper with written answers, flagging and model answers to self-mark.',
  },
] as const

function ModeSelection() {
  const { subject, level, standard, topic } = Route.useSearch()
  const search = { subject, level, standard, topic }

  return (
    <ProtectedRoute>
      <PageShell tone="hero">
        <PageHeader
          align="center"
          eyebrow="Step 2 of 2"
          title="Choose Your Study Mode"
          description="Select how you'd like to revise this topic."
        />

        <Reveal className="mb-10 flex justify-center">
          <SelectionChips
            className="justify-center"
            items={[
              { label: 'Level', value: level },
              { label: 'Subject', value: subject },
              { label: 'Standard', value: standard },
              { label: 'Topic', value: topic },
            ]}
          />
        </Reveal>

        <Stagger className="grid gap-5 md:grid-cols-3" stagger={0.12}>
          {modes.map((mode) => (
            <StaggerItem key={mode.title} className="h-full">
              <Link
                to={mode.to}
                search={search}
                className="group block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <Card interactive className="h-full">
                  <CardContent className="flex h-full flex-col">
                    <h2 className="text-2xl font-bold">{mode.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {mode.description}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                      Start {mode.title.toLowerCase()}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.4} className="mt-10 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/subject-selection">
              <ArrowLeft />
              Change Topic
            </Link>
          </Button>
        </Reveal>
      </PageShell>
    </ProtectedRoute>
  )
}
