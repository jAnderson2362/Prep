import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import Hero from '../components/hero'
import { Reveal, Stagger, StaggerItem } from '../components/motion'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'

export const Route = createFileRoute('/')({
  component: App,
})

const examSystems = [
  {
    name: 'NCEA',
    region: 'New Zealand',
    detail: 'Level 1-3 Achievement Standards',
    available: true,
  },
  { name: 'Australia', region: 'Coming Soon', available: false },
  { name: 'USA', region: 'Coming Soon', available: false },
  {
    name: 'NZCE',
    region: 'New Zealand',
    detail: 'Coming 2029',
    available: false,
  },
  { name: 'UK', region: 'Coming Soon', available: false },
  { name: 'Canada', region: 'Coming Soon', available: false },
]

const modes = [
  {
    title: 'Learn',
    description:
      'Clear explanations, worked examples and key points generated for the exact standard and topic you pick.',
  },
  {
    title: 'Practice',
    description:
      'Short multiple-choice quizzes with instant feedback. Choose the difficulty and how many questions you want.',
  },
  {
    title: 'Exam',
    description:
      'A timed, exam-style paper with a question palette, flagging and model answers to self-mark against.',
  },
]

const steps = [
  {
    title: 'Choose your topic',
    description:
      'Pick your NCEA level, subject, standard and the topic you want to nail.',
  },
  {
    title: 'Pick a mode',
    description:
      'Learn it, practise it or sit it under exam conditions. Switch any time.',
  },
  {
    title: 'Track your progress',
    description:
      'See your average score per topic and where revision is needed most.',
  },
]

function App() {
  return (
    <>
      <Hero />

      {/* Modes */}
      <section className="container-prep py-20 sm:py-28">
        <Reveal inView className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
            Three ways to revise
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Built around how exams actually work
          </h2>
          <p className="mt-4 text-muted-foreground sm:text-lg">
            Every topic gets the same three-step treatment so nothing gets
            skipped and nothing gets over-done.
          </p>
        </Reveal>

        <Stagger
          inView
          className="mt-12 grid gap-5 md:grid-cols-3"
          stagger={0.12}
        >
          {modes.map((mode) => (
            <StaggerItem key={mode.title}>
              <Card interactive className="h-full">
                <CardContent>
                  <h3 className="text-xl font-bold">{mode.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {mode.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* How it works */}
      <section className="bg-prep-band">
        <div className="container-prep grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <Reveal inView>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From "I don't get it" to "I've got this" in three steps
            </h2>
            <p className="mt-4 text-muted-foreground sm:text-lg">
              Prep keeps the loop tight: learn, test, review, repeat. You'll
              always know what to do next.
            </p>
          </Reveal>

          <Stagger inView as="ol" className="space-y-4" stagger={0.12}>
            {steps.map((step, i) => (
              <StaggerItem as="li" key={step.title}>
                <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Exam systems */}
      <section className="container-prep py-20 sm:py-28">
        <Reveal inView>
          <h2 className="text-2xl font-semibold sm:text-3xl">Exam Systems</h2>
        </Reveal>

        <Stagger
          inView
          as="ul"
          className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.08}
        >
          {examSystems.map((system) => (
            <StaggerItem as="li" key={system.name}>
              <Card
                interactive={system.available}
                padding="sm"
                className={system.available ? 'h-full' : 'h-full opacity-80'}
              >
                <CardContent className="py-2">
                  <h3 className="text-lg font-semibold">{system.name}</h3>
                  <p className="mt-3 text-sm text-foreground/80">
                    {system.region}
                  </p>
                  {system.detail && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {system.detail}
                    </p>
                  )}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container-prep pb-20 sm:pb-28">
        <Reveal inView>
          <div className="bg-prep-gradient relative overflow-hidden rounded-3xl px-6 py-14 text-center shadow-lift sm:px-12 sm:py-20">
            <div className="relative">
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Ready to master your next exam?
              </h2>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="xl" asChild>
                  <Link to="/register">
                    Get Started
                    <ArrowRight />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link to="/sign-in">I already have an account</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}
