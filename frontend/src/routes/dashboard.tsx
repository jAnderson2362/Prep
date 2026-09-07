import ProgressCard from '#/components/progress-card'
import { ProtectedRoute } from '#/components/protected-route'
import { getTopicSummaries } from '#/lib/progress'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

type Progress = {
  topicId: number
  topicName: string
  score: number
  totalQuestions: number
  attemptedAt: string
}

const mockProgress: Progress[] = [
  {
    topicId: 1,
    topicName: 'Algebra',
    score: 8,
    totalQuestions: 10,
    attemptedAt: '2026-08-20',
  },
  {
    topicId: 1,
    topicName: 'Algebra',
    score: 7,
    totalQuestions: 10,
    attemptedAt: '2026-08-18',
  },
  {
    topicId: 2,
    topicName: 'Calculus',
    score: 5,
    totalQuestions: 10,
    attemptedAt: '2026-08-21',
  },
  {
    topicId: 2,
    topicName: 'Calculus',
    score: 4,
    totalQuestions: 10,
    attemptedAt: '2026-08-19',
  },
  {
    topicId: 3,
    topicName: 'Geometry',
    score: 9,
    totalQuestions: 10,
    attemptedAt: '2026-08-22',
  },
]

function Dashboard() {
  const topics = getTopicSummaries(mockProgress)

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-b from-[#81A3F8] to-[#F0F3FE] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">
              Revision Progress
            </h1>

            <p className="mt-2 text-slate-600">
              Track your performance and see which topics need more revision.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <ProgressCard
                key={topic.topicId}
                topic={topic}
              />
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  )
}