import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { availableSkus_queryOptionsObject } from '../../../../queries/skus'
import { Spinner } from '../../../../components/Spinner'
import { SkuRow } from '../../../../components/SkuRow'

export const Route = createFileRoute('/app/$orgId/licensing/purchase/')({
    component: RouteComponent,
})

function RouteComponent() {
    const orgId = Route.useParams().orgId as string
    const skus = useQuery({
        ...availableSkus_queryOptionsObject,
        throwOnError: true,
    })

    return <div className='grow'>
        <div className='flex flex-col gap-5'>
            {
                skus.isPending
                    ? <Spinner />
                    : skus.data?.length === 0
                        ? <p className='opacity-50 text-sm'>No available licenses</p>
                        : skus.data?.map((sku: any) => (
                            <SkuRow key={sku.skuId} sku={sku} orgId={orgId} />
                        ))
            }
        </div>
    </div>
}
