import { createFileRoute, Link } from '@tanstack/react-router'
import { po_queryOptionsObject } from '../../../../queries/po'
import { useQuery } from '@tanstack/react-query'
import { IoArrowUndoCircleSharp, IoCloseCircle } from 'react-icons/io5'

export const Route = createFileRoute('/app/$orgId/licensing/cancel')({
    component: RouteComponent,
})

function RouteComponent() {
    const { po: poId } = Route.useSearch() as any
    const { orgId } = Route.useParams() as any

    const po = useQuery(po_queryOptionsObject(poId))
    let licenses = po.data?.licenses || []
    licenses = licenses.slice(0, 10)

    return <div className='my-10 px-8 mx-auto max-w-lg flex flex-col items-center'>
        <IoCloseCircle className='text-red-400 text-6xl mt-5' />
        <h1 className='
            font-medium text-3xl my-10 text-balance max-w-[30ch]
            text-red-600 text-center
        '>
            Your payment has been cancelled.
        </h1>
        <p className='opacity-60 text-sm my-10 '>
            No licenses have been provisioned to your organisation.
        </p>
        <Link
            to='/app/$orgId/licensing'
            params={{ orgId }}
            className='
                    text-sm px-2.5  h-8 flex items-center justify-center gap-2
                    rounded-sm cursor-pointer
                    bg-white ring-[0.5px] ring-neutral-500/40
                    active:bg-neutral-500/10 active:ring-neutral-500/40
                    active:pt-0.5 active:opacity-90
                '>
            <IoArrowUndoCircleSharp className='text-lg' />
            Back to licensing dashboard
        </Link>
    </div>
}
