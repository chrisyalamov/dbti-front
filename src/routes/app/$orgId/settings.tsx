import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/$orgId/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/org/$orgId/settings"!</div>
}
