import ProgressCard from '#/components/progress-card'
import { ProtectedRoute } from '#/components/protected-route'
import { Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell } from '#/components/page-shell'
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
      <PageShell tone="hero" width="wide">
        <PageHeader
          eyebrow="Dashboard"
          title="Revision Progress"
          description="Track your performance and see which topics need more revision."
        />

        <Stagger
          as="div"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.1}
        >
          {topics.map((topic) => (
            <StaggerItem key={topic.topicId} className="h-full">
              <ProgressCard topic={topic} />
            </StaggerItem>
          ))}
        </Stagger>
      </PageShell>
    </ProtectedRoute>
  )
}
