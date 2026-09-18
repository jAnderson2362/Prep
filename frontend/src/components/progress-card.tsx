import { Link } from '@tanstack/react-router'

import { formatProgressDate, getPerformance } from '../lib/progress'
import type { TopicSummary } from '../lib/progress'
import { AnimatedProgress } from './motion'
import { Alert } from './ui/alert'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

function ProgressCard({ topic }: { topic: TopicSummary }) {
  const performance = getPerformance(topic.averageScore)
  const score = Math.round(topic.averageScore)

  return (
    <Card interactive className="h-full">
      <CardContent className="flex h-full flex-col">
        <h2 className="text-xl font-semibold">{topic.topicName}</h2>

        <div className="mt-6">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Average score</span>
            <span className="font-medium">{score}%</span>
          </div>

          <AnimatedProgress
            value={topic.averageScore}
            className="h-3"
            barClassName={performance.progressClass}
          />
        </div>

        <dl className="mt-6 space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <dt>Attempts</dt>
            <dd className="font-medium text-foreground">{topic.attempts}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Last attempted</dt>
            <dd className="font-medium text-foreground">
              {formatProgressDate(topic.lastAttempted)}
            </dd>
          </div>
        </dl>

        {performance.isWeak && (
          <Alert variant="danger" className="mt-5">
            This topic needs more revision.
          </Alert>
        )}

        <div className="mt-auto pt-6">
          <Button variant="outline" className="w-full" asChild>
            <Link
              to="/mode-selection"
              search={{ subject: '', level: '', standard: '', topic: '' }}
            >
              Revise Topic
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgressCard
