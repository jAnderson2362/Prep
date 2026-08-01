import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/mode-selection')({
  component: ModeSelection,
});

function ModeSelection() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#81A3F8] to-[#F0F3FE] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-3 text-center text-4xl font-bold">
          Choose Your Study Mode
        </h1>

        <p className="mb-10 text-center text-slate-800">
          Select how you'd like to revise this topic.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          <Link
            to="/learn"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              Learn
            </h2>

            <p className="text-slate-600">
              description
            </p>
          </Link>

          <Link
            to="/practice"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              Practice
            </h2>

            <p className="text-slate-600">
              description
            </p>
          </Link>

          <Link
            to="/exam"
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <h2 className="mb-4 text-2xl font-semibold">
              Exam
            </h2>

            <p className="text-slate-600">
              description
            </p>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/subject-selection"
            className="inline-flex rounded-lg border border-slate-300 px-6 py-3 font-medium bg-white hover:bg-slate-100"
          >
            Change Topic
          </Link>
        </div>
      </div>
    </main>
  );
}