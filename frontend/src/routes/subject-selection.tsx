import { createFileRoute, useNavigate  } from '@tanstack/react-router'



export const Route = createFileRoute('/subject-selection')({
  component: SubjectSelection,
})

function SubjectSelection() {
  const navigate = useNavigate();
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
      
          >
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
            className="w-full rounded-lg border border-slate-300 p-2">
            <option value="">Select a Subject</option>
            <option value="Mathematics">Mathematics</option>
            <option value="English">English</option>
            <option value="Science">Science</option>
            </select>
        </div>
          <div className="mt-6">
          <label
            htmlFor="topic" className="mb-2 block font-medium">
              Topic
          </label>
          <select
            id="topic"
            className="w-full rounded-lg border border-slate-300 p-2">
            <option value="">Select a Topic</option>
            <option value="Topic 1">Topic 1</option>
            <option value="Topic 2">Topic 2</option>
            <option value="Topic 3">Topic 3</option>
            </select>
        </div>
         <div className="mt-6">
          <label
            htmlFor="standard" className="mb-2 block font-medium">
              Standard
          </label>
          <select
            id="standard"
            className="w-full rounded-lg border border-slate-300 p-2">
            <option value="">Select a Standard</option>
            <option value="Standard 1">Algebra</option>
            <option value="Standard 2">Geometry</option>
            <option value="Standard 3">Calculus</option>
            </select>
        </div>
       
        <div className="mt-8">
          <button
            onClick={() => navigate({ to: "/mode-selection" })}
            className="w-full rounded-lg bg-blue-600 py-2 px-4 text-white hover:bg-blue-700"
            >
              Let's go!
          </button>
        </div>
        </div>
        </main>
   )
}
