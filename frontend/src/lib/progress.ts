export type Progress = {
  topicId: number
  topicName: string
  score: number
  totalQuestions: number
  attemptedAt: string
}

export type TopicSummary = {
  topicId: number
  topicName: string
  averageScore: number
  attempts: number
  lastAttempted: string
}

export function getTopicSummaries(
  progress: Progress[],
): TopicSummary[] {
  const topicMap = new Map<number, Progress[]>()

  for (const attempt of progress) {
    const existing = topicMap.get(attempt.topicId) ?? []

    topicMap.set(attempt.topicId, [
      ...existing,
      attempt,
    ])
  }

  return Array.from(topicMap.values()).map((attempts) => {
    const firstAttempt = attempts[0]

    const averageScore =
      attempts.reduce(
        (total, attempt) =>
          total +
          (attempt.score / attempt.totalQuestions) * 100,
        0,
      ) / attempts.length

    const latestAttempt = attempts.reduce((latest, attempt) => {
      return new Date(attempt.attemptedAt) >
        new Date(latest.attemptedAt)
        ? attempt
        : latest
    })

    return {
      topicId: firstAttempt.topicId,
      topicName: firstAttempt.topicName,
      averageScore,
      attempts: attempts.length,
      lastAttempted: latestAttempt.attemptedAt,
    }
  })
}

export function getPerformance(score: number) {
  if (score >= 80) {
    return {
      isWeak: false,
      badgeClass: 'bg-green-100 text-green-700',
      progressClass: 'bg-green-500',
    }
  }

  if (score >= 60) {
    return {
      isWeak: false,
      badgeClass: 'bg-yellow-100 text-yellow-700',
      progressClass: 'bg-yellow-500',
    }
  }

  return {
    isWeak: true,
    badgeClass: 'bg-red-100 text-red-700',
    progressClass: 'bg-red-500',
  }
}

export function formatProgressDate(date: string) {
  return new Date(date).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}