import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/practice')({
  component: Practice,
})

function Practice() {
  return <div>Hello "/practice"!</div>
}
