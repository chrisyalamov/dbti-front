import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { availableSkus_queryOptionsObject } from '../../queries/skus'
import { SpinnerSmooth } from '../../components/Spinner'
import { SkuRow } from '../../components/SkuRow'

export const Route = createFileRoute('/_marketing/pricing')({
  component: RouteComponent,
})

function RouteComponent() {
  const skus = useQuery(availableSkus_queryOptionsObject)

  if (skus.isLoading) {
    return <SpinnerSmooth />
  }

  return <div className='max-w-xl w-full mx-auto px-8 flex flex-col gap-8 py-20 items-center'>
    <h2 className='text-3xl font-semibold text-center'>Pricing</h2>
    <p className='text-center opacity-60 text-sm max-w-[60ch] text-balance'>
      Carder uses a license model, allowing you full flexibility, depending on the size of the events you are running.
    </p>
    <div className='px-6 py-4 rounded-lg bg-neutral-500/10 w-full my-10'>
      <h3 className='font-medium mb-4'>How does licensing work?</h3>
      <p className='text-sm opacity-60'>
        As you invite attendees to your events, you will need to assign them a license, so they can unlock the Carder app. Licenses can be purchased in the admin portal. Volume purchasing discounts may be available for some license types.
      </p>
    </div>
    <div className='flex flex-col gap-5'>
      {
        skus.data?.length === 0
          ? <p className='opacity-50 text-sm'>No available licenses</p>
          : skus.data?.map((sku: any) => (
            <SkuRow key={sku.skuId} sku={sku} />
          ))
      }
    </div>
  </div>
}
