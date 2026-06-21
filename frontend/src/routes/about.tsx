import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6">
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold mb-4">About</h1>
        <p className="text-base leading-7 text-slate-700">
          This route is kept simple to preserve a basic TanStack Router setup.
        </p>
      </div>
    </main>
  )
}
