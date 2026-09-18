import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { Reveal, Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell } from '#/components/page-shell'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'

export const Route = createFileRoute('/about')({
  component: About,
})

const pillars = [
  {
    title: 'Learn',
    text: 'Explanations and worked examples written for the exact standard you choose, not a generic textbook chapter.',
  },
  {
    title: 'Practice',
    text: 'Quick multiple-choice drills with an explanation for every answer so mistakes turn into understanding.',
  },
  {
    title: 'Exam',
    text: 'Timed papers with written answers, a question palette and model answers so you can self-mark honestly.',
  },
]

function About() {
  return (
    <PageShell tone="hero">
      <PageHeader
        eyebrow="About Prep"
        title="Revision built around the way exams are actually marked"
        description="Prep helps NCEA students go from a topic they don't get to one they can sit under exam conditions, one focused session at a time."
      />

      <Reveal delay={0.05}>
        <Card padding="lg">
          <CardContent className="space-y-4 text-base leading-relaxed text-foreground/90">
            <p>
              Most revision tools hand you a pile of content and leave you to
              work out what matters. Prep starts from the standard and topic
              you're actually sitting, then gives you the three things you need
              in order: a clear explanation, deliberate practice, and a
              realistic exam.
            </p>
            <p>
              Every attempt feeds your progress dashboard, so the topics that
              need the most work rise to the top and your next session is always
              the most useful one.
            </p>
          </CardContent>
        </Card>
      </Reveal>

      <Stagger inView className="mt-6 grid gap-5 md:grid-cols-3" stagger={0.12}>
        {pillars.map((pillar) => (
          <StaggerItem key={pillar.title}>
            <Card interactive className="h-full">
              <CardContent>
                <h2 className="text-lg font-bold">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {pillar.text}
                </p>
              </CardContent>
            </Card>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal inView className="mt-6">
        <Card variant="soft">
          <CardContent className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div>
                <h2 className="text-lg font-bold">Ready to try it?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create a free account and pick your first topic.
                </p>
              </div>
            </div>
            <Button size="lg" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Reveal>
    </PageShell>
  )
}
