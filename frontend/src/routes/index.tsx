import { createFileRoute } from '@tanstack/react-router';
import Hero from "../components/hero";
import ExamSystems from "../components/exam-systems";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="bg-gradient-to-b from-[#81A3F8] via-[#EAF0FE] to-[#8DA8F5] text-slate-900">
      <Hero />
      <ExamSystems />
    </main>
  );
}
