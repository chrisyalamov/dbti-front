import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$orgId/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/org/$orgId/users/"!</div>
}
