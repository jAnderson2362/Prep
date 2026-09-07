import {
	getPerformance,
	formatProgressDate,
	type TopicSummary,
} from '../lib/progress'

import { Link } from '@tanstack/react-router'

function ProgressCard({ topic }: { topic: TopicSummary }) {
	const performance = getPerformance(topic.averageScore)

	return (
		<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
			<div className="flex items-start justify-between gap-4">
				<h2 className="text-xl font-semibold text-slate-900">
					{topic.topicName}
				</h2>

				<span
					className={`rounded-full px-3 py-1 text-sm font-semibold ${performance.badgeClass}`}
				>
					{Math.round(topic.averageScore)}%
				</span>
			</div>

			<div className="mt-6">
				<div className="mb-2 flex justify-between text-sm">
					<span className="text-slate-600">
						Average score
					</span>

					<span className="font-medium text-slate-900">
						{Math.round(topic.averageScore)}%
					</span>
				</div>

				<div className="h-3 overflow-hidden rounded-full bg-slate-200">
					<div
						className={`h-full rounded-full ${performance.progressClass}`}
						style={{
							width: `${topic.averageScore}%`,
						}}
					/>
				</div>
			</div>

			<div className="mt-6 space-y-2 text-sm text-slate-600">
				<p>
					Attempts:{' '}
					<span className="font-medium text-slate-900">
						{topic.attempts}
					</span>
				</p>

				<p>
					Last attempted:{' '}
					<span className="font-medium text-slate-900">
						{formatProgressDate(topic.lastAttempted)}
					</span>
				</p>
			</div>

			{performance.isWeak && (
				<div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
					This topic needs more revision.
				</div>
			)}

			<Link
				to="/mode-selection"
				className="mt-6 block w-full rounded-lg border border-slate-300 px-4 py-2 text-center font-medium text-slate-700 transition hover:bg-slate-100"
			>
				Revise Topic
			</Link>
		</div>
	)
}

export default ProgressCard