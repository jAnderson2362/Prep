import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { ProtectedRoute } from '#/components/protected-route'

const EXAM_DURATION_SECONDS = 60 * 60 // 1 hour

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
    subject: (search.subject as string) || "",
    level: (search.level as string) || "",
    standard: (search.standard as string) || "",
    topic: (search.topic as string) || "",
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

  useEffect(() => {
    async function fetchExam() {
      try {
        const token = localStorage.getItem("access_token")

        const response = await fetch("http://localhost:8000/ai/generate-exam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
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
          throw new Error("Failed to generate exam")
        }

        const data: ExamResponse = await response.json()
        setContent(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchExam()
  }, [subject, level, standard, topic])

  useEffect(() => {
    if (loading || error || !content || showResults) {
      return
    }

    if (timeLeft <= 0) {
      setShowResults(true) // auto-submit handling comes in the submit stage
      return
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [loading, error, content, timeLeft, showResults])

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <p className="text-lg text-slate-600">Generating your exam...</p>
      </main>
    )
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">Something went wrong generating your exam.</p>
        <button
          onClick={() => navigate({ to: "/mode-selection", search: { subject, level, standard, topic } })}
          className="rounded-lg border border-slate-300 px-6 py-3 font-medium bg-white hover:bg-slate-100"
        >
          Go back
        </button>
      </main>
    )
  }

  const currentQuestion = content.questions[currentQuestionIndex]
  const isFirstQuestion = currentQuestionIndex === 0
  const isLastQuestion = currentQuestionIndex === content.questions.length - 1
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`
  const isLowTime = timeLeft <= 5 * 60

  function handleSubmit() {
    setShowResults(true)
  }

  if (showResults) {
    const score = content.questions.reduce((total, _, index) => {
      return selfMarks[index] ? total + 1 : total
    }, 0)

    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-semibold">Results</h1>

          <p className="mb-6 text-slate-700">
            You scored {score} out of {content.questions.length}
          </p>

          <div className="space-y-6">
            {content.questions.map((question, index) => {
              const studentAnswer = answers[index] || ""
              const mark = selfMarks[index]

              return (
                <section
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-lg font-semibold text-slate-900">
                    Question {index + 1}
                  </p>

                  <p className="mt-3 whitespace-pre-line text-slate-800">
                    {question.question}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-500">Your answer</p>
                    <p className="mt-1 whitespace-pre-line text-slate-800">
                      {studentAnswer.trim() !== "" ? studentAnswer : "(no answer)"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-slate-500">Model answer</p>
                    <p className="mt-1 whitespace-pre-line text-slate-800">
                      {question.model_answer}
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-slate-700">
                    {question.explanation}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setSelfMarks({ ...selfMarks, [index]: true })}
                      className={
                        mark === true
                          ? "rounded-lg border border-green-500 bg-green-100 px-4 py-2 text-sm font-medium text-green-800"
                          : "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                      }
                    >
                      I got this right
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelfMarks({ ...selfMarks, [index]: false })}
                      className={
                        mark === false
                          ? "rounded-lg border border-red-500 bg-red-100 px-4 py-2 text-sm font-medium text-red-800"
                          : "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700"
                      }
                    >
                      I got this wrong
                    </button>
                  </div>
                </section>
              )
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              disabled
              className="rounded-lg border border-slate-300 bg-white px-6 py-2 font-medium text-slate-400 disabled:opacity-50"
            >
              Save results (coming soon)
            </button>
          </div>

        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-semibold">Exam</h1>

        <div
          className={
            isLowTime
              ? "mb-4 text-right text-sm font-medium text-amber-600"
              : "mb-4 text-right text-sm font-medium text-slate-400"
          }
        >
          {formattedTime} remaining
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {content.questions.map((_, index) => {
            const isCurrent = index === currentQuestionIndex
            const isAnswered = answers[index] && answers[index].trim() !== ""
            const isFlagged = flagged[index]

            return (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentQuestionIndex(index)}
                className={
                  isCurrent
                    ? "h-10 w-10 rounded-lg border-2 border-blue-600 bg-blue-100 text-sm font-semibold text-blue-800"
                    : isFlagged
                      ? "h-10 w-10 rounded-lg border border-amber-500 bg-amber-100 text-sm font-semibold text-amber-800"
                      : isAnswered
                        ? "h-10 w-10 rounded-lg border border-green-500 bg-green-50 text-sm font-semibold text-green-800"
                        : "h-10 w-10 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700"
                }
              >
                {index + 1}
              </button>
            )
          })}
        </div>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Question {currentQuestionIndex + 1} of {content.questions.length}
          </h2>

          <p className="mt-3 whitespace-pre-line text-slate-800">
            {currentQuestion.question}
          </p>

          <textarea
            value={answers[currentQuestionIndex] || ""}
            onChange={(e) =>
              setAnswers({
                ...answers,
                [currentQuestionIndex]: e.target.value,
              })
            }
            placeholder="Write your answer and working here..."
            className="mt-4 w-full rounded-lg border border-slate-300 p-3 min-h-40"
          />
          <button
            type="button"
            onClick={() =>
              setFlagged({
                ...flagged,
                [currentQuestionIndex]: !flagged[currentQuestionIndex],
              })
            }
            className={
              flagged[currentQuestionIndex]
                ? "mt-4 rounded-lg border border-amber-500 bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 transition hover:opacity-80 active:scale-95"
                : "mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:opacity-80 active:scale-95"
            }
          >
            {flagged[currentQuestionIndex] ? "Flagged for review" : "Flag for review"}
          </button>
        </section>

        <div className="mt-6 grid grid-cols-3 items-center">
          <div>
            {!isFirstQuestion && (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:opacity-80 active:scale-95"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex justify-center">
            {isLastQuestion && (
              <button
                type="button"
                onClick={handleSubmit}
                className="rounded-lg border border-slate-300 bg-white px-8 py-2 transition hover:opacity-80 active:scale-95"
              >
                Finish
              </button>
            )}
          </div>

          <div className="flex justify-end">
            {!isLastQuestion && (
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:opacity-80 active:scale-95"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </main >
  )
}
