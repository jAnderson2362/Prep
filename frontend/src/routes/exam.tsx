import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Flag,
  Send,
  Timer,
  X,
} from 'lucide-react'

import { ProtectedRoute } from '#/components/protected-route'
import {
  AnimatedProgress,
  Reveal,
  Stagger,
  StaggerItem,
  easeOut,
} from '#/components/motion'
import { PageHeader, PageShell, StatusScreen } from '#/components/page-shell'
import { Alert } from '#/components/ui/alert'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils'

const EXAM_DURATION_SECONDS = 60 * 60 // 1 hour
const EXAM_STORAGE_KEY = 'exam-progress'

type ExamQuestion = {
  question: string
  model_answer: string
  explanation: string
  difficulty: string
  method_area: string
}

type ExamResponse = {
  questions: ExamQuestion[]
}

export const Route = createFileRoute('/exam')({
  component: Exam,
  validateSearch: (search) => ({
    subject: (search.subject as string) || '',
    level: (search.level as string) || '',
    standard: (search.standard as string) || '',
    topic: (search.topic as string) || '',
  }),
})

function Exam() {
  return (
    <ProtectedRoute>
      <ExamPage />
    </ProtectedRoute>
  )
}

function ExamPage() {
  const { subject, level, standard, topic } = Route.useSearch()
  const navigate = useNavigate()

  const [content, setContent] = useState<ExamResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [flagged, setFlagged] = useState<Record<number, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS)
  const [showResults, setShowResults] = useState(false)
  const [selfMarks, setSelfMarks] = useState<Record<number, boolean>>({})
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false)
  const [endTime, setEndTime] = useState<number | null>(null)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) {
      return
    }
    hasFetched.current = true

    const storageKey = `${EXAM_STORAGE_KEY}-${standard}-${topic}`
    const saved = sessionStorage.getItem(storageKey)

    if (saved) {
      try {
        const state = JSON.parse(saved)
        setContent(state.content)
        setAnswers(state.answers || {})
        setFlagged(state.flagged || {})
        setSelfMarks(state.selfMarks || {})
        setCurrentQuestionIndex(state.currentQuestionIndex || 0)
        setEndTime(state.endTime)
        setShowResults(state.showResults || false)
        setLoading(false)
        return
      } catch {
        // corrupted save - fall through and generate a fresh exam
      }
    }

    async function fetchExam() {
      try {
        const token = localStorage.getItem('access_token')

        const response = await fetch('http://localhost:8000/ai/generate-exam', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subject,
            level,
            standard,
            topic,
            question_count: 5,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to generate exam')
        }

        const data: ExamResponse = await response.json()
        setContent(data)
        setEndTime(Date.now() + EXAM_DURATION_SECONDS * 1000)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchExam()
  }, [subject, level, standard, topic])

  useEffect(() => {
    if (loading || error || !content) {
      return
    }

    const storageKey = `${EXAM_STORAGE_KEY}-${standard}-${topic}`
    const state = {
      content,
      answers,
      flagged,
      selfMarks,
      currentQuestionIndex,
      endTime,
      showResults,
    }
    sessionStorage.setItem(storageKey, JSON.stringify(state))
  }, [
    content,
    answers,
    flagged,
    selfMarks,
    currentQuestionIndex,
    endTime,
    showResults,
    loading,
    error,
    standard,
    topic,
  ])

  useEffect(() => {
    if (loading || error || !content || showResults || endTime === null) {
      return
    }

    const end = endTime

    function tick() {
      const secondsLeft = Math.round((end - Date.now()) / 1000)
      if (secondsLeft <= 0) {
        setTimeLeft(0)
        setShowResults(true)
      } else {
        setTimeLeft(secondsLeft)
      }
    }

    tick() // run immediately so the display is correct on load
    const timerId = setInterval(tick, 1000)

    return () => clearInterval(timerId)
  }, [loading, error, content, showResults, endTime])

  const goBack = () =>
    navigate({
      to: '/mode-selection',
      search: { subject, level, standard, topic },
    })

  if (loading) {
    return (
      <StatusScreen
        kind="loading"
        title="Generating your exam..."
        description={`Writing an exam-style paper on ${topic || 'this topic'}. Your timer starts once it's ready.`}
      />
    )
  }

  if (error || !content) {
    return (
      <StatusScreen
        kind="error"
        title="Something went wrong generating your exam."
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

  const currentQuestion = content.questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === content.questions.length - 1
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`
  const isLowTime = timeLeft <= 5 * 60

  function handleSubmit() {
    setShowConfirmSubmit(true)
  }

  function confirmSubmit() {
    setShowConfirmSubmit(false)
    setShowResults(true)
  }

  if (showResults) {
    const score = content.questions.reduce((total, _, index) => {
      return selfMarks[index] ? total + 1 : total
    }, 0)

    const markedCount = content.questions.reduce((total, _, index) => {
      return index in selfMarks ? total + 1 : total
    }, 0)
    const allMarked = markedCount === content.questions.length
    const percent = Math.round((score / content.questions.length) * 100)

    return (
      <PageShell tone="hero">
        <PageHeader
          eyebrow="Exam"
          title="Results"
          description={`You scored ${score} out of ${content.questions.length}`}
        />

        <Reveal delay={0.05} className="mb-6">
          <Card variant="soft">
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="font-display text-4xl font-extrabold">
                  {percent}%
                </span>
                <span className="text-sm text-muted-foreground">
                  {markedCount}/{content.questions.length} marked
                </span>
              </div>
              <AnimatedProgress
                value={percent}
                className="mt-3"
                barClassName={
                  percent >= 80
                    ? 'bg-success'
                    : percent >= 60
                      ? 'bg-warning'
                      : 'bg-danger'
                }
              />
            </CardContent>
          </Card>
        </Reveal>

        {!allMarked && (
          <Reveal delay={0.1} className="mb-6">
            <Alert variant="warning">
              You've marked {markedCount} of {content.questions.length}{' '}
              questions. Mark the rest to complete your score.
            </Alert>
          </Reveal>
        )}

        <Stagger className="space-y-5" stagger={0.08}>
          {content.questions.map((question, index) => {
            const studentAnswer = answers[index] || ''
            const mark = selfMarks[index]
            const isMarked = index in selfMarks

            return (
              <StaggerItem key={index}>
                <Card>
                  <CardContent>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        Question {index + 1}
                      </p>
                      {isMarked && (
                        <Badge variant={mark ? 'success' : 'danger'}>
                          {mark ? 'Marked correct' : 'Marked wrong'}
                        </Badge>
                      )}
                    </div>

                    <p className="mt-3 text-lg font-semibold whitespace-pre-line">
                      {question.question}
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      <div className="rounded-xl border border-border bg-card p-4">
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Your answer
                        </p>
                        <p className="mt-2 text-sm whitespace-pre-line text-foreground/90">
                          {studentAnswer.trim() !== ''
                            ? studentAnswer
                            : '(no answer)'}
                        </p>
                      </div>
                      <div className="rounded-xl border border-success/30 bg-success-soft p-4">
                        <p className="text-xs font-semibold tracking-wide text-success-foreground uppercase">
                          Model answer
                        </p>
                        <p className="mt-2 text-sm whitespace-pre-line text-foreground/90">
                          {question.model_answer}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 text-sm leading-relaxed text-foreground/90">
                      <span className="font-semibold">Explanation: </span>
                      {question.explanation}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Button
                        variant={mark === true ? 'success' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSelfMarks({ ...selfMarks, [index]: true })
                        }
                      >
                        <Check />I got this right
                      </Button>

                      <Button
                        variant={mark === false ? 'danger' : 'outline'}
                        size="sm"
                        onClick={() =>
                          setSelfMarks({ ...selfMarks, [index]: false })
                        }
                      >
                        <X />I got this wrong
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </Stagger>

        <Reveal delay={0.3} className="mt-8">
          <Button variant="outline" size="lg" disabled>
            Save results (coming soon)
          </Button>
        </Reveal>
      </PageShell>
    )
  }

  const answeredCount = content.questions.filter(
    (_, i) => answers[i] && answers[i].trim() !== '',
  ).length

  return (
    <PageShell tone="hero">
      <AnimatePresence>
        {showConfirmSubmit && (
          <motion.div
            key="confirm"
            className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmSubmit(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-lift"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-warning-soft text-warning-foreground">
                <AlertTriangle className="size-5" />
              </span>
              <h2 id="confirm-title" className="text-lg font-bold">
                Submit exam?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Once you submit, you can't return to your answers. Make sure
                you've reviewed any flagged questions.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmSubmit(false)}
                >
                  Keep working
                </Button>
                <Button onClick={confirmSubmit}>
                  <Send />
                  Submit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        eyebrow={topic || 'Exam'}
        title="Exam"
        description={`${content.questions.length} questions · ${answeredCount} answered`}
        actions={
          <motion.div
            animate={isLowTime ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={
              isLowTime
                ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
                : undefined
            }
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold tabular-nums shadow-soft',
              isLowTime
                ? 'border-warning/50 bg-warning-soft text-warning-foreground'
                : 'border-border bg-card text-foreground',
            )}
            aria-live="polite"
          >
            <Timer className="size-4" />
            {formattedTime} remaining
          </motion.div>
        }
      />

      {/* Question palette */}
      <Reveal delay={0.05} className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {content.questions.map((_, index) => {
            const isCurrent = index === currentQuestionIndex
            const isAnswered = answers[index] && answers[index].trim() !== ''
            const isFlagged = flagged[index]

            return (
              <motion.button
                key={index}
                type="button"
                whileTap={{ scale: 0.92 }}
                onClick={() => setCurrentQuestionIndex(index)}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Question ${index + 1}${isFlagged ? ', flagged' : ''}${isAnswered ? ', answered' : ''}`}
                className={cn(
                  'relative flex size-11 items-center justify-center rounded-xl border text-sm font-bold transition-colors',
                  isCurrent
                    ? 'border-primary bg-primary text-primary-foreground shadow-glow'
                    : isFlagged
                      ? 'border-warning/60 bg-warning-soft text-warning-foreground'
                      : isAnswered
                        ? 'border-success/60 bg-success-soft text-success-foreground'
                        : 'border-border bg-card text-muted-foreground hover:border-brand/60',
                )}
              >
                {index + 1}
                {isFlagged && !isCurrent && (
                  <Flag className="absolute -top-1.5 -right-1.5 size-3.5 fill-warning text-warning" />
                )}
              </motion.button>
            )
          })}
          <div className="ml-auto hidden items-center gap-4 text-xs text-muted-foreground sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-success" /> Answered
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-warning" /> Flagged
            </span>
          </div>
        </div>
      </Reveal>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.3, ease: easeOut }}
        >
          <Card padding="lg">
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Question {currentQuestionIndex + 1} of{' '}
                  {content.questions.length}
                </h2>
                <div className="flex gap-2">
                  {currentQuestion.difficulty && (
                    <Badge variant="outline">
                      {currentQuestion.difficulty}
                    </Badge>
                  )}
                  {currentQuestion.method_area && (
                    <Badge variant="soft">{currentQuestion.method_area}</Badge>
                  )}
                </div>
              </div>

              <p className="mt-4 text-lg leading-relaxed font-semibold whitespace-pre-line sm:text-xl">
                {currentQuestion.question}
              </p>

              <Textarea
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [currentQuestionIndex]: e.target.value,
                  })
                }
                placeholder="Write your answer and working here..."
                className="mt-6 min-h-44"
                aria-label={`Answer for question ${currentQuestionIndex + 1}`}
              />

              <Button
                variant={flagged[currentQuestionIndex] ? 'warning' : 'outline'}
                size="sm"
                className="mt-4"
                aria-pressed={!!flagged[currentQuestionIndex]}
                onClick={() =>
                  setFlagged({
                    ...flagged,
                    [currentQuestionIndex]: !flagged[currentQuestionIndex],
                  })
                }
              >
                <Flag
                  className={
                    flagged[currentQuestionIndex] ? 'fill-current' : ''
                  }
                />
                {flagged[currentQuestionIndex]
                  ? 'Flagged for review'
                  : 'Flag for review'}
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div>
          {!isFirstQuestion && (
            <Button
              variant="outline"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              <ArrowLeft />
              Back
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {isLastQuestion ? (
            <Button size="lg" onClick={handleSubmit}>
              <Send />
              Finish
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              Next
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </PageShell>
  )
}
