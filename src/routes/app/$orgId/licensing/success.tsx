import { createFileRoute, Link } from '@tanstack/react-router'
import { po_queryOptionsObject } from '../../../../queries/po'
import { useQuery } from '@tanstack/react-query'
import { IoCheckmarkCircle } from 'react-icons/io5'
import { HorizontalRule } from '../../../../components/Divider'
import { LicenseRow } from '../../../../components/LicenseRow'

export const Route = createFileRoute('/app/$orgId/licensing/success')({
    component: RouteComponent,
})

function RouteComponent() {
    const { po: poId } = Route.useSearch() as any
    const { orgId } = Route.useParams() as any

    const po = useQuery(po_queryOptionsObject(poId))
    let licenses = po.data?.licenses || []
    licenses = licenses.slice(0, 10)
    // Number of licenses that are not shown
    const spillover = po.data?.licenses.length - 10

    return <div className='my-10 px-8 mx-auto max-w-7xl flex flex-col items-center'>
        <IoCheckmarkCircle className='text-green-400 text-6xl mt-5' />
        <h1 className='
            font-medium text-3xl my-10 text-balance max-w-[30ch]
            text-green-600 text-center
        '>
            Your payment has been received successfully.
        </h1>
        <HorizontalRule count={3} containerClassName='w-full max-w-32 flex flex-col gap-px' />
        <div className='flex flex-col justify-center text-center my-10 gap-4'>
            <p className='text-sm opacity-60'>
                The following licenses have been provisioned to your organisation:
            </p>
            <div className='w-full max-w-3xl border border-neutral-500/40 rounded-sm px-4 pb-1.5'>
                {
                    licenses.map((license: any) => (
                        <LicenseRow
                            key={license.licenseId}
                            id={license.licenseId}
                            status={license.status}
                            type={license.type}
                            orgId={orgId}
                        />
                    ))
                }
                {
                    spillover > 0 && (
                        <div className='
                            my-4 text-sm opacity-50
                        '>
                            +{spillover} more licenses
                        </div>
                    )
                }
            </div>
            <Link
                to='/app/$orgId/licensing'
                params={{ orgId }}
                className='
                    text-sm px-2.5  h-10 flex items-center justify-center
                    rounded w-full cursor-pointer
                    bg-neutral-900 text-white
                    active:pt-0.5 active:opacity-90
                '>
                Go to Licenses
            </Link>
        </div>
    </div>
}
