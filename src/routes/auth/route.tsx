import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Logo } from '../../logo'

export const Route = createFileRoute('/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
  <div className='my-40 max-w-2xl mx-auto px-8 flex gap-5 flex-col md:flex-row items-start '>
    <div className='bg-amber-300 p-2 rounded'>
      <Logo className='text-3xl shrink-0' />
    </div>
    
      <Outlet />

  </div>
</div>
}
