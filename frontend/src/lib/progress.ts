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

export function getTopicSummaries(progress: Progress[]): TopicSummary[] {
  const topicMap = new Map<number, Progress[]>()

  for (const attempt of progress) {
    const existing = topicMap.get(attempt.topicId) ?? []

    topicMap.set(attempt.topicId, [...existing, attempt])
  }

  return Array.from(topicMap.values()).map((attempts) => {
    const firstAttempt = attempts[0]

    const averageScore =
      attempts.reduce(
        (total, attempt) =>
          total + (attempt.score / attempt.totalQuestions) * 100,
        0,
      ) / attempts.length

    const latestAttempt = attempts.reduce((latest, attempt) => {
      return new Date(attempt.attemptedAt) > new Date(latest.attemptedAt)
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
  // Classes use the theme tokens so they work in light and dark mode.
  if (score >= 80) {
    return {
      isWeak: false,
      badgeClass: 'bg-success-soft text-success-foreground',
      progressClass: 'bg-success',
    }
  }

  if (score >= 60) {
    return {
      isWeak: false,
      badgeClass: 'bg-warning-soft text-warning-foreground',
      progressClass: 'bg-warning',
    }
  }

  return {
    isWeak: true,
    badgeClass: 'bg-danger-soft text-danger-foreground',
    progressClass: 'bg-danger',
  }
}

export function formatProgressDate(date: string) {
  return new Date(date).toLocaleDateString('en-NZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
