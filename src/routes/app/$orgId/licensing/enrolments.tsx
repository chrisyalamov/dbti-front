import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$orgId/licensing/enrolments')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/org/$orgId/licensing/enrolments"!</div>
}
