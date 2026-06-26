import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/learn')({
  component: Learn,
})

function Learn() {
  return <div>Hello "/learn"!</div>
}
