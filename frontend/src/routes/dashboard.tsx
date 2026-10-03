import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Play } from 'lucide-react'

import { ProtectedRoute } from '#/components/protected-route'
import { Stagger, StaggerItem } from '#/components/motion'
import { PageHeader, PageShell } from '#/components/page-shell'
import { getTopicSummaries, type Progress } from '#/lib/progress'
import { API_URL, getAuthHeaders } from '#/lib/api'

export const Route = createFileRoute('/dashboard')({
    component: Dashboard,
})

type Profile = {
    email: string
    created_at: string
    display_name: string
}

type ProgressResponse = {
    topic_id: number
    score: number
    total_questions: number
    attempted_at: string
}

function Dashboard() {
    const [displayName, setDisplayName] = useState('')
    const [progress, setProgress] = useState<Progress[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadDashboard() {
            try {
                const headers = getAuthHeaders()

                const [profileResponse, progressResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/auth/profile`, {
                            headers,
                        }),
                        fetch(`${API_URL}/progress`, {
                            headers,
                        }),
                    ])

                if (!profileResponse.ok || !progressResponse.ok) {
                    throw new Error('Failed to load dashboard data')
                }

                const profile: Profile = await profileResponse.json()
                const progressResult = await progressResponse.json()

                const progressData: ProgressResponse[] =
                    progressResult.data ?? []

                const formattedProgress: Progress[] = progressData.map(
                    (attempt) => ({
                        topicId: attempt.topic_id,
                        topicName: `Topic ${attempt.topic_id}`,
                        score: attempt.score,
                        totalQuestions: attempt.total_questions,
                        attemptedAt: attempt.attempted_at,
                    }),
                )

                setDisplayName(profile.display_name)
                setProgress(formattedProgress)
            } catch (error) {
                console.error('Failed to load dashboard:', error)
                setError('Unable to load your dashboard.')
            } finally {
                setLoading(false)
            }
        }

        loadDashboard()
    }, [])

    const topics = getTopicSummaries(progress)

    const recentTopics = [...topics]
        .sort(
            (a, b) =>
                new Date(b.lastAttempted).getTime() -
                new Date(a.lastAttempted).getTime(),
        )
        .slice(0, 3)

    const averageScore =
        topics.length > 0
            ? Math.round(
                  topics.reduce(
                      (sum, topic) => sum + topic.averageScore,
                      0,
                  ) / topics.length,
              )
            : 0

    return (
        <ProtectedRoute>
            <PageShell tone="hero" width="wide">
                <PageHeader
                    eyebrow="Dashboard"
                    title={`Welcome back${displayName ? `, ${displayName}` : ''}`}
                    description="Ready to continue your revision? Pick up where you left off or start something new."
                />

                {loading ? (
                    <div className="mt-10 text-muted-foreground">
                        Loading your dashboard...
                    </div>
                ) : error ? (
                    <div className="mt-10 rounded-2xl border border-danger bg-danger-soft p-6 text-danger-foreground">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Quick Actions */}
                        <section className="mt-10">
                            <h2 className="text-xl font-semibold">
                                Quick Actions
                            </h2>

                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <Link
                                    to="/subject-selection"
                                    className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                                            <Play className="size-5" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Start Revising
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Choose a subject and start a
                                                revision session.
                                            </p>
                                        </div>
                                    </div>

                                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    to="/subject-selection"
                                    className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <BookOpen className="size-5" />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                Choose a Subject
                                            </h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Pick a new topic to learn or
                                                practise.
                                            </p>
                                        </div>
                                    </div>

                                    <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </section>

                        {/* Recent Activity */}
                        <section className="mt-12">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        Recent Activity
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Continue revising topics you've
                                        recently studied.
                                    </p>
                                </div>

                                <Link
                                    to="/progress"
                                    className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
                                >
                                    View all
                                    <ArrowRight className="size-4" />
                                </Link>
                            </div>

                            {recentTopics.length > 0 ? (
                                <Stagger
                                    as="div"
                                    className="mt-5 grid gap-4 md:grid-cols-3"
                                    stagger={0.1}
                                >
                                    {recentTopics.map((topic) => {
                                        const score = Math.round(
                                            topic.averageScore,
                                        )

                                        return (
                                            <StaggerItem
                                                key={topic.topicId}
                                                className="h-full"
                                            >
                                                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold">
                                                            {topic.topicName}
                                                        </h3>

                                                        <p className="mt-1 text-sm text-muted-foreground">
                                                            Last studied{' '}
                                                            {new Date(
                                                                topic.lastAttempted,
                                                            ).toLocaleDateString(
                                                                'en-NZ',
                                                                {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric',
                                                                },
                                                            )}
                                                        </p>

                                                        <div className="mt-5">
                                                            <div className="flex items-center justify-between text-sm">
                                                                <span className="text-muted-foreground">
                                                                    Average
                                                                    score
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {score}%
                                                                </span>
                                                            </div>

                                                            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                                                <div
                                                                    className="h-full rounded-full bg-primary"
                                                                    style={{
                                                                        width: `${score}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <Link
                                                        to="/subject-selection"
                                                        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                                                    >
                                                        Continue
                                                        <ArrowRight className="size-4" />
                                                    </Link>
                                                </div>
                                            </StaggerItem>
                                        )
                                    })}
                                </Stagger>
                            ) : (
                                <div className="mt-5 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                                    <h3 className="font-semibold">
                                        No revision activity yet
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Start a revision session to see your
                                        progress here.
                                    </p>

                                    <Link
                                        to="/subject-selection"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground"
                                    >
                                        Start Revising
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </div>
                            )}
                        </section>

                        {/* Progress Summary */}
                        <section className="mt-12">
                            <h2 className="text-xl font-semibold">
                                Your Progress
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                                    <p className="text-sm text-muted-foreground">
                                        Topics attempted
                                    </p>
                                    <p className="mt-2 text-3xl font-bold">
                                        {topics.length}
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                                    <p className="text-sm text-muted-foreground">
                                        Average score
                                    </p>
                                    <p className="mt-2 text-3xl font-bold">
                                        {averageScore}%
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </PageShell>
        </ProtectedRoute>
    )
}