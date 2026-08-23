import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'


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
    subject: String(search.subject as string) || "",
    level: String(search.level as string) || "",
    standard: String(search.standard as string) || "",
    topic: String(search.topic as string) || "",
  }),
})

function Practice() {
  const { subject, level, standard, topic } = Route.useSearch()
  const navigate = useNavigate()

  //Page reloading
  const [content, setContent] = useState<PracticeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  //Set question settings
  const [difficulty, setDifficulty] = useState("medium")
  const [questionCount, setQuestionCount] = useState(3)
  const [optionalNote, setOptionalNote] = useState("")

  //Use state question updates.
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [showSelectWarning, setShowSelectWarning] = useState(false)

  async function fetchQuestions() {
    setLoading(true)
    setError(false)

    try {
      /*
      const response = await fetch("/practice-output.json")
      */

      const response = await fetch("http://localhost:8000/ai/generate-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          level,
          topic,
          difficulty,
          question_count: questionCount,
          optional_note: optionalNote || null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate practice questions")
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

  // Loading and error handling.
  if (loading) {
    return <p>Generating practice questions...</p>
  }

  if (error || !content) {
    return <p> Something went wrong!</p>
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
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-3xl font-semibold">Results</h1>

          <p className="mb-6 text-slate-700">
            You scored {score} out of {content.questions.length}
          </p>

          <div className="space-y-6">
            {content.questions.map((question, questionIndex) => {
              const resultSelectedOptionId = selectedAnswers[questionIndex]
              const isCorrect = resultSelectedOptionId === question.correct_option_id

              return (
                <section
                  key={questionIndex}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-lg font-semibold text-slate-900">
                    Question {questionIndex + 1}
                  </p>

                  <p className="mt-3 text-slate-800">
                    {question.question}
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    {question.options.map((option) => {
                      const isSelected = resultSelectedOptionId === option.id
                      const isCorrectOption = question.correct_option_id === option.id
                      const isWrongSelected = isSelected && !isCorrect

                      return (
                        <div
                          key={option.id}
                          className={
                            isCorrectOption
                              ? "flex items-center rounded-lg border border-green-500 bg-green-50 px-4 py-2"
                              : isWrongSelected
                                ? "flex items-center rounded-lg border border-red-500 bg-red-50 px-4 py-2"
                                : "flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2"
                          }
                        >
                          <span
                            className={
                              isCorrectOption
                                ? "mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white"
                                : isWrongSelected
                                  ? "mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white"
                                  : "mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700"
                            }
                          >
                            {option.id}
                          </span>

                          <span className="text-slate-800">
                            {option.text}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  <p className={isCorrect ? "mt-4 font-medium text-green-700" : "mt-4 font-medium text-red-700"}>
                    {isCorrect ? "Correct" : "Incorrect"}
                  </p>

                  <p className="mt-3 text-sm text-slate-700">
                    {question.explanation}
                  </p>
                </section>
              )
            })}
          </div>
        </div>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSelectedAnswers({})
              setSubmitted(false)
              setCurrentQuestionIndex(0)
              setShowResults(false)
              setShowSelectWarning(false)
            }}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:opacity-80 active:scale-95"
          >
            Retry Quiz
          </button>

          <button
            type="button"
            onClick={fetchQuestions}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:opacity-80 active:scale-95"
          >
            New Quiz
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/mode-selection", search: { subject, level, standard, topic } })}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:opacity-80 active:scale-95"
          >
            Select Mode
          </button>
        </div>
      </main>
    )
  }

  return (
    <main>

      {showSelectWarning && (
        <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg">
          Please select an answer before continuing.
        </div>
      )}

      <h1
        className="mb-6 pt-6 text-center text-4xl font-bold text-slate-900"
      >
        Practice Quiz
      </h1>

      <div className="space-y-4">
        <section>
          <div className="rounded-lg border pt-4 pb-7 pl-20">
          <h2 className="text-lg font-semibold text-slate-900">
            Question {currentQuestionIndex + 1} of {content.questions.length}
          </h2>
          <p>{currentQuestion.question}</p>
          </div>

          <div className="mt-3 flex flex-col gap-2">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOptionId === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedAnswers({
                      ...selectedAnswers,
                      [currentQuestionIndex]: option.id,
                    })
                    setShowSelectWarning(false)
                  }}
                  className={
                    isSelected
                      ? "flex items-center rounded-lg border border-blue-600 bg-blue-100 px-4 py-2 text-left"
                      : "flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-left"
                  }
                >
                  <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold">
                    {option.id}
                  </span>
                  <span>{option.text}</span>

                </button>
              )
            })}
          </div>
        </section>
        <div className="mt-6 mb-6 grid grid-cols-3 items-center">
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
                onClick={() => {
                  if (!selectedOptionId) {
                    setShowSelectWarning(true)
                    return
                  }

                  setShowSelectWarning(false)
                  setShowResults(true)
                }}
                className="rounded-lg border border-slate-300 bg-white px-25 py-2 transition hover:opacity-80 active:scale-95"
              >
                Finish
              </button>
            )}
          </div>

          <div className="flex justify-end">
            {!isLastQuestion && (
              <button
                type="button"
                onClick={() => {
                  if (!selectedOptionId) {
                    setShowSelectWarning(true)
                    return
                  }

                  setShowSelectWarning(false)
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 transition hover:opacity-80 active:scale-95"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
