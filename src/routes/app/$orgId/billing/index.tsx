import { createFileRoute, Link } from '@tanstack/react-router'
import { Header } from '../../../../components/Header'
import { useQuery } from '@tanstack/react-query'
import { orgPos_queryOptionsObject } from '../../../../queries/po'
import { Spinner } from '../../../../components/Spinner'

export const Route = createFileRoute('/app/$orgId/billing/')({
  component: RouteComponent,
})

const POStatus = ({ status }: { status: string }) => {
  return <span className={`
    ${status === "paid" ? "text-green-600" : ""}
    ${status === "canceled" ? "text-red-700" : ""} 
    uppercase bg-current/10 rounded-sm text-sm px-1.5
  `}>
    {status}
    </span>
}

const PurchaseOrderBlock = (props: any) => {
  return <Link
    to="/app/$orgId/billing/po/$poId"
    params={{ orgId: props.po.organisationId, poId: props.po.purchaseOrderId }}
    className='
      flex justify-between items-center gap-4
      hover:bg-neutral-500/10
      active:bg-neutral-500/5
      active:opacity-80
      px-1.5 -mx-1.5 rounded-sm py-0.5
    '
  >
      <span className='font-[Share_Tech_Mono]'>{props.po.purchaseOrderId}</span>
      <POStatus status={props.po.status} />
  </Link>
}

function RouteComponent() {
  const { orgId } = Route.useParams() as any

  const pos = useQuery(orgPos_queryOptionsObject(orgId))
  if (pos.isLoading || pos.isPending || pos.isRefetching ) {
    return <Spinner />
  }

  console.log(pos.data)

  return <div>
    <Header backNav={{
      label: "Back to Organisation",
      linkProps: { to: "/app/$orgId" }
    }} />

    <div className='max-w-7xl mx-auto px-8 my-10 mt-20'>
      <h1 className="text-2xl font-medium mb-10">
        Billing
      </h1>
      <div>
        {
          pos.data?.length > 0
            ? pos.data.map((po: any) => (
                <PurchaseOrderBlock key={po.purchaseOrderId} po={po} />
              ))
            : <p className='text-sm text-gray-500'>No purchase orders found</p>
        }
      </div>

    </div>
  </div>
}
