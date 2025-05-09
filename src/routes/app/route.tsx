import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { authState_queryOptionsObject } from '../../queries/authState'
import { SpinnerSmooth } from '../../components/Spinner'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/app')({
  component: RouteComponent,
})

function RouteComponent() {
    const authState = useQuery(authState_queryOptionsObject)

    if (authState.isLoading) {
        return <SpinnerSmooth />
    }

    if (!authState.data || !authState.data.userId) {
        return <div className='p-8'>
            <div className='max-w-lg mx-auto bg-neutral-500/10 rounded-lg overflow-hidden'>
                <div className='px-7 py-4'>
                    <h2 className='text-lg font-semibold mb-10'>You are not logged in.</h2>
                    <p className='opacity-60 text-sm max-w-[60ch] text-balance'>
                        You have tried to access a route that requires authentication. Please log in to your account to access this page.
                    </p>
                </div>
                <Link
                    to='/auth/login'
                    className='
                        w-full flex items-center justify-center gap-2 px-2 h-12 mt-3 text-sm
                        border-t-hairline border-t-neutral-500/20 cursor-pointer
                        hover:bg-neutral-500/10 active:bg-neutral-500/20 active:pt-0.5
                        focus-visible:focus-ring focus-visible:bg-neutral-500/10
                    '
                >
                    Log in
                </Link>
            </div>
        </div>
    } else {
        return <Outlet />
    }
}
