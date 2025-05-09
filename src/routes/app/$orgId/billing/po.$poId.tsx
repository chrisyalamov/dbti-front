import { createFileRoute } from '@tanstack/react-router'
import { po_queryOptionsObject } from '../../../../queries/po'
import { useQuery } from '@tanstack/react-query'
import { HorizontalRule } from '../../../../components/Divider'
import { Header } from '../../../../components/Header'
import { Spinner } from '../../../../components/Spinner'

export const Route = createFileRoute('/app/$orgId/billing/po/$poId')({
    component: RouteComponent,
})

function RouteComponent() {
    const { orgId, poId } = Route.useParams() as any

    const po = useQuery(po_queryOptionsObject(poId))

    if (po.isLoading || po.isPending || po.isRefetching) {
        return <Spinner />
    }


    let licenses = po.data?.licenses || []
    licenses = licenses.slice(0, 10)

    const total = po.data?.lineItems.reduce((acc: number, item: any) => {
        return acc + parseFloat(item.totalPrice)
    }, 0)

    return <div>
        <Header
            backNav={{
                label: "Back to billing",
                linkProps: { to: "/app/$orgId/billing", params: { orgId } },
            }}
        />

        <div className='my-10 gap-4 mx-auto max-w-7xl px-8'>
            <div className='flex gap-5 items-center justify-between line-clamp-1 mb-10'>
                <h1 className='text-2xl shrink line-clamp-2 break-words'>
                    <span className='text-sm opacity-50'>
                        Purchase Order    
                    </span><br />
                    <span className='opacity-30'>#</span>
                    <span className='font-[Share_Tech_Mono]'>{po.data?.purchaseOrder?.purchaseOrderId}</span>
                </h1>
                <p className={`
                        ${po.data?.purchaseOrder?.status === 'paid' ? 'text-green-600' : ''}
                        bg-current/10 rounded px-2 py-1 uppercase font-medium
                    `}>
                    {po.data?.purchaseOrder?.status}
                </p>
            </div>
            <div className='w-full grid grid-cols-[2fr_auto_auto_auto] gap-x-5 md:gap-x-10 lg:gap-x-28'>
                <div className=' py-3 border-b border-neutral-500/40 col-span-full grid grid-cols-subgrid mb-5 text-sm font-medium'>

                    <p>Item</p>
                    <p className='text-center'>Quantity</p>
                    <p className='text-right'>Unit price</p>
                    <p className='text-right'>Total</p>

                </div>
                {
                    po?.data?.lineItems.map((item: any) => (
                        <div key={item.id} className='py-2 not-last:border-b-hairline border-neutral-500/20 col-span-full grid grid-cols-subgrid text-sm'>
                            <p>
                                {item.skuName}
                            </p>
                            <p className='text-center'>
                                {item.quantity}
                            </p>
                            <p className='text-right'>
                                <span className='opacity-50 uppercase'>{item.currency} </span>
                                {parseFloat(item.unitPrice).toFixed(2)}
                            </p>
                            <p className='text-right'>
                                <span className='opacity-50 uppercase'>{item.currency} </span>
                                {parseFloat(item.totalPrice).toFixed(2)}
                            </p>

                        </div>
                    ))
                }
            </div>
            <HorizontalRule count={3} containerClassName='flex flex-col gap-px w-full my-4' />
            <div className='grid grid-cols-[2fr_auto] gap-x-5 md:gap-x-10 lg:gap-x-28'>
                <div className='col-span-full flex items-center justify-between gap-5 text-xl'>
                    <p className='font-medium'>Total</p>
                    <p className='font-medium'>
                        <span className='opacity-50 uppercase'>{po.data?.lineItems[0]?.currency} </span>
                        {parseFloat(total).toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    </div>
}
