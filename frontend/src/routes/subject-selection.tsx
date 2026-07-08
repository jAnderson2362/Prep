import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/subject-selection')({
  component: SubjectSelection,
})

function SubjectSelection() {
  return <div>Hello "/subject-selection"!</div>
}
