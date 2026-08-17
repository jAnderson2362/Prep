import { ProtectedRoute } from '#/components/protected-route'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/practice')({
  component: Practice,
})

function Practice() {
  return (
    <ProtectedRoute>
      <div>Hello "/practice"!</div>
    </ProtectedRoute>
  )
}
