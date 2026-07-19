import { createFileRoute } from '@tanstack/react-router';
import Hero from "../components/hero";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <main className="bg-gradient-to-b from-[#81A3F8] to-[#F0F3FE] text-slate-900">
      <Hero />
    </main>
  );
}
