import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Flag,
  LayoutGrid,
  RefreshCw,
  RotateCcw,
  X,
  XCircle,
} from 'lucide-react'

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
import { cn } from '#/lib/utils'

type PracticeOption = {
  id: string
  text: string
}

type PracticeQuestion = {
  question: string
  options: PracticeOption[]
  correct_option_id: string
  explanation: string
}

type PracticeResponse = {
  questions: PracticeQuestion[]
}

type PracticeSearch = {
  subject: string
  level: string
  standard: string
  topic: string
}

export const Route = createFileRoute('/practice')({
  component: Practice,
  validateSearch: (search: Record<string, unknown>): PracticeSearch => ({
    subject: String(search.subject as string) || '',
    level: String(search.level as string) || '',
    standard: String(search.standard as string) || '',
    topic: String(search.topic as string) || '',
  }),
})

function Practice() {
  const { subject, level, standard, topic } = Route.useSearch()
  const navigate = useNavigate()

  // Page reloading
  const [content, setContent] = useState<PracticeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Set question settings
  const [difficulty, setDifficulty] = useState('medium')
  const [questionCount, setQuestionCount] = useState(3)
  const [optionalNote, setOptionalNote] = useState('')

  // Use state question updates.
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, string>
  >({})
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [showSelectWarning, setShowSelectWarning] = useState(false)

  async function fetchQuestions() {
    setLoading(true)
    setError(false)

    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate({ to: '/sign-in' })
      return
    }

    try {
      const response = await fetch(
        'http://localhost:8000/ai/generate-practice',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            subject,
            level,
            topic,
            difficulty,
            question_count: questionCount,
            optional_note: optionalNote || null,
          }),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to generate practice questions')
      }

      const data: PracticeResponse = await response.json()
      setContent(data)
      setSelectedAnswers({})
      setSubmitted(false)
      setCurrentQuestionIndex(0)
      setShowResults(false)
      setShowSelectWarning(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [subject, level, topic])

  // Setters kept for the (unused) question settings UI so behaviour is unchanged.
  void setDifficulty
  void setQuestionCount
  void setOptionalNote
  void submitted

  const goToModes = () =>
    navigate({
      to: '/mode-selection',
      search: { subject, level, standard, topic },
    })

  // Loading and error handling.
  if (loading) {
    return (
      <StatusScreen
        kind="loading"
        title="Generating practice questions..."
        description={`Writing ${questionCount} ${difficulty} questions on ${topic || 'this topic'}.`}
      />
    )
  }

  if (error || !content) {
    return (
      <StatusScreen
        kind="error"
        title="Something went wrong!"
        description="We couldn't generate your practice questions. Please try again."
        action={
          <>
            <Button variant="outline" size="lg" onClick={goToModes}>
              <ArrowLeft />
              Select Mode
            </Button>
            <Button size="lg" onClick={fetchQuestions}>
              <RefreshCw />
              Try again
            </Button>
          </>
        }
      />
    )
  }

  const score = content.questions.reduce((total, question, questionIndex) => {
    const selectedOptionId = selectedAnswers[questionIndex]
    const isCorrect = selectedOptionId === question.correct_option_id

    return isCorrect ? total + 1 : total
  }, 0)

  const currentQuestion = content.questions[currentQuestionIndex]
  const selectedOptionId = selectedAnswers[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === content.questions.length - 1
  const isFirstQuestion = currentQuestionIndex === 0

  if (showResults) {
    const percent = Math.round((score / content.questions.length) * 100)
    const tone =
      percent >= 80 ? 'success' : percent >= 60 ? 'warning' : 'danger'

    return (
      <PageShell tone="hero">
        <PageHeader
          eyebrow="Practice"
          title="Results"
          description={`You scored ${score} out of ${content.questions.length}`}
        />

        <Reveal delay={0.05} className="mb-8">
          <Card variant="soft">
            <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
              <ScoreRing percent={percent} tone={tone} />
              <div className="flex-1 text-center sm:text-left">
                <p className="text-2xl font-bold">
                  {percent >= 80
                    ? 'Excellent work!'
                    : percent >= 60
                      ? 'Good effort, keep going.'
                      : 'This topic needs more revision.'}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review each question below, then retry or generate a fresh
                  quiz.
                </p>
                <AnimatedProgress
                  value={percent}
                  className="mt-4"
                  barClassName={
                    tone === 'success'
                      ? 'bg-success'
                      : tone === 'warning'
                        ? 'bg-warning'
                        : 'bg-danger'
                  }
                />
              </div>
            </CardContent>
          </Card>
        </Reveal>

        <Stagger className="space-y-5" stagger={0.08}>
          {content.questions.map((question, questionIndex) => {
            const resultSelectedOptionId = selectedAnswers[questionIndex]
            const isCorrect =
              resultSelectedOptionId === question.correct_option_id

            return (
              <StaggerItem key={questionIndex}>
                <Card>
                  <CardContent>
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                        Question {questionIndex + 1}
                      </p>
                      <Badge variant={isCorrect ? 'success' : 'danger'}>
                        {isCorrect ? <CheckCircle2 /> : <XCircle />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </Badge>
                    </div>

                    <p className="mt-3 text-lg font-semibold">
                      {question.question}
                    </p>

                    <div className="mt-4 flex flex-col gap-2">
                      {question.options.map((option) => {
                        const isSelected = resultSelectedOptionId === option.id
                        const isCorrectOption =
                          question.correct_option_id === option.id
                        const isWrongSelected = isSelected && !isCorrect

                        return (
                          <div
                            key={option.id}
                            className={cn(
                              'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm',
                              isCorrectOption
                                ? 'border-success bg-success-soft'
                                : isWrongSelected
                                  ? 'border-danger bg-danger-soft'
                                  : 'border-border bg-card',
                            )}
                          >
                            <span
                              className={cn(
                                'inline-flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                isCorrectOption
                                  ? 'bg-success text-white'
                                  : isWrongSelected
                                    ? 'bg-danger text-white'
                                    : 'border border-border text-muted-foreground',
                              )}
                            >
                              {isCorrectOption ? (
                                <Check className="size-3.5" />
                              ) : isWrongSelected ? (
                                <X className="size-3.5" />
                              ) : (
                                option.id
                              )}
                            </span>
                            <span className="text-foreground/90">
                              {option.text}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 rounded-xl bg-secondary/60 px-4 py-3 text-sm leading-relaxed text-foreground/90">
                      <span className="font-semibold">Explanation: </span>
                      {question.explanation}
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            )
          })}
        </Stagger>

        <Reveal
          delay={0.3}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              setSelectedAnswers({})
              setSubmitted(false)
              setCurrentQuestionIndex(0)
              setShowResults(false)
              setShowSelectWarning(false)
            }}
          >
            <RotateCcw />
            Retry Quiz
          </Button>

          <Button size="lg" onClick={fetchQuestions}>
            <RefreshCw />
            New Quiz
          </Button>

          <Button variant="ghost" size="lg" onClick={goToModes}>
            <LayoutGrid />
            Select Mode
          </Button>
        </Reveal>
      </PageShell>
    )
  }

  const progress = ((currentQuestionIndex + 1) / content.questions.length) * 100

  return (
    <PageShell tone="hero">
      <AnimatePresence>
        {showSelectWarning && (
          <motion.div
            key="warning"
            role="alert"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="fixed top-20 left-1/2 z-50 w-[min(90vw,24rem)] -translate-x-1/2"
          >
            <Alert variant="danger" className="shadow-lift">
              Please select an answer before continuing.
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader
        eyebrow={topic || 'Practice'}
        title="Practice Quiz"
        description={`${content.questions.length} questions · ${difficulty} difficulty`}
        actions={
          <Button variant="ghost" onClick={goToModes}>
            <ArrowLeft />
            Modes
          </Button>
        }
      />

      <Reveal delay={0.05} className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">
            Question {currentQuestionIndex + 1} of {content.questions.length}
          </span>
          <span className="text-muted-foreground">
            {Object.keys(selectedAnswers).length} answered
          </span>
        </div>
        <AnimatedProgress value={progress} />
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
              <h2 className="text-xl leading-snug font-bold sm:text-2xl">
                {currentQuestion.question}
              </h2>

              <div className="mt-6 flex flex-col gap-3">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = selectedOptionId === option.id

                  return (
                    <motion.button
                      key={option.id}
                      type="button"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 + i * 0.06,
                        duration: 0.3,
                        ease: easeOut,
                      }}
                      whileTap={{ scale: 0.985 }}
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedAnswers({
                          ...selectedAnswers,
                          [currentQuestionIndex]: option.id,
                        })
                        setShowSelectWarning(false)
                      }}
                      className={cn(
                        'flex w-full items-center gap-4 rounded-xl border px-4 py-3.5 text-left text-sm transition-[border-color,background-color,box-shadow] duration-200',
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-glow'
                          : 'border-border bg-card hover:border-brand/60 hover:bg-secondary/60',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border text-muted-foreground',
                        )}
                      >
                        {option.id}
                      </span>
                      <span className="flex-1 font-medium">{option.text}</span>
                    </motion.button>
                  )
                })}
              </div>
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
            <Button
              size="lg"
              onClick={() => {
                if (!selectedOptionId) {
                  setShowSelectWarning(true)
                  return
                }

                setShowSelectWarning(false)
                setShowResults(true)
              }}
            >
              <Flag />
              Finish
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (!selectedOptionId) {
                  setShowSelectWarning(true)
                  return
                }

                setShowSelectWarning(false)
                setCurrentQuestionIndex(currentQuestionIndex + 1)
              }}
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

function ScoreRing({
  percent,
  tone,
}: {
  percent: number
  tone: 'success' | 'warning' | 'danger'
}) {
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const color =
    tone === 'success'
      ? 'text-success'
      : tone === 'warning'
        ? 'text-warning'
        : 'text-danger'

  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          className="stroke-muted"
        />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          className={cn('stroke-current', color)}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - percent / 100) }}
          transition={{ duration: 1.1, ease: easeOut, delay: 0.2 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-extrabold">{percent}%</span>
      </div>
    </div>
  )
}
