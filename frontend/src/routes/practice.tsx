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
  const [questionCount, setQuestionCount] = useState(10)
  const [optionalNote, setOptionalNote] = useState("")

  //Use state question updates.
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  //LEAVE FOR REPLACEMENT AFTER TESTING.
  /*  useEffect(() => {
    async function fetchQuestions() {
      try {
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
        const data = await response.json()
        setContent(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [subject, level, topic])

*/

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch("/practice-output.json")
        const data: PracticeResponse = await response.json()
        setContent(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  // Loading and error handling.
  if (loading) {
    return <p>Generating practice questions...</p>
  }

  if (error || !content) {
    return <p> Something went wrong!</p>
  }

  return (
    <main>
      <h1>Practice</h1>

      {content?.questions.map((question, questionIndex) => (
        <section key={questionIndex}>
          <p>{question.question}</p>
        <div className="mt-3 flex flex-col gap-2">
          {question.options.map((option) => (
            <button key={option.id}
            type="button"
            onClick={() => 
              setSelectedAnswers({
                ...selectedAnswers,
                [questionIndex]: option.id,
              })
            }
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-left hover:bg-slate-100"
            >
              {option.id}. {option.text}
            </button>
          ))}
        </div>
        </section>
      ))}
    </main>
  )
}
