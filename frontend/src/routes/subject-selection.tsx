import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

import { ProtectedRoute } from '#/components/protected-route'
import {
  AnimatedProgress,
  Reveal,
  Stagger,
  StaggerItem,
} from '#/components/motion'
import { PageHeader, PageShell, SelectionChips } from '#/components/page-shell'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Label } from '#/components/ui/label'
import { Select } from '#/components/ui/select'
import { cn } from '#/lib/utils'

export const Route = createFileRoute('/subject-selection')({
  component: SubjectSelection,
})

function SubjectSelection() {
  const navigate = useNavigate()
  const [subject, setSubject] = useState('')
  const [subjects, setSubjects] = useState<
    { id: number; name: string; level_subject_id: number }[]
  >([])
  const [level, setLevel] = useState('')
  const [topic, setTopic] = useState('')
  const [standard, setStandard] = useState('')
  const [standards, setStandards] = useState<{ id: number; name: string }[]>([])
  const [levelSubjectId, setLevelSubjectId] = useState<number | null>(null)
  const [topics, setTopics] = useState<{ id: number; name: string }[]>([])
  const [standardId, setStandardId] = useState<number | null>(null)

  useEffect(() => {
    if (!level) return

    const levelId = level === 'Level 1' ? 1 : level === 'Level 2' ? 2 : 3

    async function fetchSubjects() {
      try {
        const response = await fetch(
          `http://localhost:8000/levels/${levelId}/subjects`,
        )
        const result = await response.json()
        setSubjects(result.data || [])
      } catch {
        setSubjects([])
      }
    }
    fetchSubjects()
  }, [level])

  useEffect(() => {
    if (!levelSubjectId) return

    async function fetchStandards() {
      try {
        const response = await fetch(
          `http://localhost:8000/level-subjects/${levelSubjectId}/standards`,
        )
        const result = await response.json()
        setStandards(result.data || [])
      } catch {
        setStandards([])
      }
    }
    fetchStandards()
  }, [levelSubjectId])

  useEffect(() => {
    if (!standardId) return

    async function fetchTopics() {
      try {
        const response = await fetch(
          `http://localhost:8000/standards/${standardId}/topics`,
        )
        const result = await response.json()
        setTopics(result.data || [])
      } catch {
        setTopics([])
      }
    }
    fetchTopics()
  }, [standardId])

  const stepsDone = [true, !!level, !!subject, !!standard, !!topic]
  const completed = stepsDone.filter(Boolean).length
  const progress = (completed / stepsDone.length) * 100

  return (
    <ProtectedRoute>
      <PageShell tone="hero">
        <PageHeader
          eyebrow="Step 1 of 2"
          title="Subject Selection"
          description="Select your exam system, subject, level, standard and specific topic of your choice."
        />

        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <Reveal delay={0.05}>
            <Card padding="lg">
              <CardContent>
                <Stagger className="space-y-6" stagger={0.06}>
                  <StaggerItem>
                    <Field
                      step={1}
                      done={stepsDone[0]}
                      label="Exam System"
                      htmlFor="exam-system"
                    >
                      <Select id="exam-system" defaultValue="NCEA">
                        <option value="NCEA">NCEA</option>
                      </Select>
                    </Field>
                  </StaggerItem>

                  <StaggerItem>
                    <Field
                      step={2}
                      done={stepsDone[1]}
                      label="Level"
                      htmlFor="level"
                    >
                      <Select
                        id="level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                      >
                        <option value="">Select a Level</option>
                        <option value="Level 1">Level 1</option>
                        <option value="Level 2">Level 2</option>
                        <option value="Level 3">Level 3</option>
                      </Select>
                    </Field>
                  </StaggerItem>

                  <StaggerItem>
                    <Field
                      step={3}
                      done={stepsDone[2]}
                      label="Subject"
                      htmlFor="subject"
                      hint={!level ? 'Choose a level first' : undefined}
                    >
                      <Select
                        id="subject"
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value)
                          const picked = subjects.find(
                            (s) => s.name === e.target.value,
                          )
                          setLevelSubjectId(
                            picked ? picked.level_subject_id : null,
                          )
                        }}
                      >
                        <option value="">Select a Subject</option>
                        {subjects.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </StaggerItem>

                  <StaggerItem>
                    <Field
                      step={4}
                      done={stepsDone[3]}
                      label="Standard"
                      htmlFor="standard"
                      hint={!subject ? 'Choose a subject first' : undefined}
                    >
                      <Select
                        id="standard"
                        value={standard}
                        onChange={(e) => {
                          setStandard(e.target.value)
                          const picked = standards.find(
                            (s) => s.name === e.target.value,
                          )
                          setStandardId(picked ? picked.id : null)
                        }}
                      >
                        <option value="">Select a Standard</option>
                        {standards.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </StaggerItem>

                  <StaggerItem>
                    <Field
                      step={5}
                      done={stepsDone[4]}
                      label="Topic"
                      htmlFor="topic"
                      hint={!standard ? 'Choose a standard first' : undefined}
                    >
                      <Select
                        id="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        <option value="">Select a Topic</option>
                        {topics.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  </StaggerItem>

                  <StaggerItem className="pt-2">
                    <Button
                      size="lg"
                      className="w-full"
                      onClick={() =>
                        navigate({
                          to: '/mode-selection',
                          search: { subject, level, standard, topic },
                        })
                      }
                    >
                      Let's go!
                      <ArrowRight />
                    </Button>
                  </StaggerItem>
                </Stagger>
              </CardContent>
            </Card>
          </Reveal>

          {/* Summary sidebar */}
          <Reveal delay={0.15} className="lg:sticky lg:top-24 lg:self-start">
            <Card variant="soft">
              <CardContent>
                <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                  Your selection
                </p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold">
                    {completed}
                    <span className="text-base font-medium text-muted-foreground">
                      /{stepsDone.length}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    complete
                  </span>
                </div>
                <AnimatedProgress value={progress} className="mt-3" />

                <SelectionChips
                  className="mt-5"
                  items={[
                    { label: 'System', value: 'NCEA' },
                    { label: 'Level', value: level },
                    { label: 'Subject', value: subject },
                    { label: 'Standard', value: standard },
                    { label: 'Topic', value: topic },
                  ]}
                />
              </CardContent>
            </Card>
          </Reveal>
        </div>
      </PageShell>
    </ProtectedRoute>
  )
}

function Field({
  step,
  done,
  label,
  htmlFor,
  hint,
  children,
}: {
  step: number
  done: boolean
  label: string
  htmlFor: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <span
        className={cn(
          'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300',
          done
            ? 'border-success bg-success text-white'
            : 'border-border bg-card text-muted-foreground',
        )}
        aria-hidden
      >
        {done ? <Check className="size-3.5" /> : step}
      </span>
      <div className="min-w-0 flex-1">
        <Label htmlFor={htmlFor} className="mb-1.5">
          {label}
        </Label>
        {children}
        {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  )
}
