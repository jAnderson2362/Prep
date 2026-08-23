import { ProtectedRoute } from '#/components/protected-route'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/exam')({
  component: Exam,
})

function Exam() {
  return (
    <ProtectedRoute>
      <div>Hello "/exam"!</div>
    </ProtectedRoute>
  )
}
