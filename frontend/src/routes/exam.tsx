import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exam')({
  component: Exam,
})

function Exam() {
  return <div>Hello "/exam"!</div>
}
