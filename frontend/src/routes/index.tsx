import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6">
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold mb-4">Prep Frontend</h1>
        <p className="text-base leading-7 text-slate-700 mb-6">
          A minimal home route powered by TanStack Router.
        </p>
        <div className="flex flex-col gap-2">
          <Link to="/about" className="text-blue-600 hover:underline">
            Go to About
          </Link>
          <Link to="/products" className="text-blue-600 hover:underline">
            View Products
          </Link>
        </div>
      </div>
    </main>
  )
}
