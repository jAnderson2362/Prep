import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'


export const Route = createFileRoute('/subject-selection')({
  component: SubjectSelection,
})

function SubjectSelection() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("")
  const [subjects, setSubjects] = useState<{ id: number; name: string; level_subject_id: number }[]>([])
  const [level, setLevel] = useState("")
  const [topic, setTopic] = useState("")
  const [standard, setStandard] = useState("")
  const [standards, setStandards] = useState<{ id: number; name: string }[]>([])
  const [levelSubjectId, setLevelSubjectId] = useState<number | null>(null)
  const [topics, setTopics] = useState<{ id: number; name: string }[]>([])
  const [standardId, setStandardId] = useState<number | null>(null)

  useEffect(() => {
    if (!level) return;

    const levelId = level === "Level 1" ? 1 : level === "Level 2" ? 2 : 3;

    async function fetchSubjects() {
      try {
        const response = await fetch(`http://localhost:8000/levels/${levelId}/subjects`);
        const result = await response.json();
        setSubjects(result.data || []);
      } catch {
        setSubjects([]);
      }
    }
    fetchSubjects();
  }, [level]);

  useEffect(() => {
    if (!levelSubjectId) return;

    async function fetchStandards() {
      try {
        const response = await fetch(`http://localhost:8000/level-subjects/${levelSubjectId}/standards`);
        const result = await response.json();
        setStandards(result.data || []);
      } catch {
        setStandards([]);
      }
    }
    fetchStandards();
  }, [levelSubjectId]);

  useEffect(() => {
    if (!standardId) return;

    async function fetchTopics() {
      try {
        const response = await fetch(`http://localhost:8000/standards/${standardId}/topics`);
        const result = await response.json();
        setTopics(result.data || []);
      } catch {
        setTopics([]);
      }
    }
    fetchTopics();
  }, [standardId]);

  return (
    <main className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold mb-4">Subject Selection</h1>
        <p className="text-slate-700">
          Select your exam system, subject, level, standard and specific topic of your choice.
        </p>
        <div className="mt-8">
          <label
            htmlFor="exam-system" className="mb-2 block font-medium"
          >
            Exam System
          </label>
          <select
            id="exam-system"
            className="w-full rounded-lg border border-slate-300 p-2"
            defaultValue="NCEA"
          >
            <option value="NCEA">NCEA</option>
          </select>
        </div>
        <div className="mt-6">
          <label
            htmlFor="level" className="mb-2 block font-medium">
            Level
          </label>
          <select
            id="level"
            className="w-full rounded-lg border border-slate-300 p-2"
            value={level}
            onChange={(e) => setLevel(e.target.value)} >

            <option value="">Select a Level</option>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
          </select>
        </div>
        <div className="mt-6">
          <label
            htmlFor="subject" className="mb-2 block font-medium">
            Subject
          </label>
          <select
            id="subject"
            className="w-full rounded-lg border border-slate-300 p-2"
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              const picked = subjects.find((s) => s.name === e.target.value);
              setLevelSubjectId(picked ? picked.level_subject_id : null);
            }} >

            <option value="">Select a Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-6">
          <label
            htmlFor="standard" className="mb-2 block font-medium">
            Standard
          </label>
          <select
            id="standard"
            className="w-full rounded-lg border border-slate-300 p-2"
            value={standard}
            onChange={(e) => {
              setStandard(e.target.value);
              const picked = standards.find((s) => s.name === e.target.value);
              setStandardId(picked ? picked.id : null);
            }} >

            <option value="">Select a Standard</option>
            {standards.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
        <div className="mt-6">
          <label
            htmlFor="topic" className="mb-2 block font-medium">
            Topic
          </label>
          <select
            id="topic"
            className="w-full rounded-lg border border-slate-300 p-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)} >

            <option value="">Select a Topic</option>
            {topics.map((t) => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate({ to: "/mode-selection", search: { subject, level, standard, topic } })}
            className="w-full rounded-lg bg-blue-600 py-2 px-4 text-white hover:bg-blue-700"
          >
            Let's go!
          </button>
        </div>
      </div>
    </main>
  )
}
