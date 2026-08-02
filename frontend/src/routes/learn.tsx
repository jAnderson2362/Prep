import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

type WorkedExample = {
  problem: string;
  steps: string[];
  answer: string;
};

type LearnContent = {
  title: string;
  explanation: string;
  worked_examples: WorkedExample[];
  key_points: string[];
};

export const Route = createFileRoute('/learn')({
  component: Learn,
  validateSearch: (search) => ({
    subject: (search.subject as string) || "",
    level: (search.level as string) || "",
    standard: (search.standard as string) || "",
    topic: (search.topic as string) || "",
  }),
})

function Learn() {
  const { subject, level, standard, topic } = Route.useSearch();
  const [content, setContent] = useState<LearnContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContent() {
      try {
        const response = await fetch("http://localhost:8000/ai/generate-learn", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, level, standard, topic }),
        });
        const data = await response.json();
        console.log("LEARN RESPONSE:", data);
        setContent(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchContent();
  }, [subject, level, standard, topic]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
        <p className="text-lg text-slate-600">Generating your lesson...</p>
      </main>
    );
  }

  if (error || !content) {
    return (
      <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-600">Something went wrong generating your lesson.</p>
        <button
          onClick={() => navigate({ to: "/mode-selection", search: { subject, level, standard, topic } })}
          className="rounded-lg border border-slate-300 px-6 py-3 font-medium bg-white hover:bg-slate-100"
        >
          Go back
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="max-w-3xl w-full rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold mb-6">{content.title}</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Explanation</h2>
          <p className="text-slate-700 whitespace-pre-line">{content.explanation}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Worked Examples</h2>
          {content.worked_examples.map((example, i) => (
            <div key={i} className="mb-6 rounded-lg border border-slate-200 p-4">
              <p className="font-medium mb-2">{example.problem}</p>
              <ol className="list-decimal list-inside text-slate-700 mb-2">
                {example.steps.map((step, j) => (
                  <li key={j}>{step}</li>
                ))}
              </ol>
              <p className="font-medium text-slate-900">Answer: {example.answer}</p>
            </div>
          ))}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Key Points</h2>
          <ul className="list-disc list-inside text-slate-700">
            {content.key_points.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>
        </section>

        <button
          onClick={() => navigate({ to: "/mode-selection", search: { subject, level, standard, topic } })}
          className="rounded-lg border border-slate-300 px-6 py-3 font-medium bg-white hover:bg-slate-100"
        >
          Back to modes
        </button>
      </div>
    </main>
  );
}
