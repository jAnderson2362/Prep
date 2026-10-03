import { useEffect, useState } from 'react'
import ProgressCard from '#/components/progress-card'
import { ProtectedRoute } from '#/components/protected-route'
import { Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell } from '#/components/page-shell'
import { getTopicSummaries } from '#/lib/progress'
import { API_URL, getAuthHeaders } from '#/lib/api'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/progress')({
    component: Progress,
})

type Progress = {
    topicId: number
    topicName: string
    score: number
    totalQuestions: number
    attemptedAt: string
}

type ProgressResponse = {
    topic_id: number
    score: number
    total_questions: number
    attempted_at: string
}

function Progress() {
    const [progress, setProgress] = useState<Progress[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadProgress = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`${API_URL}/progress`, {
                    headers: getAuthHeaders(),
                })

                if (!response.ok) {
                    const errorText = await response.text()

                    throw new Error(
                        `Progress request failed (${response.status}): ${errorText}`,
                    )
                }

                const result = await response.json()

                const progressData: ProgressResponse[] = result.data ?? []

                const formattedProgress: Progress[] = progressData.map(
                    (attempt) => ({
                        topicId: attempt.topic_id,
                        topicName: `Topic ${attempt.topic_id}`,
                        score: attempt.score,
                        totalQuestions: attempt.total_questions,
                        attemptedAt: attempt.attempted_at,
                    }),
                )

                setProgress(formattedProgress)
            } catch (err) {
                console.error('Failed to load progress:', err)
                setError('Unable to load your progress.')
            } finally {
                setLoading(false)
            }
        }

        loadProgress()
    }, [])

    const topics = getTopicSummaries(progress)

    return (
        <ProtectedRoute>
            <PageShell tone="hero" width="wide">
                <PageHeader
                    eyebrow="Progress"
                    title="Revision Progress"
                    description="Track your performance and see which topics need more revision."
                />

                {loading && (
                    <p className="text-muted-foreground">
                        Loading your progress...
                    </p>
                )}

                {error && (
                    <p className="text-danger">
                        {error}
                    </p>
                )}

                {!loading && !error && topics.length === 0 && (
                    <div className="rounded-xl border border-border bg-card p-8 text-center">
                        <h2 className="text-lg font-semibold">
                            No progress yet
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Complete a revision session to start tracking your progress.
                        </p>
                    </div>
                )}

                {!loading && !error && topics.length > 0 && (
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
                )}
            </PageShell>
        </ProtectedRoute>
    )
}