import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    This is an empty route, where the terms and conditions will be
    uploaded. This is a placeholder for now.
  </div>
}
